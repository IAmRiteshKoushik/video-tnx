const { QueueClient } = require("@azure/storage-queue");
const { Client } = require('pg');

const databaseConnectionString = process.env.DATABASE_CONNECTION_STRING;
const queueConnectionString1 = process.env.QUEUE_CONNECTION_STRING_1;
const queueName1 = process.env.QUEUE_NAME_1;
const queueConnectionString2 = process.env.QUEUE_CONNECTION_STRING_2;
const queueName2 = process.env.QUEUE_NAME_2;
const tableName = process.env.DATABASE_TABLE_NAME;

module.exports = async function (context, myBlob) {
  context.log("JavaScript blob trigger function processed blob");
  context.log("Name:", context.bindingData.name);
  context.log("Container:", context.bindingData.container);
  context.log("Blob Size:", myBlob.length, "bytes");

  const blobUrl = `https://${context.bindingData.accountName}.blob.core.windows.net/${context.bindingData.container}/${context.bindingData.name}`;
  const blobName = context.bindingData.name;
  const containerName = context.bindingData.container;
  const eventTime = new Date(); // Approximate creation time

  const queueClient1 = new QueueClient(queueConnectionString1, queueName1);
  const queueClient2 = new QueueClient(queueConnectionString2, queueName2);

  const client = new Client({
    connectionString: databaseConnectionString,
  });

  try {
    const queueMessage = {
      eventType: "Microsoft.Storage.BlobCreated (via Blob Trigger)",
      blobUrl: blobUrl,
      blobName: blobName,
      containerName: containerName,
      eventTime: eventTime.toISOString()
    };
    const encodedMessage = Buffer.from(JSON.stringify(queueMessage)).toString('base64');

    // Adding event to both queues
    await queueClient1.sendMessage(encodedMessage);
    context.log(`Message added to queue 1 (${queueName1}): ${JSON.stringify(queueMessage)}`);
    await queueClient2.sendMessage(encodedMessage);
    context.log(`Message added to queue 2 (${queueName2}): ${JSON.stringify(queueMessage)}`);

    // Insertion needs to take place inside of database
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
      false
    ];

    const res = await client.query(query, values);
    context.log(`Database updated with ID: ${res.rows[0].id}`);

  } catch (error) {
    context.error(`Error processing blob: ${error}`);
  } finally {
    await client.end();
  }
};
