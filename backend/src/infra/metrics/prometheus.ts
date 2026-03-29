import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';
import type { Request, Response, NextFunction } from 'express';

export const register = new Registry();

register.setDefaultLabels({ app: 'switchapp-api' });
collectDefaultMetrics({ register });

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'] as const,
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'] as const,
  registers: [register],
});

export const httpErrorTotal = new Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors (4xx and 5xx)',
  labelNames: ['method', 'route', 'status_code'] as const,
  registers: [register],
});

export const activeUsers = new Counter({
  name: 'auth_logins_total',
  help: 'Total number of successful logins',
  registers: [register],
});

export const swipesTotal = new Counter({
  name: 'swipes_total',
  help: 'Total number of swipes',
  labelNames: ['action'] as const,
  registers: [register],
});

export const matchesTotal = new Counter({
  name: 'matches_total',
  help: 'Total number of matches created',
  registers: [register],
});

function normalizeRoute(req: Request): string {
  const route = req.route?.path;
  if (route) return `${req.baseUrl}${route}`;
  return req.path.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ':id');
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/api/v1/metrics') { next(); return; }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationSec = durationNs / 1e9;
    const route = normalizeRoute(req);
    const labels = { method: req.method, route, status_code: String(res.statusCode) };

    httpRequestDuration.observe(labels, durationSec);
    httpRequestTotal.inc(labels);

    if (res.statusCode >= 400) {
      httpErrorTotal.inc(labels);
    }
  });

  next();
}
