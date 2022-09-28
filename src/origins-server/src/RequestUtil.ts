import { Request } from "express";

export class RequestUtil {
  private constructor() {}

  public static getFileSystemPath = (req: Request): string => {
    const decoded = decodeURI(req.path);
    return decoded;
  };
}
