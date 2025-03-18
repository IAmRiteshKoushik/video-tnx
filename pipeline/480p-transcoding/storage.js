import { BlobServiceClient } from "@azure/storage-blob";
import fs from "node:fs";
require("dotenv").config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING,
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER,
);

export const downloadFile = async (blobName, downloadPath) => {
  console.log(` Downloading file: ${blobName} -> ${downloadPath}`);

  if (!blobName) {
    throw new Error(" Error: blobName is undefined.");
  }

  const blobClient = containerClient.getBlobClient(blobName);
  const downloadBlockBlobResponse = await blobClient.download();
  const downloadedContent = await streamToBuffer(
    downloadBlockBlobResponse.readableStreamBody,
  );

  fs.writeFileSync(downloadPath, downloadedContent);
  console.log(` File Saved: ${downloadPath}`);
};

// 📤 Function to Upload File to Blob Storage
export const uploadFile = async (
  blobName,
  filePath,
  targetContainer = process.env.AZURE_STORAGE_TARGET_CONTAINER,
) => {
  console.log(` Uploading file: ${filePath} -> ${targetContainer}/${blobName}`);

  const targetContainerClient =
    blobServiceClient.getContainerClient(targetContainer);
  const blockBlobClient = targetContainerClient.getBlockBlobClient(blobName);
  const fileData = fs.readFileSync(filePath);
  await blockBlobClient.upload(fileData, fileData.length);

  console.log(` File Uploaded to ${targetContainer}: ${blobName}`);
};

// Convert Stream to Buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => chunks.push(data));
    readableStream.on("end", () => resolve(Buffer.concat(chunks)));
    readableStream.on("error", reject);
  });
}
