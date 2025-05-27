import db from "../db";
import { createTagIfNotExists } from "./tag";

type Tag = { name: string; color_class: string };

export type JobApplicationWithTags = {
  id: number;
  job_title: string;
  company_name: string;
  location?: string | null;
  application_status?:
    | "wishlist"
    | "applied"
    | "interviewing"
    | "offer"
    | "rejected"
    | null;
  job_posting_url?: string | null;
  applied_date?: string | null;
  notes?: string | null;
  tags: Tag[];
};

type JobApplicationInput = {
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
  tags?: string[]; // tag names only
};

async function getJobApplicationById(
  id: number
): Promise<JobApplicationWithTags | null> {
  const result = await db.query(
    `
    SELECT 
      ja.*, 
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('name', t.name, 'color_class', t.color_class)
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) AS tags
    FROM job_applications ja
    LEFT JOIN job_application_tags jat ON ja.id = jat.job_application_id
    LEFT JOIN tags t ON jat.tag_id = t.id
    WHERE ja.id = $1
    GROUP BY ja.id
    `,
    [id]
  );
  return result.rows[0] ?? null;
}

async function getJobApplications(): Promise<JobApplicationWithTags[]> {
  const result = await db.query(
    `
    SELECT 
      ja.*, 
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('name', t.name, 'color_class', t.color_class)
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) AS tags
    FROM job_applications ja
    LEFT JOIN job_application_tags jat ON ja.id = jat.job_application_id
    LEFT JOIN tags t ON jat.tag_id = t.id
    GROUP BY ja.id
    ORDER BY ja.updated_at DESC NULLS LAST, ja.id DESC
    `
  );
  return result.rows;
}

async function createJobApplication(
  data: JobApplicationInput
): Promise<JobApplicationWithTags> {
  const {
    job_title,
    company_name,
    location,
    application_status,
    job_posting_url,
    applied_date,
    notes,
    tags,
  } = data;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      INSERT INTO job_applications 
        (job_title, company_name, location, application_status, job_posting_url, applied_date, notes) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id
      `,
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

    const jobApplicationId = result.rows[0].id;

    if (tags && tags.length > 0) {
      const tagResults = await client.query(
        `SELECT id FROM tags WHERE name = ANY($1)`,
        [tags]
      );
      const tagIds = tagResults.rows.map((row) => row.id);
      for (const tagId of tagIds) {
        await client.query(
          `INSERT INTO job_application_tags (job_application_id, tag_id) VALUES ($1, $2)`,
          [jobApplicationId, tagId]
        );
      }
    }

    await client.query("COMMIT");
    return (await getJobApplicationById(
      jobApplicationId
    )) as JobApplicationWithTags;
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Failed to create job application");
  } finally {
    client.release();
  }
}

async function updateJobApplication(
  id: number,
  data: JobApplicationInput
): Promise<JobApplicationWithTags | null> {
  const {
    job_title,
    company_name,
    location,
    application_status,
    job_posting_url,
    applied_date,
    notes,
    tags,
  } = data;

  console.log("Received update data:", data);

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      UPDATE job_applications
      SET job_title = $1,
          company_name = $2,
          location = $3,
          application_status = $4,
          job_posting_url = $5,
          applied_date = $6,
          notes = $7,
          updated_at = NOW()
      WHERE id = $8
      RETURNING id
      `,
      [
        job_title,
        company_name,
        location,
        application_status,
        job_posting_url,
        applied_date,
        notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `DELETE FROM job_application_tags WHERE job_application_id = $1`,
      [id]
    );

    if (tags && tags.length > 0) {
      for (const name of tags) {
        await createTagIfNotExists(name, "bg-gray-200 text-gray-800");
      }

      const tagResults = await client.query(
        `SELECT id FROM tags WHERE name = ANY($1)`,
        [tags]
      );
      const tagIds = tagResults.rows.map((row) => row.id);

      for (const tagId of tagIds) {
        await client.query(
          `INSERT INTO job_application_tags (job_application_id, tag_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [id, tagId]
        );
      }
    }

    await client.query("COMMIT");
    return await getJobApplicationById(id);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating job application:", err);
    throw new Error("Failed to update job application");
  } finally {
    client.release();
  }
}

async function deleteJobApplication(
  id: number
): Promise<JobApplicationWithTags | null> {
  const result = await db.query(
    "DELETE FROM job_applications WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] ?? null;
}

export {
  getJobApplications,
  getJobApplicationById,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
};
