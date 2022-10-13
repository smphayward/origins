import { Link, OriginsDocument } from "..";

// ----- Document Types ----- //
export interface Item extends OriginsDocument {
  collectionId: string;
  name: string;
  
  // General Info
  type: string;
  mime: string;

  // General File Info
  fileRelativePath: string;
  fileSizeBytes: number;
  fileCreated: string;
  fileModified: string;
  filename: string;
  fileExtension: string;

  // Image & Video Info
  // Structure may change if supporting more than images and videos
  height: number;
  width: number;  

}

export interface ItemInfo extends Item {
  collectionName: string;

  // Property that tells about all of the other dynamic properties
  // Like from keywords and stuff?
  // Maybe.
  // Or just put "Metadata" in Item interface
  // Dictionary of [string]: object maybe
  // It's really just for informational and search purposes
  // Though I prefer to keep things flat if possible

  // Hypermedia
  _links: {
    thumb: Link;
    webdav: Link;
    self?: Link;
  }

}

