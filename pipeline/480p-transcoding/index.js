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
    const localOutputPath480p = path.join(
      localWorkersDir,
      `480p-${outputFilename}`,
    );

    await downloadFile(inputFilename, localInputPath);
    console.log(`📦 File Downloaded: ${localInputPath}`);

    const ffmpegCommand480p = `ffmpeg -i "${localInputPath}" -vf "scale=1280:144" "${localOutputPath480p}"`;

    await new Promise((resolve, reject) => {
      exec(ffmpegCommand480p, async (error) => {
        if (error) {
          console.error(" Error in 480p Transcoding:", error);
          reject(error);
          return;
        }
        console.log(` Transcoding Completed: 480p-${outputFilename}`);

        await uploadFile(`480p-${outputFilename}`, localOutputPath480p);
        console.log(` 480p File Uploaded: 480p-${outputFilename}`);

        fs.unlinkSync(localOutputPath480p);
        resolve();
      });
    });

    fs.unlinkSync(localInputPath);
  } catch (error) {
    console.error(" Error in Transcoding:", error);
  }
};

export default transcodeVideo;
