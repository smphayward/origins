import { CollectionInfo } from "../collections.models";

export const mockCollections: CollectionInfo[] = [
  { id: '0D378A5C-A0C9-452D-B9E5-D7270C413031', name: 'Mock Collection 1', rootDirectory: '/foo/bar/baz', exists: true },
  { id: '8E5262B8-31B5-44A7-B23E-4912FFC44BB5', name: 'Mock Collection 2', rootDirectory: '/fred/waldo/jorgan', exists: false },
  { id: '8025CD82-EB13-4FBA-965F-F3311E2D887F', name: 'Mock Collection 3', rootDirectory: '/quux/xkcd/asdf', exists: true },
];