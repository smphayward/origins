// import { Link, OriginsRecord } from "../shared/models/record";


// export interface Item extends OriginsRecord {
//   id: string;
//   collectionId: string;
//   fileRelativePath: string;
//   fileSizeBytes: number;
//   fileCreated: string;
//   fileModified: string;
//   filename: string;
//   fileExtension: string;
//   type: string;
//   mime: string;
//   height: number;
//   width: number;
// }

// export interface ItemInfo extends Item {
//   _links: {
//     thumb: Link;
//     webdav: Link;
//     self?: Link;
//   }
// }


// export const blankItemInfo: ItemInfo = {
//   id: '',
//   collectionId: '',
//   fileRelativePath: '',
//   fileSizeBytes: 0,
//   fileCreated: '',
//   fileModified: '',
//   filename: '',
//   fileExtension: '',
//   type: '',
//   mime: '',
//   height: 0,
//   width: 0,
//   _links: {
//     thumb: {
//       _href: ''
//     },
//     webdav: {
//       _href: ''
//     }
//   }
// }