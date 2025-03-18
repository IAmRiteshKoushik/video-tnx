import { downloadFile, uploadFile } from "../storage.js";
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const transcodeVideo = async (inputFilename, outputFilename) => {
  try {
    console.log(`🎥 Transcoding Video: ${inputFilename} -> ${outputFilename}`);

    if (!inputFilename || !outputFilename) {
      throw new Error(" Error: Missing input or output filename.");
    }

    const localWorkersDir = path.join(__dirname, "workers");
    if (!fs.existsSync(localWorkersDir)) {
      fs.mkdirSync(localWorkersDir, { recursive: true });
    }

    const localInputPath = path.join(localWorkersDir, inputFilename);
    const localOutputPath720p = path.join(
      localWorkersDir,
      `720p-${outputFilename}`,
    );

    await downloadFile(inputFilename, localInputPath);
    console.log(`📦 File Downloaded: ${localInputPath}`);

    const ffmpegCommand720p = `ffmpeg -i "${localInputPath}" -vf "scale=1280:1920" "${localOutputPath480p}"`;

    await new Promise((resolve, reject) => {
      exec(ffmpegCommand720p, async (error) => {
        if (error) {
          console.error(" Error in 720p Transcoding:", error);
          reject(error);
          return;
        }
        console.log(` Transcoding Completed: 720p-${outputFilename}`);

        await uploadFile(`720p-${outputFilename}`, localOutputPath480p);
        console.log(` 720p File Uploaded: 720p-${outputFilename}`);

        fs.unlinkSync(localOutputPath720p);
        resolve();
      });
    });

    fs.unlinkSync(localInputPath);
  } catch (error) {
    console.error(" Error in Transcoding:", error);
  }
};

export default transcodeVideo;
