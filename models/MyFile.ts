import { fileStatus } from "@/utils/constants";
import mongoose from "mongoose";

// We are handling Folders and Files just as Files

const Schema = mongoose.Schema;

const myFileSchema = new Schema<IMyFile>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MyFile",
    },
    type: {
      type: String,
    },
    scheduledDate: {
      type: Date,
    },
    alertDates: {
      type: Array<FileAlert>,
    },
    isFolder: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    numberOfContent: {
      type: Number,
      default: 0,
    },
    downloadUrl: {
      type: String,
    },
    extension: {
      type: String,
    },
    visited: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: fileStatus.CREATED,
    },
  },
  { timestamps: true }
);

const MyFile = mongoose.models.MyFile || mongoose.model("MyFile", myFileSchema);

export default MyFile;
