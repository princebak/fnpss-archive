"use server";

import { createWriteStream, promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";

export async function saveToLocalStorage(file: any, fileName:string) {
  try {
    if (!file || !file.stream) {
      return { error: "Invalid file upload" };
    }

    // Define the path to save the file
    const localStoragePath = path.join(process.cwd(), "local_storage");
    const filePath = path.join(localStoragePath, fileName);

    // Ensure the local_storage folder exists
    await fs.mkdir(localStoragePath, { recursive: true });

    // Convert the Web Stream to a Node.js Readable stream
    const readableStream = Readable.fromWeb(file.stream());

    // Save the file to the local_storage folder
    const writeStream = createWriteStream(filePath);

    // Pipe the file's readable stream to the write stream
    await new Promise<void>((resolve, reject) => {
      readableStream.pipe(writeStream);
      readableStream.on("end", resolve);
      readableStream.on("error", reject);
    });

    // Respond with success
    return {
      message: "File saved successfully",
      fileName: fileName,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
