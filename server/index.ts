import express, { Request, Response } from "express";
import jobApplicationRoutes from "./routes/jobApplication";
import applicationStageRoutes from "./routes/applicationStage";
import tagRoutes from "./routes/tag";
import applicationTagRoutes from "./routes/applicationTag";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/job-applications", jobApplicationRoutes);
app.use("/application-stage", applicationStageRoutes);
app.use("/tags", tagRoutes);
app.use("/application-tags", applicationTagRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
