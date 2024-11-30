import Link from "next/link";
import React from "react";
import Loader from "./Loader";
import Image from "next/image";
import {
  getColor,
  getFileExtensionLogoPath,
  getFileFullname,
  getLastVisitedTimeInterval,
  getLocalFilePath,
} from "@/utils/myFunctions";
import SharingFileModal from "./modal/SharingFileModal";
import DownloadButton from "./DownloadButton";
import UpdateFolderModal from "./modal/UpdateFolderModal";
import UpdateFileModal from "./modal/UpdateFileModal";
import NoData from "./NoData";
import FeedbackFileModal from "./modal/FeedbackFileModal";
import NotificationCirle from "./NotificationCirle";

type FilesListType = {
  title: string;
  sectionId: string;
  sectionImageUrl: string;
  navigationLinks: string[];
  files: IMyFile[];
  currentUserId: string;
  isLoading: boolean;
  pages: number[];
  page: any;
  totalElements: number;
  openSubFolder: any;
  openFileLink: any;
  setRefreshTime: any;
  handleDelete: any;
  handlePageChange: any;
};

const FilesList = ({
  title,
  sectionId,
  sectionImageUrl,
  navigationLinks,
  files,
  currentUserId,
  isLoading,
  pages,
  page,
  totalElements,
  openSubFolder,
  openFileLink,
  setRefreshTime,
  handleDelete,
  handlePageChange,
}: FilesListType) => {
  const getImageName = (navLink: string) => {
    return navLink === "Urgents"
      ? "alert-w"
      : navLink === "Shared"
      ? "sharing-w"
      : navLink === "Recents"
      ? "recent-w"
      : "all-w";
  };

  return (
    <div
      className="mb-4"
      style={{
        borderLeft: `solid 2px ${getColor(sectionId)}`,
        borderTop: "solid 1px #eee",
        borderRadius: " 10px",
        padding: "10px 10px 0 10px",
      }}
    >
      <div className="d-flex flex-wrap">
        <h5
          className="d-flex gap-2 justify-content-center font-size-16 me-3 mb-0 self-center"
          id={sectionId}
        >
          <Image width={24} height={24} alt="Image" src={sectionImageUrl} />
          <span className="d-flex">
            <label> {title}</label>
            <NotificationCirle
              sectionId={sectionId}
              totalElements={totalElements}
            />
          </span>
        </h5>

        <div className="ms-auto d-flex gap-2">
          {navigationLinks.map((navLink: string) => (
            <Link
              key={navLink}
              href={`#${navLink}`}
              title={navLink}
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: getColor(navLink),
                padding: "5px",
                borderRadius: "5px",
                boxShadow: "-4px 4px 2px #ddd",
              }}
            >
              <Image
                src={`/images/${getImageName(navLink)}.png`}
                width={100}
                height={100}
                alt={sectionId}
              />
            </Link>
          ))}
        </div>
      </div>

      {sectionId === "All" ? (
        <h6 className="mt-4">
          <Link
            href={"#"}
            onClick={(e) => {
              openSubFolder(e, currentUserId, true);
            }}
          >
            {"root >"}
          </Link>
        </h6>
      ) : (
        ""
      )}

      {/* My Files and Folders */}

      {isLoading ? (
        <div className="p-8">
          <Loader />
        </div>
      ) : files?.length > 0 ? (
        <React.Fragment>
          <div className="row mt-4">
            {files?.map((file: IMyFile) => (
              <div
                key={file._id}
                className="col-lg-3 col-sm-6"
                // onDoubleClick={(e) => openSubFolder(e, file._id, file.isFolder)}
              >
                <div className="card shadow-none border">
                  <div className="card-body p-3">
                    <div className="d-flex flex-column gap-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link
                          href="#"
                          style={{
                            width: "50px",
                            height: "50px",
                            cursor: "pointer",
                          }}
                        >
                          {file.isFolder ? (
                            <i className="bx bxs-folder h1 mb-0 text-warning"></i>
                          ) : (
                            <Image
                              width={100}
                              height={100}
                              src={getFileExtensionLogoPath(file.extension!)}
                              alt="Logo"
                              onClick={(e) =>
                                openFileLink(
                                  e,
                                  file._id!,
                                  file.isFolder!,
                                  file.extension
                                )
                              }
                            />
                          )}
                        </Link>

                        <div className="flex gap-2 justify-content-center align-items-center">
                          <FeedbackFileModal
                            id={file._id}
                            refreshData={() => setRefreshTime(new Date())}
                          />
                          <SharingFileModal
                            id={file._id}
                            refreshData={() => setRefreshTime(new Date())}
                            sectionId={sectionId}
                          />

                          {!file.isFolder ? (
                            <DownloadButton
                              fileName={file.name!}
                              downloadLink={`/api/files/${file._id}?extension=${file.extension}&&download=true`}
                              extension={file.extension!}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <h5 className="font-size-15 text-truncate">
                          <Link
                            href="#"
                            className="text-body"
                            onClick={(e) =>
                              openFileLink(
                                e,
                                file._id!,
                                file.isFolder!,
                                file.extension
                              )
                            }
                          >
                            {getFileFullname(
                              file.name!,
                              file.isFolder!,
                              file.extension
                            )}
                          </Link>
                        </h5>
                        <div className="d-flex flex-column gap-1">
                          <div className="d-flex justify-content-between">
                            <label className="text-muted text-truncate">
                              {file.isFolder
                                ? file.numberOfContent + " items"
                                : ""}
                            </label>
                            <label className="text-muted text-truncate">
                              {Math.round(file.size! / 1000)}
                              {" KB"}
                            </label>
                          </div>
                          <div className="d-flex justify-content-between">
                            <label className="text-muted text-truncate">
                              {getLastVisitedTimeInterval(file.visited)}
                            </label>

                            <div className="d-flex gap-2">
                              <Image
                                title="open"
                                width={20}
                                height={20}
                                src={"/images/forward-arrow.png"}
                                alt="Open"
                                onClick={(e) =>
                                  openSubFolder(
                                    e,
                                    file._id,
                                    file.isFolder,
                                    file.extension
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              />
                              {(!file.isFolder || file.numberOfContent == 0) &&
                              sectionId != "Received" ? (
                                <Image
                                  title="delete"
                                  width={20}
                                  height={20}
                                  src={"/images/delete.png"}
                                  alt="Delete"
                                  onClick={() =>
                                    handleDelete(file._id!, file.name!)
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                              ) : (
                                ""
                              )}

                              <div className="text-muted" title="more">
                                {sectionId === "Received" ? (
                                  ""
                                ) : file.isFolder ? (
                                  <UpdateFolderModal
                                    id={file._id}
                                    refreshData={() =>
                                      setRefreshTime(new Date())
                                    }
                                  />
                                ) : (
                                  <UpdateFileModal
                                    id={file._id}
                                    refreshData={() =>
                                      setRefreshTime(new Date())
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center mt-2">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      handlePageChange(e, Number.parseInt(page) - 1);
                    }}
                  >
                    Previous
                  </a>
                </li>
                {pages?.map((p: any) => (
                  <li key={p} className="page-item">
                    <a
                      className={`page-link ${p === page ? "active" : ""}`}
                      href="#"
                      onClick={(e) => {
                        handlePageChange(e, p);
                      }}
                    >
                      {p}
                    </a>
                  </li>
                ))}

                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      handlePageChange(e, Number.parseInt(page) + 1);
                    }}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </React.Fragment>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default FilesList;
