"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestUtil = void 0;
class RequestUtil {
    constructor() { }
}
exports.RequestUtil = RequestUtil;
RequestUtil.getFileSystemPath = (req) => {
    const decoded = decodeURI(req.path);
    return decoded;
};
