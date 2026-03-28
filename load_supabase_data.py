#!/usr/bin/env python3
"""
Load Supabase migration data into local PostgreSQL.

Reads JSON files from migration_data/ directory and inserts rows
into the corresponding tables using parameterized queries.

Usage:
    python load_supabase_data.py
"""

import json
import os
import sys
from pathlib import Path

import psycopg2
from psycopg2.extras import Json, execute_values

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "user": "switchapp",
    "password": "changeme",
    "dbname": "switchapp",
}

DATA_DIR = Path(__file__).parent / "migration_data"

# FK-safe load order. Files are named either "schema.table.json" or "table.json" (public).
LOAD_ORDER = [
    ("auth", "users"),
    ("public", "users"),
    ("public", "user_profiles"),
    ("public", "properties"),
    ("public", "city_districts"),
    ("public", "user_switch_passes"),
    ("public", "conversations"),
    ("public", "favorites"),
    ("public", "landlords"),
    ("public", "identity_verifications"),
    ("public", "notification_unlocks"),
    ("public", "property_likes"),
    ("public", "housing_documents"),
    ("public", "analytics_events"),
    ("public", "analytics_daily"),
    ("public", "user_search_preferences"),
    ("public", "notifications"),
    ("public", "kv_store_515d6ac6"),
]


def adapt_value(val):
    """Convert Python value to a psycopg2-compatible parameter."""
    if val is None:
        return None
    if isinstance(val, dict):
        return Json(val)
    if isinstance(val, list):
        # If list contains dicts, treat as jsonb array
        if val and isinstance(val[0], dict):
            return Json(val)
        # Otherwise treat as native postgres array
        return val
    return val


def load_table(conn, schema, table, rows, pk_cols=None):
    """
    Generic INSERT from a list of dicts.

    - Builds INSERT dynamically from the first row's keys.
    - Wraps dicts as Json, lists as postgres arrays.
    - Uses ON CONFLICT DO NOTHING for idempotency.
    """
    if not rows:
        print(f"  {schema}.{table}: 0 rows (empty data), skipping")
        return

    columns = list(rows[0].keys())
    col_list = ", ".join(f'"{c}"' for c in columns)
    placeholders = ", ".join(["%s"] * len(columns))

    conflict_clause = ""
    if pk_cols:
        pk_list = ", ".join(f'"{c}"' for c in pk_cols)
        conflict_clause = f" ON CONFLICT ({pk_list}) DO NOTHING"
    else:
        conflict_clause = " ON CONFLICT DO NOTHING"

    qualified = f'"{schema}"."{table}"' if schema != "public" else f'"{table}"'
    sql = f"INSERT INTO {qualified} ({col_list}) VALUES ({placeholders}){conflict_clause}"

    cur = conn.cursor()
    inserted = 0
    errors = 0
    for row in rows:
        values = tuple(adapt_value(row.get(c)) for c in columns)
        try:
            cur.execute(sql, values)
            if cur.rowcount > 0:
                inserted += cur.rowcount
        except Exception as e:
            errors += 1
            conn.rollback()
            print(f"    ERROR inserting into {schema}.{table}: {e}")
            print(f"    Row keys: {list(row.keys())}")
            continue
    conn.commit()
    cur.close()
    print(f"  {schema}.{table}: {inserted}/{len(rows)} rows inserted ({errors} errors)")


def file_for_table(schema, table):
    """Find the JSON file for a given schema.table."""
    if schema != "public":
        candidate = DATA_DIR / f"{schema}.{table}.json"
        if candidate.exists():
            return candidate
    candidate = DATA_DIR / f"{table}.json"
    if candidate.exists():
        return candidate
    candidate = DATA_DIR / f"{schema}.{table}.json"
    if candidate.exists():
        return candidate
    return None


def main():
    if not DATA_DIR.exists():
        print(f"ERROR: Data directory not found: {DATA_DIR}")
        print("Create it and add JSON files named like 'auth.users.json' or 'user_profiles.json'")
        sys.exit(1)

    print(f"Connecting to PostgreSQL at {DB_CONFIG['host']}:{DB_CONFIG['port']}...")
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False
    print("Connected.\n")

    # Ensure auth schema exists
    cur = conn.cursor()
    cur.execute("CREATE SCHEMA IF NOT EXISTS auth")
    conn.commit()
    cur.close()

    loaded = set()

    # Load in dependency order
    for schema, table in LOAD_ORDER:
        fpath = file_for_table(schema, table)
        if fpath is None:
            print(f"  {schema}.{table}: no data file found, skipping")
            continue

        with open(fpath, "r") as f:
            rows = json.load(f)

        if not isinstance(rows, list):
            print(f"  {schema}.{table}: file is not a JSON array, skipping")
            continue

        # Detect primary key from first row (assume 'id' if present)
        pk = None
        if rows:
            if "id" in rows[0]:
                pk = ["id"]
            elif "user_id" in rows[0] and table in (
                "user_profiles",
                "user_switch_passes",
                "user_search_preferences",
            ):
                pk = ["user_id"]

        load_table(conn, schema, table, rows, pk_cols=pk)
        loaded.add(fpath.name)

    # Load any remaining files not in the explicit order
    remaining = sorted(DATA_DIR.glob("*.json"))
    for fpath in remaining:
        if fpath.name in loaded:
            continue
        parts = fpath.stem.split(".", 1)
        if len(parts) == 2:
            schema, table = parts
        else:
            schema, table = "public", parts[0]

        with open(fpath, "r") as f:
            rows = json.load(f)
        if not isinstance(rows, list):
            continue

        pk = ["id"] if rows and "id" in rows[0] else None
        print(f"  (extra) ", end="")
        load_table(conn, schema, table, rows, pk_cols=pk)

    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
