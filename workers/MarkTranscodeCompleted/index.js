const { Pool } = require("pg");

module.exports = async function (context, myBlob) {
  context.log("Blob trigger fired for output:", context.bindingData.name);

  const blobName = context.bindingData.name;
  const pgConnectionString = process.env.PG_CONNECTION_STRING;
  const pool = new Pool({ connectionString: pgConnectionString });

  try {
    let column, videoName;
    if (blobName.includes("_480p.mp4")) {
      column = "480_status";
      videoName = blobName.replace("_480p.mp4", ".mp4");
    } else if (blobName.includes("_720p.mp4")) {
      column = "720_status";
      videoName = blobName.replace("_720p.mp4", ".mp4");
    } else {
      context.log("Unknown file format, skipping:", blobName);
      return;
    }

    await pool.query(
      `UPDATE videos SET ${column} = $1 WHERE id = $2`,
      [true, videoName]
    );
    context.log(`Marked ${videoName} ${column} as completed`);
  } catch (error) {
    context.log.error("Postgres error:", error);
    throw error;
  } finally {
    await pool.end();
  }
};
