interface IMyFile {
  _id?: string;
  owner?: any;
  parentFolder?: string?;
  isFolder?: boolean;
  name?: string;
  type?: string;
  downloadUrl?: string?;
  extension?: string?;
  size?: number;
  numberOfContent?: number;
  visited?: Date?;
  status?: string;
  scheduledDate?: Date;
  alertDates?: Array<FileAlert>;
}

interface FileAlert {
  date: Date;
  reason: String;
}

interface S3File {
  name: string;
  content: File;
}

interface IAccessToken {
  name: string;
  owner: IUser;
  type: string;
  status: string?;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  type: string;
  phone?: string;
  address?: string;
  password: string;
  status?: string;
}

interface ISubscription {
  owner: IUser;
  expireAt: Date;
  status: string?;
  paymentMethod: string?;
}
