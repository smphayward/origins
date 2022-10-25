// import {
//   FileSystemDirectory,
//   FileSystemDirectoryDictionary,
//   FileSystemFile,
// } from '../store/file-system.models';

// // export const fileSystemMockDirectory: FileSystemDirectory = {
// //   id: 'Collection 2/Fred/Pebbles',
// //   collectionId: 'Collection 2',
// //   name: 'Pebbles',
// //   directories: [
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Blue',
// //       collectionId: 'Collection 2',
// //       name: 'Blue',
// //     },
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Red',
// //       collectionId: 'Collection 2',
// //       name: 'Red',
// //     },
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Pink',
// //       collectionId: 'Collection 2',
// //       name: 'Pink',
// //     },
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Purple',
// //       collectionId: 'Collection 2',
// //       name: 'Purple',
// //     },
// //   ],
// //   files: [
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Froot Loops',
// //       collectionId: 'Collection 2',
// //       name: 'Froot Loops',
// //     },
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Rice Crispies',
// //       collectionId: 'Collection 2',
// //       name: 'Rice Crispies',
// //     },
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Corn Flakes',
// //       collectionId: 'Collection 2',
// //       name: 'Corn Flakes',
// //     },
// //     {
// //       id: 'Collection 2/Fred/Pebbles/Apple Jacks',
// //       collectionId: 'Collection 2',
// //       name: 'Apple Jacks',
// //     },
// //   ],
// // };

// // ██████  ██  ██████ ████████ ██  ██████  ███    ██  █████  ██████  ██    ██
// // ██   ██ ██ ██         ██    ██ ██    ██ ████   ██ ██   ██ ██   ██  ██  ██
// // ██   ██ ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ ██████    ████
// // ██   ██ ██ ██         ██    ██ ██    ██ ██  ██ ██ ██   ██ ██   ██    ██
// // ██████  ██  ██████    ██    ██  ██████  ██   ████ ██   ██ ██   ██    ██

