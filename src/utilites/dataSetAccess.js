class DatasetAccess {

    constructor(){
    }

    /**
     * this function returns a link corresponding to the requested file
     * @param {string} filePath - the path to the requested file
     * @return {string} https address that contains requested file
     */
    getLink(filePath) {
        throw new Error("Not implemeneted");
    }

    /**
     * this function returns a json representing the contents of the requested folder
     * @param {string} [path=''] - The path to the directory to list
     * @param {boolean} recursive - Whether to list files recursively.
     * @param {number} [limit=1000] - The maximum number of files to list, some implementations
     *                               may ignore this.
     * @return {Promise} A promise that resolves to a json representing the contents of the requested folder
     */
    listFiles(path = '', recursive, limit = 1000) {
        throw new Error("Not implemeneted");
    }
}

export class LocalDatasetAccess extends DatasetAccess{

    /**
     * Constructs a new instance of the DatasetAccess class.
     * @param {string} datasetUrl - The url of the dataset.
     * @param {string} path - The path to the parent directory of the cors dataset.
     */
    constructor(url,path){
        super();
        this.url = url;
        this.path = path;
    }

    /**
     * Constructs a full URL for a specific file in the dataset.
     * @param {string} filePath - The path of the file within the dataset.
     *                          filePath should NOT start with a "/"
     * @returns {string} The full URL of the file.
     */
    getLink(filePath) {
        return this.url + filePath;
    }

    /**
     * this function returns a json representing the contents of the requested folder
     * @param {string} [path=''] - The path to the directory to list, path should NOT start with a "/"
     * @param {boolean} recursive - Whether to list files recursively.
     * @param {number} [limit=1000] - The maximum number of files to list, some implementations
     *                               may ignore this.
     * @return {Promise} A promise that resolves to a json representing the contents of the requested folder
     */
    listFiles(path='',recursive,limit=1000){
        return new Promise((resolve, reject) => {
            const url = this.url + '/listFiles';
            const query = { path: path, recursive };

            const queryString = Object.entries(query)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            const toFetch = (url + '?' + queryString);
            fetch(toFetch)
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    }
}

export class S3DatasetAccess extends DatasetAccess{

    /**
     * Constructs a new instance of the DatasetAccess class.
     * @param {string} bucket - The name of the S3 bucket.
     * @param {string} prefix - The prefix to be used when accessing the dataset.
     */
    constructor(bucket,prefix){
        super();

        this.AWS = require('aws-sdk');

        this.AWS.config.credentials = {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy'
        };

        this.s3 = new this.AWS.S3({
            signatureVersion: null,
        });

        this.bucket = bucket;
        this.prefix = prefix;
    }

    /**
     * this function returns a link corresponding to the requested file
     * @param {string} filePath - the path to the requested file
     * @return {string} https address that contains requested file
     */
    getLink(filePath){
        return `https://${this.bucket}.s3.amazonaws.com/${filePath}`;
    }

    /**
     * this function returns a json representing the contents of the requested folder
     * @param {string} [path=''] - The path to the directory to list
     * @param {boolean} recursive - Whether to list files recursively.
     * @param {number} [limit=1000] - The maximum number of files to list, some implementations
     *                               may ignore this.
     * @return {Promise} A promise that resolves to a json representing the contents of the requested folder
     */
    listFiles(path = '', recursive, limit = 1000) {
        return new Promise((resolve, reject) => {
            let params = {
                Bucket: this.bucket,
                Prefix: this.prefix + path,
                MaxKeys: limit
            };
            if(!recursive){
                params.Delimiter = '/';
            }
            this.s3.makeUnauthenticatedRequest('listObjectsV2', params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

}