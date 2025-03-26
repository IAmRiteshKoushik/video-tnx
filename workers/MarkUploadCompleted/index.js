const { QueueServiceClient } = require("@azure/storage-queue");
const { Pool } = require("pg");

module.exports = async function (context, myBlob) {
  context.log("Blob trigger fired:", context.bindingData.name);

  const videoName = context.bindingData.name;
  const connectionString = process.env.AzureStorageConnectionString;
  const pgConnectionString = process.env.PG_CONNECTION_STRING;

  // Mark upload_completed in Postgres
  const pool = new Pool({ connectionString: pgConnectionString });
  try {
    await pool.query(
      "INSERT INTO videos (id, upload_status) VALUES ($1, $2) ON CONFLICT (video_name) DO UPDATE SET upload_completed = $2",
      [videoName, true]
    );
    context.log(`Marked ${videoName} upload as completed`);
  } catch (error) {
    context.log.error("Postgres error:", error);
    throw error;
  } finally {
    await pool.end();
  }

  // Queue transcoding jobs
  const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
  const queues = ["transcode-480p-queue", "transcode-720p-queue"];
  const message = Buffer.from(JSON.stringify({ video_name: videoName })).toString("base64");

  for (const queueName of queues) {
    const queueClient = queueServiceClient.getQueueClient(queueName);
    await queueClient.sendMessage(message);
    context.log(`Queued ${videoName} for ${queueName}`);
  }
};
