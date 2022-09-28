"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCollectionRepository = exports.mockCollectionData = void 0;
const MockDocumentProvider_1 = require("../documents/MockDocumentProvider");
exports.mockCollectionData = {
    photos1: {
        id: "photos1",
        rootDirectory: "/home/shaun/repos/origins/origins-test-folders/photos1",
    },
    photos2: {
        id: "photos2",
        rootDirectory: "/home/shaun/repos/origins/origins-test-folders/photos2",
    },
};
class MockCollectionRepository extends MockDocumentProvider_1.MockDocumentProvider {
}
exports.MockCollectionRepository = MockCollectionRepository;
