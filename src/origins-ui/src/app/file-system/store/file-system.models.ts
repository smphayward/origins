export interface FileSystemObject {
  id: string;
  name: string;
}

export interface FileSystemFile extends FileSystemObject {
  
}

export interface FileSystemDirectory extends FileSystemObject {
  id: string;
  name: string;
  directories?: FileSystemDirectory[];
  files?: FileSystemFile[];
}

