"use server";

import { revalidatePath } from "next/cache";
import { uploadVideo } from "@/lib/azure-storage";

export async function uploadVideoAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoFile = formData.get("videoFile") as File;

    if (!title || !videoFile) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    const videoId = await uploadVideo({
      title,
      description,
      videoFile,
    });

    revalidatePath("/videos");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Video uploaded successfully",
      videoId,
    };
  } catch (error) {
    console.error("Error in uploadVideoAction:", error);
    return {
      success: false,
      message: "Failed to upload video",
    };
  }
}
