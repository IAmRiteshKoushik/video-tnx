import { Client } from "pg";

const databaseConnectionString = process.env.DATABASE_CONNECTION_STRING;
const tableName = process.env.DATABASE_TABLE_NAME;

export default async function (context, myBlob) {
  context.log("Name:", context.bindingData.name);
  context.log("Container:", context.bindingData.container);
  context.log("Blob Size:", myBlob.length, "bytes");

  const blobUrl = `https://${context.bindingData.accountName}.blob.core.windows.net/${context.bindingData.container}/${context.bindingData.name}`;
  const blobName = context.bindingData.name;
  const containerName = context.bindingData.container;
  const eventTime = new Date(); // Approximate creation time

  const client = new Client({
    connectionString: databaseConnectionString,
  });

  try {
    await client.connect();
    const query = `
            INSERT INTO ${tableName} (event_type, blob_url, blob_name, container_name, event_time, processed)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
    const values = [
      "Microsoft.Storage.BlobCreated (via Blob Trigger)",
      blobUrl,
      blobName,
      containerName,
      eventTime,
      true,
    ];

    const res = await client.query(query, values);
    context.log(`Database updated with ID: ${res.rows[0].id}`);
  } catch (error) {
    context.error(`Error processing blob: ${error}`);
  } finally {
    await client.end();
  }
}
