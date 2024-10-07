"use server";

import MyFile from "@/models/MyFile";
import { fileStatus } from "@/utils/constants";
import { dbConnector } from "@/utils/dbConnector";
import {
  dbObjectToJsObject,
  getContentWithPagination,
} from "@/utils/myFunctions";
import { getDownloadFileUrl } from "./AwsS3Service";

export async function saveFileInfo(myFile: IMyFile) {
  try {
    await dbConnector();

    const myFileModel = new MyFile(myFile);
    console.log("myFileModel >> ", myFileModel);
    const existingFolder = await MyFile.findById(myFile.parentFolder);

    if (existingFolder) {
      await MyFile.findByIdAndUpdate(myFile.parentFolder, {
        numberOfContent: existingFolder.numberOfContent + 1,
        size: existingFolder.size + myFile.size,
      });
    }

    const savedFileInfo = await myFileModel.save();
    return { message: "File info saved", id: savedFileInfo._id.toString() };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getFolders(userId: string) {
  try {
    await dbConnector();

    const userFolders = await MyFile.find({
      owner: userId,
      isFolder: true,
      status: { $ne: fileStatus.REMOVED },
    });

    return dbObjectToJsObject(userFolders);
  } catch (error: any) {
    return { error: error.message };
  }
}

// even for Delete and change last visited Date
export async function updateFileInfo(myFile: IMyFile) {
  try {
    await dbConnector();

    const myFileModel = await MyFile.findByIdAndUpdate(myFile._id, myFile, {
      new: true,
    });
    return { message: "File info updated", data: myFileModel };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getAllFiles(
  userFolderId: string,
  page: string,
  search: string
) {
  await dbConnector();

  const files = await MyFile.find({
    parentFolder: userFolderId,
    status: { $ne: fileStatus.REMOVED },
  });

  const filesPerPage = getContentWithPagination(files, page, search);

  return dbObjectToJsObject(filesPerPage);
}

export async function getRecentFiles(userId: string) {
  await dbConnector();

  const files = await MyFile.find({
    owner: userId,
    isFolder: false,
    status: { $ne: fileStatus.REMOVED },
    visited: { $ne: null },
  });

  // Desc Sorting
  let visitedA = null;
  let visitedB = null;

  files.sort((a, b) => {
    visitedA = a.visited ? a.visited : new Date("01/01/1990");
    visitedB = b.visited ? b.visited : new Date("01/01/1990");

    return visitedB.getTime() - visitedA.getTime();
  });

  const first8Files = files.slice(0, 8);

  return dbObjectToJsObject(first8Files);
}

export async function findById(id: string) {
  await dbConnector();
  const fileInfo = await MyFile.findById(id);
  return dbObjectToJsObject(fileInfo);
}

export async function downloadFile(
  key: string,
  fileName: string
): Promise<Blob> {
  try {
    // Create a new Blob object
    const { downloadUrl: url } = await getDownloadFileUrl(key);
    const blob = await fetch(url).then((response) => response.blob());

    return dbObjectToJsObject(blob);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}
