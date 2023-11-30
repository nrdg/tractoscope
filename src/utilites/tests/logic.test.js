const {filter} = require('core-js/core/array');
const logic = require('../logic.js');

describe('logic.js', () => {
    describe('groupByExtension', () => {
        it('should return an object with keys for each extension', () => {
            //it should also handle .nii.gz files properly
            const filePaths = ['test1.txt', 'test2.txt', 'test3.json', 'test4.nii.gz'];
            const filesByExtension = logic.groupByExtension(filePaths);
            const correct = {
                "txt": ['test1.txt', 'test2.txt'],
                "json": ['test3.json'],
                "nii.gz": ['test4.nii.gz']
            };
            expect(filesByExtension).toEqual(correct);
        });
    });
    describe('getLastPathComponent', () => {
        it('should return the last component of a path', () => {
            const filePath = 'test1/test2/test3.txt';
            const fileName = logic.getLastPathComponent(filePath);
            expect(fileName).toEqual('test3.txt');
        });
        it('should return the last component of a path with no file name', () => {
            const filePath = 'test1/test2/test3/';
            const fileName = logic.getLastPathComponent(filePath);
            expect(fileName).toEqual('test3');
        });
    });
    describe('getSubfolders', () => {
      it('should return an array of objects with prefix and folderName', () => {
        const prefixes = ['folder/subfolder1', 'folder/subfolder2'];
        const expectedOutput = [
          { prefix: 'folder/subfolder1', folderName: 'subfolder1' },
          { prefix: 'folder/subfolder2', folderName: 'subfolder2' },
        ];
        expect(logic.getSubfolders(prefixes)).toEqual(expectedOutput);
      });
    });
    describe('filterBySubfolder', () => {
        it('should return only the files in the specified subfolder', () => {
            const files = ['folder/subfolder1/test1.txt', 'folder/subfolder1/test2.txt', 'folder/subfolder2/test3.txt'];
            const folderPath = 'folder/subfolder1';
            const filteredFiles = logic.filterBySubfolder(files, folderPath);
            expect(filteredFiles).toEqual(['folder/subfolder1/test1.txt', 'folder/subfolder1/test2.txt']);
        });
    });
});