import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// Middleware setup
import { config } from "dotenv";

// Load environment variables
config();

try {
    console.log("Starting server...");
} 
catch (error) {
    console.error(error);
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(morgan("combined"));
app.get("/health", (res: any) => {
    res.json({
        status:"ok",
        message: "Server is running",
        time: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
export default app;