"use server";

import MyFile from "@/models/MyFile";
import { fileStatus } from "@/utils/constants";
import { dbConnector } from "@/utils/dbConnector";
import {
  dbObjectToJsObject,
  getContentWithPagination,
  getFileNameWithoutExtension,
  getFormatedDate,
} from "@/utils/myFunctions";
import { getDownloadFileUrl } from "./AwsS3Service";
import mongoose from "mongoose";

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
        size: existingFolder.size + (myFile.size || 0),
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
  myFile: Partial<IMyFile>,
  shouldUpdateAlert?: boolean
) {
  try {
    await dbConnector();

    let uploadedFile: any = { ...myFile };
    let sharing = myFile.sharing

    if(sharing && !sharing.sharingDate){
      uploadedFile = {
        ...uploadedFile,
        sharing : {
          ...sharing,
          sharingDate : new Date()
        }
      }
    }

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

export async function addUserFeedback(
  userId: string,
  fileId: string,
  feedbackMessage: string
) {
  try {
    await dbConnector();

    const existingFile = await MyFile.findById(fileId);
    let existingFeedbacks = existingFile.feedbacks;
    const newFeedbacks = [
      ...existingFeedbacks,
      {
        receiver: { type: userId },
        feedbackMessage: feedbackMessage,
        feedbackDate: new Date(),
      },
    ];

    console.log("{existingFeedbacks,newFeedbacks}", {
      existingFeedbacks,
      newFeedbacks,
    });

    const myFileModel = await MyFile.findByIdAndUpdate(
      fileId,
      { feedbacks: newFeedbacks },
      {
        new: true,
      }
    );
    console.log("Updated myFileModel >> ", myFileModel);

    return dbObjectToJsObject({
      message: "File FeedbacksChannels updated",
      data: myFileModel._doc,
    });
  } catch (error: any) {
    console.log("update FeedbacksChannels error >> ", error?.message);
    return { error: error.message };
  }
}

export async function unshareAFile(
  fileId: string,
) {
  try {
    await dbConnector();

    const myFileModel = await MyFile.findByIdAndUpdate(
      fileId,
      { sharing: null },
      {
        new: true,
      }
    );

    return dbObjectToJsObject({
      message: "File unshared !",
      data: myFileModel._doc,
    });
  } catch (error: any) {
    console.log("update FeedbacksChannels error >> ", error?.message);
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

  const files = await MyFile.find({
    owner: userId,
    alertDate: today,
    status: { $ne: fileStatus.REMOVED },
  });

  const filesPerPage = getContentWithPagination(files, page, "");

  return dbObjectToJsObject(filesPerPage);
}

export async function getAllSharedFiles(userId: string, page: string) {
  await dbConnector();

  const files = await MyFile.find({
    "sharing.sender": { $eq: [userId] },
    status: { $ne: fileStatus.REMOVED },
  });
  const filesPerPage = getContentWithPagination(files, page, "");

  return dbObjectToJsObject(filesPerPage);
}

export async function getAllReceivedFiles(userId: string, page: string) {
  await dbConnector();

  const files = await MyFile.find({
    "sharing.receivers": { $in: [new mongoose.Types.ObjectId(userId)] },
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
  const fileInfo = await MyFile.findById(id)
    .populate("sharing.receivers")
    .populate({
      path: "feedbacks.receiver.type", // Specify the path to populate
      model: "User", // Reference the User model
    });

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

export async function isUserAllowedToAccessThisFile(user: any, id: string) {
  // 1. find the file from the database using the file id .DONE
  // 2. return true only if the user is the file owner or is in receivers list .DONE
  // 3. else return false .DONE
  const existingFile: IMyFile | null = await MyFile.findById(id);

  if (!existingFile) {
    throw Error("There is no file with the sent id.");
  }

  if (
    existingFile.owner.toString() === user._id ||
    existingFile.sharing?.receivers.includes(user._id)
  ) {
    return true;
  }

  return false;
}

export async function getFileMetadata(id: string) {
  await dbConnector();
  const fileInfo = await MyFile.findById(id).populate("owner");
  const data = {
    ownerName: fileInfo.owner.name,
    createdDate: getFormatedDate(fileInfo.createdAt, true, true),
    sharedDate: fileInfo.sharing
      ? getFormatedDate(fileInfo.sharing.sharingDate, true, true)
      : null,
  };

  return dbObjectToJsObject(data);
}
