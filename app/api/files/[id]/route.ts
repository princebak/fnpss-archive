import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isUserAllowedToAccessThisFile } from "@/services/MyFileService";

export async function GET(request: any, { params }: any) {
  // Check if the user is logged in
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const extension = url.searchParams.get("extension");
  const download = url.searchParams.get("download");

  if (!extension) {
    return new Response(
      JSON.stringify({
        error: "Bad request: the extension is required as url query param.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { id } = params;

  try {
    // Check if the user has the access right on the file
    const doesUserHaveAccessRight: boolean =
      await isUserAllowedToAccessThisFile(session.user, id);

    if (!doesUserHaveAccessRight) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Define the path to the 'local_storage' folder
    const fileNameWithExtension = `${id}.${extension}`;
    const filePath = path.join(
      process.cwd(),
      "local_storage",
      fileNameWithExtension
    );

    // Check if the file exists by trying to access it
    await fs.access(filePath);

    // Read the file
    const data = await fs.readFile(filePath);

    // Determine content type based on file extension
    const ext = path.extname(fileNameWithExtension).toLowerCase();
    const mimeTypes: any = {
      // Text
      ".txt": "text/plain",
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",

      // Images
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".bmp": "image/bmp",
      ".ico": "image/x-icon",
      ".tiff": "image/tiff",

      // Audio
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      //  ".ogg": "audio/ogg",
      ".m4a": "audio/mp4",
      ".flac": "audio/flac",
      ".aac": "audio/aac",
      ".wma": "audio/x-ms-wma",

      // Video
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".ogg": "video/ogg",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".mkv": "video/x-matroska",
      ".flv": "video/x-flv",
      ".wmv": "video/x-ms-wmv",
      ".m4v": "video/x-m4v",

      // Documents
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      // Archives
      ".zip": "application/zip",
      ".rar": "application/x-rar-compressed",
      ".tar": "application/x-tar",
      ".gz": "application/gzip",
      ".7z": "application/x-7z-compressed",

      // Misc
      ".xml": "application/xml",
      ".csv": "text/csv",
    };

    /**
     * if the download param is "false" or if the file extension is not included in
     * our mimeTypes list, we send download the file on user local storage,
     * else we just open the file in the user bowser
     */
    const contentType =
      download?.toLocaleLowerCase() === "true" || mimeTypes[ext] === undefined
        ? "application/octet-stream"
        : mimeTypes[ext];

    // Return a response with the appropriate content type and file data
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error: any) {
    // Handle errors (file not found, read error, etc.)
    console.log("Get file Error : ", error.message);
    return new Response(
      JSON.stringify({ error: "File not found or cannot be read" }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
