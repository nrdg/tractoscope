//sorts filepaths by file extension
//returns object with file extension as key paired with array of filepaths
export function groupByExtension(filePaths) {
    const filesByExtension = {};
    for (const path of filePaths) {
      const extensions = path.split('.').slice(1);
      if (extensions.length > 0) {
        const extension = extensions.join('.');
        if (filesByExtension[extension]) {
          filesByExtension[extension].push(path);
        } else {
          filesByExtension[extension] = [path];
        }
      }
    }
    return filesByExtension;
}

export function getLastPathComponent(filePath) {
    const parts = filePath.split('/');
    let fileName = parts.pop();
    while (fileName === '') {
        fileName = parts.pop();
    }
    return fileName;
}

export function filterBySubfolder(files, folderPath) {
    return files.filter((filePath) => {
      const pathParts = filePath.split("/");
      const fileName = pathParts[pathParts.length - 1];
      return filePath.startsWith(folderPath) && !fileName.includes("/");
    });
}

//returns all strings from list1 that contain a substring from list2
export function filterBySubstring(list1, list2) {
  return list1.filter(str1 => list2.some(str2 => str1.includes(str2)));
}

//trk bundles = list of object, object = {name, fileName,rgba255}
//trkpaths = list of file paths to trks
//returns list of objects, where object = {filepath, name, rgba255}
//and each object is a contains the filepath that includes the filename
//and then its corresponding rgba255 and name values
export function getTrkBundles(trkBundles, trkPaths) {
  return trkPaths.filter(trkPath => {
    return trkBundles.some(bundle => {
      return trkPath.includes(bundle.fileName);
    });
  }).map(trkPath => {
    const bundle = trkBundles.find(bundle => {
      return trkPath.includes(bundle.fileName);
    });
    return {
      filepath: trkPath,
      name: bundle.name,
      rgba255: bundle.rgba255
    };
  });
}