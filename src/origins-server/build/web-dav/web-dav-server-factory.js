"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebDAVServerFactory = void 0;
const webdav_server_1 = require("webdav-server");
const WebDAVServerFactory = (rootUriPath, rootFileSystemDirectory) => {
    // ----- Build the WebDAV Server ----- //
    const webDAVServer = new webdav_server_1.v2.WebDAVServer();
    // ----- File System Setup ----- //
    webDAVServer.setFileSystem(rootUriPath, new webdav_server_1.v2.PhysicalFileSystem(rootFileSystemDirectory //"/home/shaun/repos/origins/origins-test-folders/photos2"
    ), (succeeded) => {
        console.log(`webdav startup: ${succeeded}`);
    });
    // ----- Logging. Need a better way. ----- //
    webDAVServer.afterRequest((arg, next) => {
        // Display the method, the URI, the returned status code and the returned message
        console.log(">>", arg.request.method, arg.requested.uri, ">", arg.response.statusCode, arg.response.statusMessage);
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
exports.WebDAVServerFactory = WebDAVServerFactory;
