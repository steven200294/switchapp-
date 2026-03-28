import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "../shared/middlewares/errorHandler.js";

if (!process.env.API_PORT) {
  throw new Error("API_PORT environment variable is required");
}

const app = express();
const PORT = process.env.API_PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ data: { status: "ok", timestamp: new Date().toISOString() } });
});

// Must be registered last — catches all errors from routes above
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[api] listening on port ${PORT}`);
});

export default app;
