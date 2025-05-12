import express, { Request, Response } from "express";
import jobApplicationRoutes from "./routes/jobApplication";
import applicationStageRoutes from "./routes/applicationStage";
import tagRoutes from "./routes/tag";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/job-applications", jobApplicationRoutes);
app.use("/application-stage", applicationStageRoutes);
app.use("/tags", tagRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
