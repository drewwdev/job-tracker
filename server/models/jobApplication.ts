import db from "../db";

type JobApplication = {
  job_title: string;
  company_name: string;
  location?: string;
  application_status?:
    | "wishlist"
    | "applied"
    | "interviewing"
    | "offer"
    | "rejected";
  job_posting_url?: string;
  applied_date?: Date;
  notes?: string;
};

async function getJobApplicationById(jobApplicationId: number) {
  const result = await db.query(
    "SELECT * FROM job_applications WHERE id = $1",
    [jobApplicationId]
  );
  return result.rows[0];
}

async function createJobApplication(
  jobApplicationData: JobApplication
): Promise<number> {
  const {
    job_title,
    company_name,
    location,
    application_status,
    job_posting_url,
    applied_date,
    notes,
  } = jobApplicationData;

  try {
    const result = await db.query(
      "INSERT INTO job_applications (job_title, company_name, location, application_status, job_posting_url, applied_date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [
        job_title,
        company_name,
        location,
        application_status,
        job_posting_url,
        applied_date,
        notes,
      ]
    );

    return result.rows[0].id;
  } catch (err: any) {
    console.error("🔥 DB error:", err);
    throw new Error("Failed to create job application");
  }
}

export { getJobApplicationById, createJobApplication };
