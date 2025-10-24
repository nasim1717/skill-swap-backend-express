import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoute from "./routes/uploadRoute.js";
import matchingRoute from "./routes/matchingRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/matches", matchingRoute);

app.use(errorHandler);

export default app;
