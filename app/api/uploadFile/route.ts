// pages/api/uploadImage.ts
import { uploadAFile } from "@/services/AwsS3Service";
import { saveFileInfo } from "@/services/MyFileService";
import { fileRole } from "@/utils/constants";
import { getFileExtension } from "@/utils/myFunctions";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const formData: FormData = await req.formData();
    console.log("uploading file >> ", formData.entries());
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const userId = formData.get("userId") as string;
    const theFileRole = formData.get("fileRole") as string;
    let parentFolder: string | null = formData.get("parentFolder") as string;
    parentFolder = parentFolder ? parentFolder : null;

    // Make all the check logics(size...) here on file if needed
    if (!file) {
      console.log("File not exist");
      return NextResponse.json({ error: "file is missing." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getFileExtension(file.name);
    const fileName = name ? `${name}.${extension}` : file.name;

    /**
     * 1. save file info on my db and get the file _Id if theFileRole is SIMPLE_FILE DONE
     * 2. use the saved file _Idvor the userId as key to upload the file to S3 DONE
     * 3. respond with a success message
     */

    let fileKey = userId;
    if (theFileRole === fileRole.SIMPLE_FILE) {
      const savingFileInfo: IMyFile = {
        owner: userId,
        name: fileName,
        type: file.type,
        extension: extension,
        size: file.size,
        parentFolder: parentFolder,
      };
      const savedFileInfoRes = await saveFileInfo(savingFileInfo);
      fileKey = savedFileInfoRes.id;

      if (savedFileInfoRes.error) {
        return NextResponse.json(
          { error: savedFileInfoRes.error },
          { status: 400 }
        );
      }
    }

    const uploadAFileRes = await uploadAFile(buffer, fileKey, file.type);

    if (uploadAFileRes.error) {
      return NextResponse.json(
        { error: uploadAFileRes.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "File uploaded with success!" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
