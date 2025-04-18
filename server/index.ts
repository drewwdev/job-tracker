import express, { Request, Response } from "express";
import userRoutes from "./routes/user";
import jobApplicationRoutes from "./routes/jobApplication";
import applicationStageRoutes from "./routes/applicationStage";
import tagRoutes from "./routes/tag";
import authRoutes from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/job-applications", jobApplicationRoutes);
app.use("/application-stage", applicationStageRoutes);
app.use("/tags", tagRoutes);
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
