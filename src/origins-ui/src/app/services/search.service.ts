import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IndexRecord,
  MultipleIndexRecordsResult,
} from '../store/models';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  // TODO: Configure how we specify how many records to give

  private readonly _maxResults = 60;
  private readonly _records = shuffle(mockDataLots);

  getAll(continuationToken?: string): Observable<MultipleIndexRecordsResult> {
    let startAt = 0;
    if (continuationToken) {
      startAt = Number(continuationToken);
    }

    console.log(`Getting up to ${this._maxResults} records starting at index ${startAt} from total of ${this._records.length} possible records`)

    const documents = this._records.slice(startAt, startAt + this._maxResults);

    console.log(`Got ${documents.length} records.`);

    const nextStartIndex = startAt + this._maxResults;
    let nextContinuationToken: string | undefined = nextStartIndex.toString();
    if (nextStartIndex >= this._records.length) {
      nextContinuationToken = undefined;
    }
    return of({
      continuationToken: nextContinuationToken,
      documents,
    });
  }

  search(
    query: string,
    continuationToken?: string
  ): Observable<MultipleIndexRecordsResult> {
    // Yeah... this doesn't search. :-D
    return this.getAll(continuationToken);
  }
}

const generateMockRecord = (
  id: string,
  collectionId: string,
  relativeDirectory: string,
  filename: string,
  fileExtension: string
): IndexRecord => {
  const relativePath = relativeDirectory + encodeURI(filename) + fileExtension;

  return {
    id: Math.floor(Math.random() * 5000000).toString(),
    collectionId: collectionId,
    fileRelativePath: relativePath,
    fileSizeBytes: 3406576,
    fileCreated: '2022-09-11T23:07:26.241Z',
    fileModified: '2021-12-30T16:20:50.000Z',
    filename: filename,
    fileExtension: fileExtension,
    width: 4608,
    height: 2240,
    type: 'jpg',
    mime: 'image/jpeg',
    _links: {
      thumb: {
        _href: '/assets/' + collectionId + relativePath,
      },
      self: {
        _href: '',
      },
      webdav: {
        _href: '/assets/' + collectionId + relativePath,
      },
    },
  };
};

export const mockData: IndexRecord[] = [
  generateMockRecord(
    '001',
    'animals',
    '/Ram/',
    '9184032889_baeef0f143_k.full-curl ram in Denali National Park and Preserve',
    '.jpg'
  ),

  generateMockRecord(
    '002',
    'animals',
    '/Ram/',
    '9186263568_7f753ed399_k.full curl ram in Denali National Park and Preserve',
    '.jpg'
  ),

  generateMockRecord(
    '003',
    'animals',
    '/Ram/',
    '10678234286_f42986b005_k.Full Curl by Intermountain Region US Forest Service',
    '.jpg'
  ),
  generateMockRecord(
    '004',
    'animals',
    '/Snail/',
    '40001698461_0457172843_k.Motel Snails',
    '.jpg'
  ),
  generateMockRecord(
    '005',
    'animals',
    '/Snail/',
    '48490105071_1070413a77_k.aquatic snail',
    '.jpg'
  ),
  generateMockRecord('006', 'animals', '/', 'josh', '.jpg'),

  generateMockRecord(
    '007',
    'places',
    '/',
    '4080412255_a3be4d28f5_b.Post Office Kenton Bar Dept of Environmental Health c1935',
    '.jpg'
  ),

  generateMockRecord(
    '008',
    'places',
    '/Motel/',
    '4666103427_5773595b79_h.Postcard Vancouver Colonial Motel, c.1951',
    '.jpg'
  ),
  generateMockRecord(
    '009',
    'places',
    '/Motel/',
    '7515592582_bca3a5af3e_h.Postcard Sage Brush Motel, Kamloops, BC, 1960',
    '.jpg'
  ),
  generateMockRecord(
    '010',
    'places',
    '/Motel/',
    '8087704273_4fdd8bfece_h.Postcard Crescent Motel, Qualicum Beach, BC, c.1960',
    '.jpg'
  ),
  generateMockRecord(
    '011',
    'places',
    '/Motel/',
    '8087706126_471fa77ab9_h.Postcard Sunny Beach Motel, Penticton, BC, 1962',
    '.jpg'
  ),

  generateMockRecord(
    '012',
    'places',
    '/Post Office/',
    '4899337978_89276320cb_c.Postcard Vancouver General Post Office, c1957',
    '.jpg'
  ),
  generateMockRecord(
    '013',
    'places',
    '/Post Office/',
    '5206615561_7feb17e859_k.Vancouver Power Lines, 1914',
    '.jpg'
  ),
  generateMockRecord(
    '014',
    'places',
    '/Post Office/',
    '8867645403_fd18f68f60_c.Postcard Vancouver International Airport, 1958',
    '.jpg'
  ),

  generateMockRecord(
    '015',
    'sports',
    '/Baseball/',
    '416092529_0c4beafbf1_h.No Known Restrictions: Baseball: Ty Cobb from George Grantham Bain Collection, 1914',
    '.jpg'
  ),
  generateMockRecord(
    '016',
    'sports',
    '/Baseball/',
    '416099269_8c08facbd0_k.No Known Restrictions: Baseball: Bing Miller Out at Home, 1925',
    '.jpg'
  ),
  generateMockRecord(
    '017',
    'sports',
    '/Baseball/',
    '434422010_b9e925493b_h.No Known Restrictions: Baseball Fans at 7am Outside Polo Grounds from the Bain Collection, ca 1908-1925',
    '.jpg'
  ),
  generateMockRecord(
    '018',
    'sports',
    '/Baseball/',
    '2274310785_18b5ee5946_b.Baseball Team circa 1912',
    '.jpg'
  ),
  generateMockRecord(
    '019',
    'sports',
    '/Baseball/',
    '34550046331_fe56740dde_h.May 2017 Bullpen Babe Ruth Baseballs',
    '.jpg'
  ),

  generateMockRecord(
    '020',
    'sports',
    '/Big Sur Mud Run/2011/',
    '5569749383_15bf929cd8_k',
    '.jpg'
  ),
  generateMockRecord(
    '021',
    'sports',
    '/Big Sur Mud Run/2011/',
    '5570210768_af0f3de351_k',
    '.jpg'
  ),

  generateMockRecord(
    '022',
    'sports',
    '/Big Sur Mud Run/2012/',
    '7025086135_ca11140e17_k',
    '.jpg'
  ),

  generateMockRecord(
    '023',
    'sports',
    '/Big Sur Mud Run/2013/',
    '8592956319_442c3163cf_k',
    '.jpg'
  ),
  generateMockRecord(
    '024',
    'sports',
    '/Big Sur Mud Run/2013/',
    '8594046540_ebf12f0796_k',
    '.jpg'
  ),

  generateMockRecord(
    '025',
    'sports',
    '/Football/',
    '14962586954_71434f3054_b.The new field goal posts at Vaught-Hemingway Stadium',
    '.jpg'
  ),
];

const mockDataLots: IndexRecord[] = shuffle(mockData)
  .concat(shuffle(mockData))
  .concat(shuffle(mockData))
  .concat(shuffle(mockData))
  .concat(shuffle(mockData))
  .concat(shuffle(mockData));

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
