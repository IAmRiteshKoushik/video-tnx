import { BlobServiceClient, type BlockBlobClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";

// Get connection string and container name from environment variables
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "";

// Create the BlobServiceClient
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Helper function to get a block blob client
function getBlockBlobClient(filename: string): BlockBlobClient {
  return containerClient.getBlockBlobClient(filename);
}

// Helper function to generate a unique filename
function generateUniqueFilename(originalFilename: string): string {
  const extension = originalFilename.split(".").pop();
  return `${uuidv4()}.${extension}`;
}

// Helper function to get a blob URL
function getBlobUrl(blobName: string): string {
  return `${containerClient.url}/${blobName}`;
}

interface UploadVideoParams {
  title: string;
  description?: string;
  videoFile: File;
  thumbnail?: File | null;
}

export async function uploadVideo(params: UploadVideoParams): Promise<string> {
  try {
    // Generate unique filenames
    const filename = generateUniqueFilename(params.videoFile.name);

    // Upload video
    const blockBlobClient = getBlockBlobClient(`input/${filename}`);
    const arrayBuffer = await params.videoFile.arrayBuffer();
    await blockBlobClient.uploadData(arrayBuffer, {
      blobHTTPHeaders: { blobContentType: params.videoFile.type },
    });
    const url = getBlobUrl(`input/${filename}`);

    // Save video metadata to database
    const video = await prisma.video.create({
      data: {
        title: params.title,
        description: params.description || "",
        url: url,
      },
    });

    return video.id;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw new Error("Failed to upload video");
  }
}

export async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        uploadDate: "desc",
      },
    });
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Failed to fetch videos");
  }
}

export async function getVideoById(id: string) {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id,
      },
    });
    return video;
  } catch (error) {
    console.error("Error fetching video:", error);
    throw new Error("Failed to fetch video");
  }
}
