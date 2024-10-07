import DashboardPage from "@/app/components/DashboardPage";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getAllFiles,
  getRecentFiles,
  updateFileInfo,
} from "@/services/MyFileService";

export const metadata = {
  title: "FMS | Dashboard",
};

const page = async () => {
  // To Add : getSharedFiles(); getMainFolder()
  /* const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  */

  return (
    <DashboardPage
      getAllFiles={getAllFiles}
      getRecentFiles={getRecentFiles}
      updateFileInfo={updateFileInfo}
    />
  );
};

export default page;
