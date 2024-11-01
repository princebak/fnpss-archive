"use server";

import MyFile from "@/models/MyFile";
import { fileStatus } from "@/utils/constants";
import { dbConnector } from "@/utils/dbConnector";
import {
  dbObjectToJsObject,
  getContentWithPagination,
  getFileNameWithoutExtension,
} from "@/utils/myFunctions";
import { getDownloadFileUrl } from "./AwsS3Service";

export async function saveFileInfo(myFile: IMyFile, shouldUpdateAlert: string) {
  try {
    await dbConnector();
    if (!myFile.parentFolder) {
      myFile.parentFolder = myFile.owner;
    }

    if (!myFile.name) {
      myFile = {
        ...myFile,
        name: getFileNameWithoutExtension(myFile.originalName!),
      };
    }

    if (shouldUpdateAlert === "true") {
      myFile.alertDate = myFile.alertDate ? myFile.alertDate : null;
      myFile.scheduledDate = myFile.scheduledDate ? myFile.scheduledDate : null;
      myFile.alertReason = myFile.alertReason ? myFile.alertReason : null;
    }

    const myFileModel = new MyFile(myFile);
    const existingFolder = await MyFile.findById(myFile.parentFolder);

    if (existingFolder) {
      await MyFile.findByIdAndUpdate(myFile.parentFolder, {
        numberOfContent: existingFolder.numberOfContent + 1,
        size: existingFolder.size + myFile.size,
      });
    }

    const savedFileInfo = await myFileModel.save();

    return dbObjectToJsObject({
      message: "File info saved",
      id: savedFileInfo._id.toString(),
    });
  } catch (error: any) {
    console.log("Creation error << ", error.message);

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
export async function updateFileInfo(
  myFile: IMyFile,
  shouldUpdateAlert?: boolean
) {
  try {
    await dbConnector();

    let uploadedFile: any = { ...myFile };

    if (shouldUpdateAlert === true) {
      uploadedFile.alertDate = uploadedFile.alertDate
        ? uploadedFile.alertDate
        : null;
      uploadedFile.scheduledDate = uploadedFile.scheduledDate
        ? uploadedFile.scheduledDate
        : null;
      uploadedFile.alertReason = uploadedFile.alertReason
        ? uploadedFile.alertReason
        : null;
    } else {
      const { scheduledDate, alertDate, alertReason, ...rest } = uploadedFile;
      uploadedFile = { ...rest };
    }

    console.log("uploadedFile >> ", uploadedFile);
    const myFileModel = await MyFile.findByIdAndUpdate(
      uploadedFile._id,
      uploadedFile,
      {
        new: true,
      }
    );

    return dbObjectToJsObject({
      message: "File info updated",
      data: myFileModel._doc,
    });
  } catch (error: any) {
    console.log("updateFileInfo error >> ", error?.message);
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

export async function getAllUrgentFiles(userId: string, page: string) {
  await dbConnector();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //TODO Find your own urgent files
  const files = await MyFile.find({
    owner: userId,
    alertDate: today,
    status: { $ne: fileStatus.REMOVED },
  });

  //TODO Find shared urgent files ????

  const filesPerPage = getContentWithPagination(files, page, "");

  return dbObjectToJsObject(filesPerPage);
}

export async function getAllSharedFiles(userId: string, page: string) {
  await dbConnector();
  const today = new Date().toISOString().split("T")[0];

  const files = await MyFile.find({
    sharedWithUsers: { $in: [userId] },
    status: { $ne: fileStatus.REMOVED },
  });
  const filesPerPage = getContentWithPagination(files, page, "");

  return dbObjectToJsObject(filesPerPage);
}

export async function getRecentFiles(userId: string) {
  await dbConnector();

  // Find your own recent files
  const files = await MyFile.find({
    owner: userId,
    isFolder: false,
    status: { $ne: fileStatus.REMOVED },
    visited: { $ne: null },
  });

  //TODO Find recent shared files ????

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
  const fileInfo = await MyFile.findById(id).populate("sharedWithUsers");
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
