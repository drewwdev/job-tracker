import db from "../db";

type ApplicationTag = {
  job_application_id: number;
  tag_id: number;
};

async function createApplicationTag(data: ApplicationTag): Promise<number> {
  const { job_application_id, tag_id } = data;
  console.log("📌 createApplicationTag input:", { job_application_id, tag_id });

  try {
    console.log("💾 Inserting into application_tags...");

    const result = await db.query(
      `INSERT INTO application_tags (job_application_id, tag_id)
       VALUES ($1, $2)
       RETURNING id`,
      [job_application_id, tag_id]
    );
    return result.rows[0].id;
  } catch (err: any) {
    console.error("❌ DB insert failed:", err);
    if (err.code === "23505") {
      throw new Error("APPLICATION_TAG_EXISTS");
    }
    throw new Error("Failed to create application tag");
  }
}

async function getApplicationTagsByJobId(jobApplicationId: number) {
  const result = await db.query(
    `SELECT at.id, at.job_application_id, at.tag_id, t.name
     FROM application_tags at
     JOIN tags t ON at.tag_id = t.id
     WHERE at.job_application_id = $1`,
    [jobApplicationId]
  );
  return result.rows;
}

async function deleteApplicationTag(id: number) {
  const result = await db.query(
    "DELETE FROM application_tags WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function deleteApplicationTagByJobAndTag(
  jobApplicationId: number,
  tagId: number
) {
  const result = await db.query(
    `DELETE FROM application_tags
     WHERE job_application_id = $1 AND tag_id = $2
     RETURNING *`,
    [jobApplicationId, tagId]
  );
  return result.rows[0];
}

export {
  createApplicationTag,
  getApplicationTagsByJobId,
  deleteApplicationTag,
  deleteApplicationTagByJobAndTag,
};
