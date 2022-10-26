import { parseFullPath, parsePropFindResponse, isParent } from './../file-system/file-system.utils';
import { updateFileSystemDictionaryTree } from './../file-system/file-system-dictionary.utils';
import { updateFileSystemArrayTree, findObjectInArrayTree } from './../file-system/file-system-array.utils';
import { propfindXml } from '../__data__/webdav-responses';
import { FileSystemDirectory, FileSystemObjectPathInfo } from '../file-system/file-system.models';

// ██████   █████  ████████ ██   ██
// ██   ██ ██   ██    ██    ██   ██
// ██████  ███████    ██    ███████
// ██      ██   ██    ██    ██   ██
// ██      ██   ██    ██    ██   ██

describe('parse full path of file system object', () => {
  it.each([
    {
      fullPath: 'collection-abc',
      expectedFullPath: 'collection-abc',
      expectedCollectionId: 'collection-abc',
      expectedRelativePath: '/',
      expectedName: 'collection-abc',
      expectedPathParts: ['collection-abc'],
    },
    {
      fullPath: 'collection-abc/',
      expectedFullPath: 'collection-abc',
      expectedCollectionId: 'collection-abc',
      expectedRelativePath: '/',
      expectedName: 'collection-abc',
      expectedPathParts: ['collection-abc'],
    },
    {
      fullPath: '/collection-abc',
      expectedFullPath: 'collection-abc',
      expectedCollectionId: 'collection-abc',
      expectedRelativePath: '/',
      expectedName: 'collection-abc',
      expectedPathParts: ['collection-abc'],
    },
    {
      fullPath: '/collection-abc/',
      expectedFullPath: 'collection-abc',
      expectedCollectionId: 'collection-abc',
      expectedRelativePath: '/',
      expectedName: 'collection-abc',
      expectedPathParts: ['collection-abc'],
    },

    {
      fullPath: '/collection-abc/foo/bar/baz/quux waldo fred.jpg/',
      expectedFullPath: 'collection-abc/foo/bar/baz/quux waldo fred.jpg',
      expectedCollectionId: 'collection-abc',
      expectedRelativePath: '/foo/bar/baz/quux waldo fred.jpg',
      expectedName: 'quux waldo fred.jpg',
      expectedPathParts: ['collection-abc', 'foo', 'bar', 'baz', 'quux waldo fred.jpg'],
    },
  ])(
    'some name',
    ({ fullPath, expectedFullPath, expectedCollectionId, expectedRelativePath, expectedName, expectedPathParts }) => {
      // Act
      const result = parseFullPath(fullPath);
      //console.log(result);

      // Assert
      expect(result.fullPath).toBe(expectedFullPath);
      expect(result.collectionId).toBe(expectedCollectionId);
      expect(result.relativePath).toBe(expectedRelativePath);
      expect(result.name).toBe(expectedName);
      expect(result.pathParts).toStrictEqual(expectedPathParts);
    },
  );
});

describe('is parent test', () => {
  it.each([{ candidateParent: 'collection-abc', candidateChild: 'collection-abc/foo', expectedResult: true }])(
    'some name',
    ({ candidateParent, candidateChild, expectedResult }) => {
      // Act
      const result = isParent(
        new FileSystemDirectory(candidateParent, new Date(), new Date()),
        new FileSystemDirectory(candidateChild, new Date(), new Date()),
      );

      // Assert
      expect(result).toBe(expectedResult);
    },
  );
});

// ██████   █████  ██████  ███████ ███████
// ██   ██ ██   ██ ██   ██ ██      ██
// ██████  ███████ ██████  ███████ █████
// ██      ██   ██ ██   ██      ██ ██
// ██      ██   ██ ██   ██ ███████ ███████

describe('parse PROPFIND response test', () => {
  test('successfully parses', () => {
    const parsed = parsePropFindResponse(propfindXml);
    expect(parsed.length).toBe(9);

    const first = parsed[0];
    expect(first.objectType).toBe('directory');
    expect(first.name).toBe('animals');
    expect(first.collectionId).toBe('animals');
    expect(first.relativePath).toBe('/');
  });
});

