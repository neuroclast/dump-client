import { Exposure } from "./enumerations";

export class Dump {
  id: number;
  publicId: string;
  username: string;
  dateTime: Date;
  exposure: Exposure;
  expiration: Date;
  type: string;
  views: number;
  title: string;
  contents: string;
}
