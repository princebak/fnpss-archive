import DashboardPage from "@/app/components/DashboardPage";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getAllFiles,
  getAllUrgentFiles,
  getRecentFiles,
  updateFileInfo,
} from "@/services/MyFileService";

export const metadata = {
  title: "FNPSS Archives | Dashboard",
};

const page = async () => {

  return (
    <DashboardPage
      getAllFiles={getAllFiles}
      getRecentFiles={getRecentFiles}
      updateFileInfo={updateFileInfo}
      getAllUrgentFiles={getAllUrgentFiles}
    />
  );
};

export default page;