// export const fileSystemMockDirectories: FileSystemDirectoryDictionary = {
//   ['Collection 1']: {
//     id: 'Collection 1',
//     collectionId: 'Collection 1',
//     name: 'Collection 1',
//     objectType: 'directory',
//     children: {
//       ['Collection 1/Foo']: {
//         id: 'Collection 1/Foo',
//         collectionId: 'Collection 1',
//         name: 'Foo',
//         objectType: 'directory',
//       },
//       ['Collection 1/Bar']: {
//         id: 'Collection 1/Bar',
//         collectionId: 'Collection 1',
//         name: 'Bar',
//         objectType: 'directory',
//       },
//       ['Collection 1/Baz']: {
//         id: 'Collection 1/Baz',
//         collectionId: 'Collection 1',
//         name: 'Baz',
//         objectType: 'directory',
//       },
//     },
//   },
//   ['Collection 2']: {
//     id: 'Collection 2',
//     collectionId: 'Collection 2',
//     name: 'Collection 2',
//     objectType: 'directory',
//     children: {
//       ['Collection 2/Quux']: {
//         id: 'Collection 2/Quux',
//         collectionId: 'Collection 2',
//         name: 'Quux',
//         objectType: 'directory',
//       },
//       ['Collection 2/Waldo']: {
//         id: 'Collection 2/Waldo',
//         collectionId: 'Collection 2',
//         name: 'Waldo',
//         objectType: 'directory',
//       },
//       ['Collection 2/Fred']: {
//         id: 'Collection 2/Fred',
//         collectionId: 'Collection 2',
//         name: 'Fred',
//         objectType: 'directory',
//         children: {
//           ['Collection 2/Fred/Pebbles']: {
//             id: 'Collection 2/Fred/Pebbles',
//             collectionId: 'Collection 2',
//             name: 'Pebbles',
//             objectType: 'directory',
//             children: {
//               ['Collection 2/Fred/Pebbles/Blue']: {
//                 id: 'Collection 2/Fred/Pebbles/Blue',
//                 collectionId: 'Collection 2',
//                 name: 'Blue',
//                 objectType: 'directory',
//               },
//               ['Collection 2/Fred/Pebbles/Red']: {
//                 id: 'Collection 2/Fred/Pebbles/Red',
//                 collectionId: 'Collection 2',
//                 name: 'Red',
//                 objectType: 'directory',
//               },
//               ['Collection 2/Fred/Pebbles/Pink']: {
//                 id: 'Collection 2/Fred/Pebbles/Pink',
//                 collectionId: 'Collection 2',
//                 name: 'Pink',
//                 objectType: 'directory',
//               },
//               ['Collection 2/Fred/Pebbles/Purple']: {
//                 id: 'Collection 2/Fred/Pebbles/Purple',
//                 collectionId: 'Collection 2',
//                 name: 'Purple',
//                 objectType: 'directory',
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   ['Collection 3']: {
//     id: 'Collection 3',
//     collectionId: 'Collection 3',
//     name: 'Collection 3',
//     objectType: 'directory',
//   },
// };

// // ███████ ██       █████  ████████
// // ██      ██      ██   ██    ██
// // █████   ██      ███████    ██
// // ██      ██      ██   ██    ██
// // ██      ███████ ██   ██    ██

// // export const fileSystemMockDirectories: FileSystemDirectory[] = [
// //   {
// //     id: 'Collection 1',
// //     collectionId: 'Collection 1',
// //     name: 'Collection 1',
// //     // directoryIds: ['Collection 1/Foo', 'Collection 1/Bar', 'Collection 1/Baz'],
// //   },
// //   { id: 'Collection 1/Foo', collectionId: 'Collection 1', name: 'Foo' },
// //   { id: 'Collection 1/Bar', collectionId: 'Collection 1', name: 'Bar' },
// //   { id: 'Collection 1/Baz', collectionId: 'Collection 1', name: 'Baz' },
// //   {
// //     id: 'Collection 2',
// //     collectionId: 'Collection 2',
// //     name: 'Collection 2',
// //     // directoryIds: [
// //     //   'Collection 2/Quux',
// //     //   'Collection 2/Waldo',
// //     //   'Collection 2/Fred',
// //     // ],
// //   },
// //   { id: 'Collection 2/Quux', collectionId: 'Collection 2', name: 'Quux' },
// //   { id: 'Collection 2/Waldo', collectionId: 'Collection 2', name: 'Waldo' },
// //   {
// //     id: 'Collection 2/Fred',
// //     collectionId: 'Collection 2',
// //     name: 'Fred',
// //     // directoryIds: ['Collection 2/Fred/Pebbles'],
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles',
// //     collectionId: 'Collection 2',
// //     name: 'Pebbles',
// //     // directoryIds: [
// //     //   'Collection 2/Fred/Pebbles/Blue',
// //     //   'Collection 2/Fred/Pebbles/Red',
// //     //   'Collection 2/Fred/Pebbles/Pink',
// //     //   'Collection 2/Fred/Pebbles/Purple',
// //     // ]
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Blue',
// //     collectionId: 'Collection 2',
// //     name: 'Blue',
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Red',
// //     collectionId: 'Collection 2',
// //     name: 'Red',
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Pink',
// //     collectionId: 'Collection 2',
// //     name: 'Pink',
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Purple',
// //     collectionId: 'Collection 2',
// //     name: 'Purple',
// //   },
// //   {
// //     id: 'Collection 3',
// //     collectionId: 'Collection 3',
// //     name: 'Collection 3',
// //   },
// // ];

// // export const fileSystemMockFiles: FileSystemFile[] = [
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Froot Loops',
// //     collectionId: 'Collection 2',
// //     name: 'Froot Loops',
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Rice Crispies',
// //     collectionId: 'Collection 2',
// //     name: 'Rice Crispies',
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Corn Flakes',
// //     collectionId: 'Collection 2',
// //     name: 'Corn Flakes',
// //   },
// //   {
// //     id: 'Collection 2/Fred/Pebbles/Apple Jacks',
// //     collectionId: 'Collection 2',
// //     name: 'Apple Jacks',
// //   },
// // ];

// // export const fileSystemMockData: FileSystemDirectory[] = [
// //   {
// //     id: 'Collection 1',
// //     collectionId: 'Collection 1',
// //     name: 'Collection 1',
// //     directories: [
// //       { id: 'Collection 1/Foo', collectionId: 'Collection 1', name: 'Foo' },
// //       { id: 'Collection 1/Bar', collectionId: 'Collection 1', name: 'Bar' },
// //       { id: 'Collection 1/Baz', collectionId: 'Collection 1', name: 'Baz' },
// //     ],
// //   },
// //   {
// //     id: 'Collection 2',
// //     collectionId: 'Collection 2',
// //     name: 'Collection 2',
// //     directories: [
// //       { id: 'Collection 2/Quux', collectionId: 'Collection 2', name: 'Quux' },
// //       { id: 'Collection 2/Waldo', collectionId: 'Collection 2', name: 'Waldo' },
// //       {
// //         id: 'Collection 2/Fred',
// //         collectionId: 'Collection 2',
// //         name: 'Fred',
// //         directories: [
// //           {
// //             id: 'Collection 2/Fred/Pebbles',
// //             collectionId: 'Collection 2',
// //             name: 'Pebbles',
// //             directories: [
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Blue',
// //                 collectionId: 'Collection 2',
// //                 name: 'Blue',
// //               },
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Red',
// //                 collectionId: 'Collection 2',
// //                 name: 'Red',
// //               },
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Pink',
// //                 collectionId: 'Collection 2',
// //                 name: 'Pink',
// //               },
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Purple',
// //                 collectionId: 'Collection 2',
// //                 name: 'Purple',
// //               },
// //             ],
// //             files: [
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Froot Loops',
// //                 collectionId: 'Collection 2',
// //                 name: 'Froot Loops',
// //               },
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Rice Crispies',
// //                 collectionId: 'Collection 2',
// //                 name: 'Rice Crispies',
// //               },
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Corn Flakes',
// //                 collectionId: 'Collection 2',
// //                 name: 'Corn Flakes',
// //               },
// //               {
// //                 id: 'Collection 2/Fred/Pebbles/Apple Jacks',
// //                 collectionId: 'Collection 2',
// //                 name: 'Apple Jacks',
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     id: 'Collection 3',
// //     collectionId: 'Collection 3',
// //     name: 'Collection 3',
// //   },
// // ];
