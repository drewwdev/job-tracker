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
    throw new Error("Failed to create job application");
  }
}

async function updateJobApplication(
  jobApplicationId: number,
  jobApplicationData: JobApplication
): Promise<JobApplication | null> {
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
      `UPDATE job_applications
   SET job_title = $1,
       company_name = $2,
       location = $3,
       application_status = $4,
       job_posting_url = $5,
       applied_date = $6,
       notes = $7,
       updated_at = NOW()
   WHERE id = $8
   RETURNING *`,
      [
        job_title,
        company_name,
        location,
        application_status,
        job_posting_url,
        applied_date,
        notes,
        jobApplicationId,
      ]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (err: any) {
    throw new Error("Failed to update job application");
  }
}

async function deleteJobApplication(jobApplicationId: number) {
  try {
    const result = await db.query(
      "DELETE FROM job_applications WHERE id = $1 RETURNING *",
      [jobApplicationId]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (err: any) {
    throw new Error("Failed to delete job application");
  }
}

async function getJobApplications() {
  const result = await db.query("SELECT * FROM job_applications");
  return result.rows;
}

export {
  getJobApplicationById,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobApplications,
};
