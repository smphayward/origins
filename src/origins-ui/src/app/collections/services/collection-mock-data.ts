import { CollectionInfo } from "../collections.models";

export const mockCollections: CollectionInfo[] = [
  { id: 'Mock Collection 1', rootDirectory: '/foo/bar/baz', exists: true },
  { id: 'Mock Collection 2', rootDirectory: '/fred/waldo/jorgan', exists: false },
  { id: 'Mock Collection 3', rootDirectory: '/quux/xkcd/asdf', exists: true },
];