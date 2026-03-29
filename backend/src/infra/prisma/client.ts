import { PrismaClient } from "@prisma/client";
import { env } from "../../config/env.js";

const prisma = new PrismaClient({
  datasources: {
    db: { url: env.database.effectiveUrl },
  },
});

export default prisma;
