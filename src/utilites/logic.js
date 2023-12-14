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

function getLastPathComponent(filePath) {
    const parts = filePath.split('/');
    let fileName = parts.pop();
    while (fileName === '') {
        fileName = parts.pop();
    }
    return fileName;
}

export function getSubfolders(prefixes){
  let output = []
  for (let prefix of prefixes) {
      let folderName = getLastPathComponent(prefix);
      output.push({prefix, folderName});
  }
  return output
}

//trk bundles = list of object, object = {name, fileName,rgba255}
//trkpaths = list of file paths to trks
//returns list of objects, where object = {filepath, name, rgba255}
//and each object is a contains the filepath that includes the filename
//and then its corresponding rgba255 and name values
export function getTrkBundles(trkBundles, trkPaths) {
  //pre conditions check
  if(trkBundles == null){
    throw new Error ("trkBundles is null");
  }

  if(trkPaths == null){
    throw new Error ("trkPaths is null");
  }

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