import db from "../db";

type ApplicationStage = {
  id: number;
  job_application_id: number;
  stage_type: string;
  stage_date?: string;
  notes?: string;
};

async function createApplicationStage(
  applicationStageData: Omit<ApplicationStage, "id">
): Promise<number> {
  const { job_application_id, stage_type, stage_date, notes } =
    applicationStageData;

  try {
    const result = await db.query(
      "INSERT INTO application_stages (job_application_id, stage_type, stage_date, notes) VALUES ($1, $2, $3, $4) RETURNING id",
      [job_application_id, stage_type, stage_date, notes]
    );

    return result.rows[0].id;
  } catch (err: any) {
    if (err.code === "23505") {
      throw new Error("APPLICATION_STAGE_NAME_TAKEN");
    }
    throw err;
  }
}

async function getApplicationStageById(
  applicationStageId: number
): Promise<ApplicationStage | null> {
  const result = await db.query(
    "SELECT * FROM application_stages WHERE id = $1",
    [applicationStageId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function updateApplicationStage(
  applicationStageId: number,
  applicationStageData: Partial<ApplicationStage>
): Promise<ApplicationStage | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const [key, value] of Object.entries(applicationStageData)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) {
    return null;
  }

  const query = `
    UPDATE application_stages
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;
  values.push(applicationStageId);

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function deleteApplicationStage(
  applicationStageId: number
): Promise<boolean> {
  const result = await db.query(
    "DELETE FROM application_stages WHERE id = $1",
    [applicationStageId]
  );

  if (!result || typeof result.rowCount !== "number") {
    throw new Error("Unexpected DB response");
  }

  return result.rowCount > 0;
}

export {
  createApplicationStage,
  getApplicationStageById,
  updateApplicationStage,
  deleteApplicationStage,
};
