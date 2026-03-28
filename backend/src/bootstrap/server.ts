import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "../shared/middlewares/errorHandler.js";
import { authRouter } from "../modules/auth/index.js";
import { adminRouter } from "../modules/admin/index.js";
import { propertiesRouter } from "../modules/properties/index.js";
import { usersRouter } from "../modules/users/index.js";
import { swipesRouter } from "../modules/swipes/index.js";
import { matchesRouter } from "../modules/matches/index.js";
import { messagesRouter } from "../modules/messages/index.js";
import { favoritesRouter } from "../modules/favorites/index.js";

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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/properties", propertiesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/swipes", swipesRouter);
app.use("/api/v1/matches", matchesRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/favorites", favoritesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[api] listening on port ${PORT}`);
});

export default app;
