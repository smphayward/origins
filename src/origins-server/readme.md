# Origins Rest Api


/collections              <-- Collection CRUD
/collections/:id/webdav   <-- File System Management from the Outside
/thumbnails               <-- Thumbnail  CRUD
/index                    <-- Index CRUD
/search                   <-- Search with paging






Things we need...

- List of all collections
- Lists of things, like people, places etc. based on regex and keywords and whatnot
- Might need a central config keeper somehow, to share between services


GET /collections
PUT /collections/collectionId { collectionInfo }
GET /collections/collectionId

GET /extractors
GET /extractors/keyword
PUT /extractors/keyword { configuration for keyword extractor }

Probably readonly because the metadata fields are defined elsewhere
GET /metadata
GET /metadata/person
GET /metadata/place
GET /metadata/event

GET /search?q=(lucene)





/
