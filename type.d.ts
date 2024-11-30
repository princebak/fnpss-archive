interface IMyFile {
  _id?: string;
  owner?: any;
  parentFolder?: string?;
  isFolder?: boolean;
  name?: string;
  originalName?: string;
  type?: string;
  downloadUrl?: string?;
  extension?: string?;
  size?: number;
  numberOfContent?: number;
  visited?: Date?;
  status?: string;
  scheduledDate: Date?;
  alertDate: Date?;
  alertReason?: string?;
  sharing?: {
    sender: string;
    sharingDate: Date;
    receivers: string[];
  };
  feedbacks?: Partial<FeedbackContent>[];
}

interface FeedbackContent {
  receiver: string;
  feedbackMessage: string;
  feedbackDate: Date;
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
