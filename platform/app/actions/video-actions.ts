"use server";

import { revalidatePath } from "next/cache";
import { uploadVideo, deleteVideo } from "@/lib/azure-storage";

export async function uploadVideoAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const video480p = formData.get("video480p") as File;
    const video720p = formData.get("video720p") as File;
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!title || !video480p || !video720p) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    const videoId = await uploadVideo({
      title,
      description,
      video480p,
      video720p,
      thumbnail,
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

export async function deleteVideoAction(id: string) {
  try {
    const success = await deleteVideo(id);

    if (success) {
      revalidatePath("/videos");
      revalidatePath("/admin/dashboard");

      return {
        success: true,
        message: "Video deleted successfully",
      };
    }

    return {
      success: false,
      message: "Failed to delete video",
    };
  } catch (error) {
    console.error("Error in deleteVideoAction:", error);
    return {
      success: false,
      message: "Failed to delete video",
    };
  }
}
