import express from "express";
import path from "path";
import { ThumbnailProvider } from "./ThumbnailProvider";

export const createThumbnailRouter = (
  thumbnailProvider: ThumbnailProvider
) => {
  const thumbnailRouter = express.Router();

  thumbnailRouter
    .get("/:indexRecordId", async (req, res) => {
      let indexRecordId = req.params.indexRecordId;

      // Strip off .JPG
      indexRecordId = path.parse(indexRecordId).name

      const absPathToThumbnail = await thumbnailProvider.GenerateThumbnail(
        indexRecordId,
        false
      );

      return res.status(200).contentType('jpg').download(absPathToThumbnail);
    })
    .post("/:indexRecordId", async (req, res) => {
      const indexRecordId = req.params.indexRecordId;

      const absPathToThumbnail = await thumbnailProvider.GenerateThumbnail(
        indexRecordId,
        true
      );

      return res.send("Thumbnail regenerated");
    })
    .delete("/:indexRecordId", async (req, res) => {
      const indexRecordId = req.params.indexRecordId;

      // TODO: Delete the thumbnail
    });

  return thumbnailRouter;
};
