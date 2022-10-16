import { FileSystemDirectory } from '../store/file-system.models';

export const fileSystemMockData: FileSystemDirectory[] = [
  {
    id: 'Collection 1',
    name: 'Collection 1',
    directories: [
      { id: 'Collection 1/Foo', name: 'Foo' },
      { id: 'Collection 1/Bar', name: 'Bar' },
      { id: 'Collection 1/Baz', name: 'Baz' },
    ],
  },
  {
    id: 'Collection 2',
    name: 'Collection 2',
    directories: [
      { id: 'Collection 2/Quux', name: 'Quux' },
      { id: 'Collection 2/Waldo', name: 'Waldo' },
      {
        id: 'Collection 2/Fred',
        name: 'Fred',
        directories: [
          {
            id: 'Collection 2/Fred/Pebbles',
            name: 'Pebbles',
            directories: [
              { id: 'Collection 2/Fred/Pebbles/Blue', name: 'Blue' },
              { id: 'Collection 2/Fred/Pebbles/Red', name: 'Red' },
              { id: 'Collection 2/Fred/Pebbles/Pink', name: 'Pink' },
              { id: 'Collection 2/Fred/Pebbles/Purple', name: 'Purple' },
            ],
            files: [
              { id: 'Collection 2/Fred/Pebbles/Froot Loops', name: 'Froot Loops' },
              { id: 'Collection 2/Fred/Pebbles/Rice Crispies', name: 'Rice Crispies' },
              { id: 'Collection 2/Fred/Pebbles/Corn Flakes', name: 'Corn Flakes' },
              { id: 'Collection 2/Fred/Pebbles/Apple Jacks', name: 'Apple Jacks' },
            ]
          },
        ],
      },
    ],
  },
  {
    id: 'Collection 3',
    name: 'Collection 3',
  },
];

export const fileSystemMockDirectory = {
  id: 'Collection 2/Fred/Pebbles',
  name: 'Pebbles',
  directories: [
    { id: 'Collection 2/Fred/Pebbles/Blue', name: 'Blue' },
    { id: 'Collection 2/Fred/Pebbles/Red', name: 'Red' },
    { id: 'Collection 2/Fred/Pebbles/Pink', name: 'Pink' },
    { id: 'Collection 2/Fred/Pebbles/Purple', name: 'Purple' },
  ],
  files: [
    { id: 'Collection 2/Fred/Pebbles/Froot Loops', name: 'Froot Loops' },
    { id: 'Collection 2/Fred/Pebbles/Rice Crispies', name: 'Rice Crispies' },
    { id: 'Collection 2/Fred/Pebbles/Corn Flakes', name: 'Corn Flakes' },
    { id: 'Collection 2/Fred/Pebbles/Apple Jacks', name: 'Apple Jacks' },
  ]
};