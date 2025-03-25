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
  video480p: File;
  video720p: File;
  thumbnail?: File | null;
}

export async function uploadVideo(params: UploadVideoParams): Promise<string> {
  try {
    // Generate unique filenames
    const filename480p = generateUniqueFilename(params.video480p.name);
    const filename720p = generateUniqueFilename(params.video720p.name);
    let thumbnailFilename = "";

    // Upload 480p video
    const blockBlobClient480p = getBlockBlobClient(
      `videos/480p/${filename480p}`,
    );
    const arrayBuffer480p = await params.video480p.arrayBuffer();
    await blockBlobClient480p.uploadData(arrayBuffer480p, {
      blobHTTPHeaders: { blobContentType: params.video480p.type },
    });
    const url480p = getBlobUrl(`videos/480p/${filename480p}`);

    // Upload 720p video
    const blockBlobClient720p = getBlockBlobClient(
      `videos/720p/${filename720p}`,
    );
    const arrayBuffer720p = await params.video720p.arrayBuffer();
    await blockBlobClient720p.uploadData(arrayBuffer720p, {
      blobHTTPHeaders: { blobContentType: params.video720p.type },
    });
    const url720p = getBlobUrl(`videos/720p/${filename720p}`);

    // Upload thumbnail if provided
    let thumbnailUrl = "";
    if (params.thumbnail) {
      thumbnailFilename = generateUniqueFilename(params.thumbnail.name);
      const blockBlobClientThumbnail = getBlockBlobClient(
        `thumbnails/${thumbnailFilename}`,
      );
      const arrayBufferThumbnail = await params.thumbnail.arrayBuffer();
      await blockBlobClientThumbnail.uploadData(arrayBufferThumbnail, {
        blobHTTPHeaders: { blobContentType: params.thumbnail.type },
      });
      thumbnailUrl = getBlobUrl(`thumbnails/${thumbnailFilename}`);
    }

    // Save video metadata to database
    const video = await prisma.video.create({
      data: {
        title: params.title,
        description: params.description || "",
        url480p,
        url720p,
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

export async function deleteVideo(id: string): Promise<boolean> {
  try {
    // First, get the video to find the blob URLs
    const video = await prisma.video.findUnique({
      where: {
        id,
      },
    });

    if (!video) {
      return false;
    }

    // Extract blob names from URLs
    const extractBlobName = (url: string) => {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(containerName.length + 2); // +2 for the slashes
    };

    // Delete the blobs from Azure
    try {
      // Delete 480p video
      const blobName480p = extractBlobName(video.url480p);
      const blockBlobClient480p = getBlockBlobClient(blobName480p);
      await blockBlobClient480p.delete();

      // Delete 720p video
      const blobName720p = extractBlobName(video.url720p);
      const blockBlobClient720p = getBlockBlobClient(blobName720p);
      await blockBlobClient720p.delete();

      // Delete thumbnail if exists
      if (video.thumbnailUrl) {
        const blobNameThumbnail = extractBlobName(video.thumbnailUrl);
        const blockBlobClientThumbnail = getBlockBlobClient(blobNameThumbnail);
        await blockBlobClientThumbnail.delete();
      }
    } catch (error) {
      console.error("Error deleting blobs:", error);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.video.delete({
      where: {
        id,
      },
    });

    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new Error("Failed to delete video");
  }
}
