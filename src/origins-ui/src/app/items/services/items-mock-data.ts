import { ItemInfo } from "origins-common/items";

const generateMockItem = (
  id: string,
  collectionId: string,
  relativeDirectory: string,
  filename: string,
  fileExtension: string
): ItemInfo => {
  const relativePath = relativeDirectory + encodeURI(filename) + fileExtension;

  return {
    id: Math.floor(Math.random() * 5000000).toString(),
    name: "Some Name",
    collectionId: collectionId,
    fileRelativePath: relativePath,
    fileAbsolutePath: relativePath,
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

export const mockItems: ItemInfo[] = [
  generateMockItem(
    '001',
    'animals',
    '/Ram/',
    '9184032889_baeef0f143_k.full-curl ram in Denali National Park and Preserve',
    '.jpg'
  ),

  generateMockItem(
    '002',
    'animals',
    '/Ram/',
    '9186263568_7f753ed399_k.full curl ram in Denali National Park and Preserve',
    '.jpg'
  ),

  generateMockItem(
    '003',
    'animals',
    '/Ram/',
    '10678234286_f42986b005_k.Full Curl by Intermountain Region US Forest Service',
    '.jpg'
  ),
  generateMockItem(
    '004',
    'animals',
    '/Snail/',
    '40001698461_0457172843_k.Motel Snails',
    '.jpg'
  ),
  generateMockItem(
    '005',
    'animals',
    '/Snail/',
    '48490105071_1070413a77_k.aquatic snail',
    '.jpg'
  ),
  generateMockItem('006', 'animals', '/', 'josh', '.jpg'),

  generateMockItem(
    '007',
    'places',
    '/',
    '4080412255_a3be4d28f5_b.Post Office Kenton Bar Dept of Environmental Health c1935',
    '.jpg'
  ),

  generateMockItem(
    '008',
    'places',
    '/Motel/',
    '4666103427_5773595b79_h.Postcard Vancouver Colonial Motel, c.1951',
    '.jpg'
  ),
  generateMockItem(
    '009',
    'places',
    '/Motel/',
    '7515592582_bca3a5af3e_h.Postcard Sage Brush Motel, Kamloops, BC, 1960',
    '.jpg'
  ),
  generateMockItem(
    '010',
    'places',
    '/Motel/',
    '8087704273_4fdd8bfece_h.Postcard Crescent Motel, Qualicum Beach, BC, c.1960',
    '.jpg'
  ),
  generateMockItem(
    '011',
    'places',
    '/Motel/',
    '8087706126_471fa77ab9_h.Postcard Sunny Beach Motel, Penticton, BC, 1962',
    '.jpg'
  ),

  generateMockItem(
    '012',
    'places',
    '/Post Office/',
    '4899337978_89276320cb_c.Postcard Vancouver General Post Office, c1957',
    '.jpg'
  ),
  generateMockItem(
    '013',
    'places',
    '/Post Office/',
    '5206615561_7feb17e859_k.Vancouver Power Lines, 1914',
    '.jpg'
  ),
  generateMockItem(
    '014',
    'places',
    '/Post Office/',
    '8867645403_fd18f68f60_c.Postcard Vancouver International Airport, 1958',
    '.jpg'
  ),

  generateMockItem(
    '015',
    'sports',
    '/Baseball/',
    '416092529_0c4beafbf1_h.No Known Restrictions: Baseball: Ty Cobb from George Grantham Bain Collection, 1914',
    '.jpg'
  ),
  generateMockItem(
    '016',
    'sports',
    '/Baseball/',
    '416099269_8c08facbd0_k.No Known Restrictions: Baseball: Bing Miller Out at Home, 1925',
    '.jpg'
  ),
  generateMockItem(
    '017',
    'sports',
    '/Baseball/',
    '434422010_b9e925493b_h.No Known Restrictions: Baseball Fans at 7am Outside Polo Grounds from the Bain Collection, ca 1908-1925',
    '.jpg'
  ),
  generateMockItem(
    '018',
    'sports',
    '/Baseball/',
    '2274310785_18b5ee5946_b.Baseball Team circa 1912',
    '.jpg'
  ),
  generateMockItem(
    '019',
    'sports',
    '/Baseball/',
    '34550046331_fe56740dde_h.May 2017 Bullpen Babe Ruth Baseballs',
    '.jpg'
  ),

  generateMockItem(
    '020',
    'sports',
    '/Big Sur Mud Run/2011/',
    '5569749383_15bf929cd8_k',
    '.jpg'
  ),
  generateMockItem(
    '021',
    'sports',
    '/Big Sur Mud Run/2011/',
    '5570210768_af0f3de351_k',
    '.jpg'
  ),

  generateMockItem(
    '022',
    'sports',
    '/Big Sur Mud Run/2012/',
    '7025086135_ca11140e17_k',
    '.jpg'
  ),

  generateMockItem(
    '023',
    'sports',
    '/Big Sur Mud Run/2013/',
    '8592956319_442c3163cf_k',
    '.jpg'
  ),
  generateMockItem(
    '024',
    'sports',
    '/Big Sur Mud Run/2013/',
    '8594046540_ebf12f0796_k',
    '.jpg'
  ),

  generateMockItem(
    '025',
    'sports',
    '/Football/',
    '14962586954_71434f3054_b.The new field goal posts at Vaught-Hemingway Stadium',
    '.jpg'
  ),
];

export const mockItemsBig: ItemInfo[] = shuffle(mockItems)
  .concat(shuffle(mockItems))
  .concat(shuffle(mockItems))
  .concat(shuffle(mockItems))
  .concat(shuffle(mockItems))
  .concat(shuffle(mockItems));

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
