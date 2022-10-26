import { XMLParser } from 'fast-xml-parser';
import moment = require('moment');
import { stringify } from 'querystring';
import { BasicFileSystemObject, FileSystemDirectory, FileSystemFile,  FileSystemObject, FileSystemObjectPathInfo } from './file-system.models';

// ██████   █████  ████████ ██   ██
// ██   ██ ██   ██    ██    ██   ██
// ██████  ███████    ██    ███████
// ██      ██   ██    ██    ██   ██
// ██      ██   ██    ██    ██   ██

export const pathSeparator = '/';

export const parseFullPath = (
  fullPath: string,
): FileSystemObjectPathInfo => {
  if (fullPath.trim().length === 0) {
    throw new Error('fullPath cannot be empty.');
  }

  const firstSeparatorIndex = fullPath.indexOf(pathSeparator);
  // Short-circuit if no separators. It's just the collection and that is all.
  if (firstSeparatorIndex === -1) {
    return {
      fullPath,
      parentFullPath: undefined,
      collectionId: fullPath,
      relativePath: '/',
      name: fullPath,
      pathParts: [fullPath],
      level: 0
    };
  }

  // Everything else should be consistent
  const pathParts = fullPath.split(pathSeparator).filter((pp) => pp.length > 0);

  if (pathParts.length === 0) {
    throw new Error('fullPath only contains separators but nothing else.');
  }

  return {
    fullPath: pathParts.join('/'),
    parentFullPath: pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : undefined,
    collectionId: pathParts[0],
    relativePath: pathParts.length === 1 ? '/' : '/' + pathParts.slice(1).join(pathSeparator),
    name: pathParts[pathParts.length - 1],
    pathParts,
    level: pathParts.length - 1 // 0-based "tree level"
  };
};

export const isParent = (candidateParent: FileSystemDirectory, candidateChild: FileSystemObjectPathInfo): boolean => {

  // Child can't have less than or equal number of path parts
  if(candidateChild.pathParts.length <= candidateParent.pathParts.length) {
    return false;
  }

  for (let i = 0; i < candidateParent.pathParts.length; i++) {
    const childPart = candidateChild.pathParts[i];
    const parentPart = candidateParent.pathParts[i];
    if(childPart !== parentPart){
      return false;
    }
  }

  return true;

}







// ████████ ██████  ███████ ███████                █████  ██████  ██████   █████  ██    ██ 
//    ██    ██   ██ ██      ██                    ██   ██ ██   ██ ██   ██ ██   ██  ██  ██  
//    ██    ██████  █████   █████       █████     ███████ ██████  ██████  ███████   ████   
//    ██    ██   ██ ██      ██                    ██   ██ ██   ██ ██   ██ ██   ██    ██    
//    ██    ██   ██ ███████ ███████               ██   ██ ██   ██ ██   ██ ██   ██    ██    
                                                                              
// TODO: Maybe??







// Build a tree from nothing (that's just updating an empty tree)

// Update an existing tree without mutation, thus return a whole new tree

// In future, might build a tree with only SOME mutation... only the minimum amount

// Will probably also need a way to remove things from the tree... with or without mutation maybe

//export const updateFileSystemTree = ()





// ██     ██ ███████ ██████  ██████   █████  ██    ██
// ██     ██ ██      ██   ██ ██   ██ ██   ██ ██    ██
// ██  █  ██ █████   ██████  ██   ██ ███████ ██    ██
// ██ ███ ██ ██      ██   ██ ██   ██ ██   ██  ██  ██
//  ███ ███  ███████ ██████  ██████  ██   ██   ████

const extractInfoFromHref = (href: string): { collectionId?: string; relativePath?: string } => {
  const webdav = '/webdav/';
  let i = href.indexOf(webdav);
  if (i === -1) {
    return {};
  }
  const collectionAndRelativePath = href.substring(i + webdav.length);

  i = collectionAndRelativePath.indexOf('/');
  if (i === -1) {
    return {
      collectionId: collectionAndRelativePath,
    };
  }

  return {
    collectionId: collectionAndRelativePath.substring(0, i),
    relativePath: collectionAndRelativePath.substring(i),
  };
};

export const parsePropFindResponse = (xml: string): BasicFileSystemObject[] => {
  // // Remove the namespace. It's just the worst.
  // console.log("BEFORE", xml);
  // const temp = xml.replace("<D:", "").replace("</D:", "");
  // console.log("AFTER", temp);

  const parser = new XMLParser();
  const parsed = parser.parse(xml);

  const responses = (parsed?.['D:multistatus']?.['D:response'] as []) ?? [];

  return responses
    .map((r) => ({
      href: r['D:href'] as string,
      status: r['D:propstat']['D:status'] as string,
      lastModifiedDate: moment(r['D:propstat']['D:prop']['D:getlastmodified'] as string).toDate(),
      creationDate: moment(r['D:propstat']['D:prop']['D:creationdate'] as string).toDate(),
      displayName: r['D:propstat']['D:prop']['D:displayname'] as string,
      eTag: r['D:propstat']['D:prop']['D:getetag'] as string,
      isCollection: r['D:propstat']['D:prop']['D:resourcetype']?.['D:collection'] !== undefined,
      contentLength: r['D:propstat']['D:prop']['D:getcontentlength'] as number | undefined,
      contentType: r['D:propstat']['D:prop']['D:getcontenttype'] as string | undefined,
    }))
    .map((r) => {
      const webdav = '/webdav/';
      const webDavIndex = r.href.indexOf(webdav);
      if (webDavIndex === -1) {
        throw new Error(`href value '${r.href}' does not contain the string '/webdav/'.`);
      }
      const fullPath = decodeURI( r.href.substring(webDavIndex + webdav.length));

      if (r.isCollection) {
        return new FileSystemDirectory(fullPath, r.creationDate, r.lastModifiedDate);
      }
      return new FileSystemFile(
        fullPath,
        r.creationDate,
        r.lastModifiedDate,
        r.contentType ?? '',
        r.contentLength ?? 0,
      );
    });
};
