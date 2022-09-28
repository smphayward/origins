import { v2 as webdav } from "webdav-server";

export const WebDAVServerFactory = (
  rootUriPath: string,
  rootFileSystemDirectory: string) => {
  // ----- Build the WebDAV Server ----- //
  const webDAVServer = new webdav.WebDAVServer();

  // ----- File System Setup ----- //
  webDAVServer.setFileSystem(
    rootUriPath,
    new webdav.PhysicalFileSystem(
      rootFileSystemDirectory //"/home/shaun/repos/origins/origins-test-folders/photos2"
    ),
    (succeeded) => {
      console.log(`webdav startup: ${succeeded}`);
    }
  );

  // ----- Logging. Need a better way. ----- //
  webDAVServer.afterRequest((arg, next) => {
    // Display the method, the URI, the returned status code and the returned message
    console.log(
      ">>",
      arg.request.method,
      arg.requested.uri,
      ">",
      arg.response.statusCode,
      arg.response.statusMessage
    );
    // If available, display the body of the response
    if (arg.responseBody) {
      // This is waaay too much :-D
      //console.log(arg.responseBody);
    }
    next();
  });

  // ----- All Done ----- //
  return webDAVServer;
};
