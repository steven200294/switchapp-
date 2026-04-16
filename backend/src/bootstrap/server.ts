import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { register, metricsMiddleware } from "../infra/metrics/prometheus.js";
import { errorHandler } from "../shared/middlewares/errorHandler.js";
import { apiLimiter } from "../shared/middlewares/rateLimiter.js";
import { authRouter } from "../modules/auth/index.js";
import { adminRouter } from "../modules/admin/index.js";
import { propertiesRouter } from "../modules/properties/index.js";
import { usersRouter } from "../modules/users/index.js";
import { swipesRouter } from "../modules/swipes/index.js";
import { matchesRouter } from "../modules/matches/index.js";
import { messagesRouter } from "../modules/messages/index.js";
import { favoritesRouter } from "../modules/favorites/index.js";
import { uploadsRouter } from "../modules/uploads/index.js";
import { verificationRouter } from "../modules/verification/index.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

const allowedOrigins = env.isDev
  ? true
  : env.frontendUrl.split(',').map((u) => u.trim()).filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(metricsMiddleware);
app.use("/api/v1", apiLimiter);

app.get("/api/v1/health", (_req, res) => {
  res.json({ data: { status: "ok", timestamp: new Date().toISOString() } });
});

// Prometheus metrics endpoint - accessible internally for scraping.
// In production, restrict access via network policies (not exposed publicly).
app.get("/api/v1/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/properties", propertiesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/swipes", swipesRouter);
app.use("/api/v1/matches", matchesRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/favorites", favoritesRouter);
app.use("/api/v1/uploads", uploadsRouter);
app.use("/api/v1/verification", verificationRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`API listening on port ${env.port}`);
  logger.info(`CORS origins: ${JSON.stringify(allowedOrigins)}`);
  logger.info(`NODE_ENV: ${env.nodeEnv}`);
});

export default app;
