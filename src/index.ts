import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { router } from "./interfaces/http/routes.js";
// Middleware setup
import { config } from "dotenv";
import { connectMongoDB } from "./infrastructure/db/mongo/connection.js";

// Load environment variables
config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );
app.use(morgan("combined"));
app.get("/health", (req: any, res: any) => {
  res.json({
    status: "ok",
    message: "Server is running",
    time: new Date().toISOString(),
  });
});
app.use("/api", router);
// Start server (connect to DB first)
const PORT = Number(process.env.PORT) || 5000;
const mongoURI = process.env.MONGO_URI || "";
async function start() {
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in environment");
    process.exit(1);
  }

  try {
    await connectMongoDB(mongoURI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });   
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

export { app };
