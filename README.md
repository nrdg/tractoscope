# Tractoscope

This is a browser-based visualization tool for [qsiprep](https://qsiprep.readthedocs.io/en/latest/)/pyAFQ-produced datasets
that relies on the niivue library

## Dataset.json configuration

Datasets are configured inside the Dataset.json file.
to add a new dataset simply add a new value with the key being the dataset, and the value being an object. Configure the following parameters:

### bucket
"bucket":"s3-bucket-name"
set this to the name of your s3 bucket

### prefix
"prefix":"path-to-data"
set this to the path to your data, it should end with a "/" and start with a folder name, for example: "foo/bar/"

### participantsSize
"participantsSize":#participants

Participants Size does not need to be exact, it is simply used to set a limit for the number of times Tractoscope will keep continuing a s3 token to load objects. Set it to something close to, but greater than the number of participants in your dataset.

### scans
"scans":["scan" ...]

This is a list of all of the scans that are in your dataset. only nii files that contain at least one of these strings will be used. The string does not need to be the entire file name, but should be unique for each scan.

### trkFiles (optional)

"trkFiles":[ {"name","fileName","rgba255"} ...]

This is a list of all trkFiles in your dataset, and their corresponding colors and bundle names. configure each as follows:

name - this should be the name of the bundle that the trk file corresponds to.

fileName - similar to scans, we are only checking if the file name contains the string, so it should be unique for each file, but doesn't need to be the whole file name.

rgba255 - set this to a array of four ints whose 0 <= value < 256.

## trxFile (optional)

"trxFile":{"fileName"}

This specifies the filename of the trx file you would like to load. Same as before, this does not need to be the whole filename, but should be unique to one trx file.

## CORS configuration

For tractoscope to work your dataset must be publicly hosted and have CORS configured.
This is an example CORS configuration that works with tractoscope.
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

