"use client";

import Image from "next/image";
import CreateFileModal from "@/app/components/modal/CreateFileModal";
import { useEffect, useState } from "react";

import NoData from "@/app/components/NoData";
import Loader from "@/app/components/Loader";
import UpdateFileModal from "@/app/components/modal/UpdateFileModal";
import { getFormatedDate } from "@/utils/myFunctions";
import DownloadButton from "@/app/components/DownloadButton";
import { useSelector } from "react-redux";
import React from "react";
import UpdateFolderModal from "./modal/UpdateFolderModal";
import { fileStatus } from "@/utils/constants";
import {
  getAllReceivedFiles,
  getAllSharedFiles,
} from "@/services/MyFileService";
import FilesList from "./FilesList";
import { useRouter } from "next/navigation";

export default function DashboardPage({
  getAllFiles,
  getRecentFiles,
  updateFileInfo,
  getAllUrgentFiles,
}: any) {
  const [myFiles, setMyFiles] = useState<any>([]);
  const [myUrgentFiles, setMyUrgentFiles] = useState<any>([]);
  const [recentFiles, setRecentFiles] = useState<any>([]);
  const [sharedFiles, setSharedFiles] = useState<any>([]);
  const [receivedFiles, setReceivedFiles] = useState<any>([]);
  const { currentUser } = useSelector((state: any) => state.user);

  // Pagination and Search
  const [page, setPage] = useState<any>(1);
  const [urgentPage, setUrgentPage] = useState<any>(1);
  const [sharedPage, setSharedPage] = useState<any>(1);
  const [receivedPage, setReceivedPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRecentLoading, setIsRecentLoading] = useState(true);
  const [isUrgentLoading, setIsUrgentLoading] = useState(true);
  const [isSharedLoading, setIsSharedLoading] = useState(true);
  const [isReceivedLoading, setIsReceivedLoading] = useState(true);
  const [totalElements, setTotalElements] = useState<any>(0);
  const [totalUrgentElements, setTotalUrgentElements] = useState<any>(0);
  const [totalSharedElements, setTotalSharedElements] = useState<any>(0);
  const [totalReceivedElements, setTotalReceivedElements] = useState<any>(0);
  const [refreshTime, setRefreshTime] = useState<any>(null);
  const [pages, setPages] = useState([1]);
  const [urgentPages, setUrgentPages] = useState([1]);
  const [sharedPages, setSharedPages] = useState([1]);
  const [receivedPages, setReceivedPages] = useState([1]);
  const [userFolderId, setUserFolderId] = useState(currentUser?._id);

  useEffect(() => {
    const navbar: any = document.getElementById("stickyNavbar");

    // Add event listener for scroll
    window.addEventListener("scroll", checkScrollPosition);

    function checkScrollPosition() {
      // Get the current scroll position
      const currentPosition = window.scrollY;

      // Check if we've reached the top of the viewport
      if (currentPosition >= navbar.offsetHeight) {
        navbar.classList.add("stickyNavbar");
        navbar.classList.add("container");
      } else {
        navbar.classList.remove("container");
        navbar.classList.remove("stickyNavbar");
      }
    }

    // Initial check
    checkScrollPosition();
  }, []);

  const handlePageChange = (e: any, currentPage: number) => {
    e.preventDefault();
    setPage(currentPage);
  };

  const handleUrgentPageChange = (e: any, currentPage: number) => {
    e.preventDefault();
    setUrgentPage(currentPage);
  };

  const handleSharedPageChange = (e: any, currentPage: number) => {
    e.preventDefault();
    setSharedPage(currentPage);
  };

  const handleReceivedPageChange = (e: any, currentPage: number) => {
    e.preventDefault();
    setReceivedPage(currentPage);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = confirm(
      "Souhaitez-vous vraiment supprimer cet élément ? " + name
    );
    if (confirmDelete) {
      const res = await updateFileInfo({ _id: id, status: fileStatus.REMOVED });
      if (res.error) {
        alert("Mauvaise requête.");
      } else {
        alert("Fichier supprimé avec succès !");
      }
    }

    setRefreshTime(new Date());
  };

  {
    /* All files side effects */
  }
  useEffect(() => {
    let totPages = 0;
    const loadFilesList = async () => {
      const res = await getAllFiles(userFolderId, page, search);
      setMyFiles(res?.content);
      setTotalElements(res?.totalElements);
      setPage(res?.currentPage);
      totPages = res?.totalPages;

      return true;
    };

    const loadData = async () => {
      setIsLoading(true);

      const res = await loadFilesList();
      if (res) {
        let myPagesNo = [];
        for (let index = 1; index <= totPages; index++) {
          myPagesNo.push(index);
        }
        setPages([...myPagesNo]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [page, search, refreshTime, userFolderId]);

  {
    /* Urgent files side effects */
  }
  useEffect(() => {
    let totPages = 0;
    const loadFilesList = async () => {
      const res = await getAllUrgentFiles(currentUser?._id, urgentPage);
      setMyUrgentFiles(res?.content);
      setTotalUrgentElements(res?.totalElements);
      setUrgentPage(res?.currentPage);
      totPages = res?.totalPages;

      return true;
    };

    const loadData = async () => {
      setIsUrgentLoading(true);

      const res = await loadFilesList();
      if (res) {
        let myPagesNo = [];
        for (let index = 1; index <= totPages; index++) {
          myPagesNo.push(index);
        }
        setUrgentPages([...myPagesNo]);
      }
      setIsUrgentLoading(false);
    };

    loadData();
  }, [urgentPage, refreshTime]);

  {
    /* Shared files side effects */
  }
  useEffect(() => {
    let totPages = 0;
    const loadFilesList = async () => {
      const res = await getAllSharedFiles(currentUser?._id, sharedPage);
      setSharedFiles(res?.content);
      setTotalSharedElements(res?.totalElements);
      setSharedPage(res?.currentPage);
      totPages = res?.totalPages;

      return true;
    };

    const loadData = async () => {
      setIsSharedLoading(true);

      const res = await loadFilesList();
      if (res) {
        let myPagesNo = [];
        for (let index = 1; index <= totPages; index++) {
          myPagesNo.push(index);
        }
        setSharedPages([...myPagesNo]);
      }
      setIsSharedLoading(false);
    };

    loadData();
  }, [sharedPage, refreshTime]);

  {
    /* Received files side effects */
  }
  useEffect(() => {
    let totPages = 0;
    const loadFilesList = async () => {
      const res = await getAllReceivedFiles(currentUser?._id, receivedPage);
      setReceivedFiles(res?.content);
      setTotalReceivedElements(res?.totalElements);
      setReceivedPage(res?.currentPage);
      totPages = res?.totalPages;

      return true;
    };

    const loadData = async () => {
      setIsReceivedLoading(true);

      const res = await loadFilesList();
      if (res) {
        let myPagesNo = [];
        for (let index = 1; index <= totPages; index++) {
          myPagesNo.push(index);
        }
        setReceivedPages([...myPagesNo]);
      }
      setIsReceivedLoading(false);
    };

    loadData();
  }, [receivedPage, refreshTime]);

  useEffect(() => {
    const loadRecentFiles = async () => {
      const res = await getRecentFiles(currentUser?._id);
      setRecentFiles(res);
      setIsRecentLoading(false);
    };

    loadRecentFiles();
  }, [refreshTime]);

  const handleSearch = (e: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setSearch(e.target.value);
      setIsLoading(false);
    }, 3000);
  };

  async function openSubFolder(
    e: any,
    id?: string,
    isFolder?: boolean,
    extension?: string
  ) {
    e.preventDefault();

    if (isFolder) {
      await updateFileInfo({ _id: id, visited: new Date() });
      setUserFolderId(id);
      setRefreshTime(new Date());
    } else {
      await openFileLink(e, id!, false, extension!);
    }
  }

  async function openFileLink(
    e: any,
    id: string,
    isFolder: boolean,
    extension: string
  ) {
    e.preventDefault();
    if (!isFolder) {
      await updateFileInfo({ _id: id, visited: new Date() });

      window.open(`/api/files/${id}?extension=${extension}`, "_blank");

      setRefreshTime(new Date());
    }
  }

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center flex-wrap relativePosition"
        id="stickyNavbar"
      >
        <input
          type="text"
          className="form-control bg-light border-light rounded"
          placeholder="Recherche..."
          onChange={handleSearch}
          style={{ minWidth: "300px", maxWidth: "600px" }}
        />

        <CreateFileModal
          refreshData={() => setRefreshTime(new Date())}
          userFolderId={userFolderId}
        />
      </div>

      {/* All files */}
      <FilesList
        title={"Tous les fichiers"}
        sectionId={"All"}
        sectionImageUrl={"/images/all.png"}
        navigationLinks={["Urgents", "Shared", "Recents"]}
        files={myFiles}
        currentUserId={currentUser?._id}
        isLoading={isLoading}
        pages={pages}
        page={page}
        openSubFolder={openSubFolder}
        openFileLink={openFileLink}
        setRefreshTime={setRefreshTime}
        handleDelete={handleDelete}
        handlePageChange={handlePageChange}
        totalElements={totalElements}
      />

      {/* Urgent files */}
      <FilesList
        title={"Fichiers urgents"}
        sectionId={"Urgents"}
        sectionImageUrl={"/images/alert.png"}
        navigationLinks={["All", "Shared", "Recents"]}
        files={myUrgentFiles}
        currentUserId={currentUser?._id}
        isLoading={isUrgentLoading}
        pages={urgentPages}
        page={urgentPage}
        openSubFolder={openSubFolder}
        openFileLink={openFileLink}
        setRefreshTime={setRefreshTime}
        handleDelete={handleDelete}
        handlePageChange={handleUrgentPageChange}
        totalElements={totalUrgentElements}
      />

      {/* Received files */}
      <FilesList
        title={"Fichiers reçus"}
        sectionId={"Received"}
        sectionImageUrl={"/images/sharing.png"}
        navigationLinks={["All", "Urgents", "Recents"]}
        files={receivedFiles}
        currentUserId={currentUser?._id}
        isLoading={isReceivedLoading}
        pages={receivedPages}
        page={receivedPage}
        openSubFolder={openSubFolder}
        openFileLink={openFileLink}
        setRefreshTime={setRefreshTime}
        handleDelete={handleDelete}
        handlePageChange={handleReceivedPageChange}
        totalElements={totalReceivedElements}
      />

      {/* Shared files */}
      <FilesList
        title={"Fichiers partagés"}
        sectionId={"Shared"}
        sectionImageUrl={"/images/sharing.png"}
        navigationLinks={["All", "Urgents", "Recents"]}
        files={sharedFiles}
        currentUserId={currentUser?._id}
        isLoading={isSharedLoading}
        pages={sharedPages}
        page={sharedPage}
        openSubFolder={openSubFolder}
        openFileLink={openFileLink}
        setRefreshTime={setRefreshTime}
        handleDelete={handleDelete}
        handlePageChange={handleSharedPageChange}
        totalElements={totalSharedElements}
      />

      {/* Recently Opened */}

      <div className="d-flex flex-wrap mt-3">
        <h5 className="d-flex gap-2 font-size-16 me-3 mb-0" id={"Recents"}>
          <span>{"Récemment ouvert"}</span>
          <Image
            width={24}
            height={24}
            alt="Image"
            src={"/images/recent.png"}
          />
        </h5>
      </div>
      <hr className="mt-2" />
      <div className="table-responsive">
        {isRecentLoading ? (
          <div className="p-8">
            <Loader />
          </div>
        ) : recentFiles?.length < 1 ? (
          <NoData />
        ) : (
          <table className="table align-middle table-nowrap table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">{"Dernière visite le"}</th>
                <th scope="col">Taille</th>
                <th scope="col">{"Télécharger"}</th>
                <th scope="col">Plus</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles?.map((file: any) => (
                <tr key={file._id}>
                  <td>
                    <a href="#" className="text-dark fw-medium">
                      <i className="mdi mdi-file-document font-size-16 align-middle text-primary me-2"></i>{" "}
                      {file.name}
                    </a>
                  </td>
                  <td>{getFormatedDate(file.visited, true, true)}</td>
                  <td>
                    {Math.round(file.size / 1000)}
                    {" KB"}
                  </td>
                  <td>
                    <div className="avatar-group">
                      <DownloadButton
                        fileName={file.name}
                        downloadLink={`/api/files/${file._id}?extension=${file.extension}&&download=true`}
                        extension={file.extension!}
                      />
                    </div>
                  </td>
                  <td>
                    {file.isFolder ? (
                      <UpdateFolderModal
                        id={file._id}
                        refreshData={() => setRefreshTime(new Date())}
                      />
                    ) : (
                      <UpdateFileModal
                        id={file._id}
                        refreshData={() => setRefreshTime(new Date())}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
