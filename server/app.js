import express from "express";
import cors from "cors";

import employeeRoutes from "./routes/employeeRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import bonusRoutes from "./routes/bonusRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/bonuses", bonusRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