// ████████ ██████  ███████ ███████               ██████  ██  ██████ ████████ ██  ██████  ███    ██  █████  ██████  ██    ██
//    ██    ██   ██ ██      ██                    ██   ██ ██ ██         ██    ██ ██    ██ ████   ██ ██   ██ ██   ██  ██  ██
//    ██    ██████  █████   █████       █████     ██   ██ ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ ██████    ████
//    ██    ██   ██ ██      ██                    ██   ██ ██ ██         ██    ██ ██    ██ ██  ██ ██ ██   ██ ██   ██    ██
//    ██    ██   ██ ███████ ███████               ██████  ██  ██████    ██    ██  ██████  ██   ████ ██   ██ ██   ██    ██

describe('convert PROPFIND response to dictionary tree', () => {
  test('successfully creates dictionary tree', () => {
    const parsed = parsePropFindResponse(propfindXml);

    const tree = updateFileSystemDictionaryTree({}, parsed);

    //console.log(JSON.stringify(tree));

    expect(tree['animals']).not.toBe(undefined);
  });
});

describe('convert PROPFIND response to array tree', () => {
  test('successfully creates array tree', () => {
    const parsed = parsePropFindResponse(propfindXml);

    const tree = updateFileSystemArrayTree([], parsed);

    console.log(JSON.stringify(tree));

    //expect(tree["animals"]).not.toBe(undefined);
  });
});


describe('delete object in array tree', () => {
  test('successfully deletes object', () => {

    // Arrange
    const parsed = parsePropFindResponse(propfindXml);
    let tree = updateFileSystemArrayTree([], parsed);

    // Precondition
    let actual = findObjectInArrayTree(tree, 'animals/Ram');
    expect(actual?.fullPath).toBe("animals/Ram");

    console.log('----------')

    // Act
    tree = updateFileSystemArrayTree(tree, [], [new FileSystemObjectPathInfo('animals/Ram')]);

    // Assert
    actual = findObjectInArrayTree(tree, 'animals/Ram');
    expect(actual).toBe(undefined);
    
  });
});


// ███████ ██ ███    ██ ██████  
// ██      ██ ████   ██ ██   ██ 
// █████   ██ ██ ██  ██ ██   ██ 
// ██      ██ ██  ██ ██ ██   ██ 
// ██      ██ ██   ████ ██████  


describe('find object in array tree', () => {
  test('successfully finds object', () => {

    const parsed = parsePropFindResponse(propfindXml);

    const tree = updateFileSystemArrayTree([], parsed);


    const actual = findObjectInArrayTree(tree, 'animals');
    expect(actual?.fullPath).toBe("animals");

    

    //expect(tree["animals"]).not.toBe(undefined);
  });
});



// describe('parse webdav propfind into dictionary-based tree', () => {

//   it.each([
//     {fullPath: 'collection-abc',   expectedFullPath: 'collection-abc', expectedCollectionId: 'collection-abc', expectedRelativePath: '/', expectedName: 'collection-abc', expectedPathParts: ['collection-abc']},
//     {fullPath: 'collection-abc/',  expectedFullPath: 'collection-abc', expectedCollectionId: 'collection-abc', expectedRelativePath: '/', expectedName: 'collection-abc', expectedPathParts: ['collection-abc']},
//     {fullPath: '/collection-abc',  expectedFullPath: 'collection-abc', expectedCollectionId: 'collection-abc', expectedRelativePath: '/', expectedName: 'collection-abc', expectedPathParts: ['collection-abc']},
//     {fullPath: '/collection-abc/', expectedFullPath: 'collection-abc', expectedCollectionId: 'collection-abc', expectedRelativePath: '/', expectedName: 'collection-abc', expectedPathParts: ['collection-abc']},

//     {fullPath: '/collection-abc/foo/bar/baz/quux waldo fred.jpg/', expectedFullPath: 'collection-abc/foo/bar/baz/quux waldo fred.jpg', expectedCollectionId: 'collection-abc', expectedRelativePath: '/foo/bar/baz/quux waldo fred.jpg', expectedName: 'quux waldo fred.jpg', expectedPathParts: ['collection-abc', 'foo','bar','baz','quux waldo fred.jpg']},

//   ])('some name', ({ fullPath, expectedFullPath, expectedCollectionId, expectedRelativePath, expectedName, expectedPathParts }) => {
//     // Act
//     const result = parseFullPath(fullPath);
//     console.log(result);

//     // Assert
//     expect(result.fullPath).toBe(expectedFullPath);
//     expect(result.collectionId).toBe(expectedCollectionId);
//     expect(result.relativePath).toBe(expectedRelativePath);
//     expect(result.name).toBe(expectedName);
//     expect(result.pathParts).toStrictEqual(expectedPathParts);

//   });

// });
