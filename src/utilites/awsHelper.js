const AWS = require('aws-sdk');

AWS.config.credentials = {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
};

const s3 = new AWS.S3({
    signatureVersion: null,
});

//returns https link to object at key
export function getUrl(params){
    console.log(params)
    if (params.Bucket){
        if (params.Bucket.includes('localhost')) {
            return params.Bucket + '/' + params.Key;
        }else{
            return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        }
    }else{
        throw new Error("params does not contain Bucket");
    }

}

//expects params{Bucket, Prefix, MaxKeys (optional)}
//returns a promise that resolves to an array of objects
//will only return up to 1000 objects
export async function listObjects(params) {
    if (params.Bucket && params.Bucket.includes('localhost')) {
        return new Promise((resolve, reject) => {
            const url = params.Bucket + '/listFiles';
            const query = { Path: params.Prefix, Recursive: true };

            const queryString = Object.entries(query)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            fetch(`${url}?${queryString}`)
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    }else{
        return new Promise((resolve, reject) => {
            s3.makeUnauthenticatedRequest('listObjectsV2', params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    console.log(data)
                    resolve(data);
                }
            });
        });
    }
}


//returns all objects with common prefix in params, up to the object limit
export async function listCommonPrefixes(params,limit) {
    if(params.Bucket && params.Bucket.includes("localhost")){
        return new Promise((resolve, reject) => {
            const url = params.Bucket + '/listFiles';
            const query = { path: params.Key, recursive: true };

            const queryString = Object.entries(query)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            fetch(`${url}?${queryString}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    resolve(data);
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    }else{
        return new Promise((resolve, reject) => {
            let allPrefixes = [];

            function listNextSetOfPrefixes(token) {
                if (token) {
                    params.ContinuationToken = token;
                }

                s3.makeUnauthenticatedRequest('listObjectsV2', params, function(err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (data.CommonPrefixes) {
                        allPrefixes = allPrefixes.concat(data.CommonPrefixes.map(prefix => prefix.Prefix));
                    }

                    if (data.IsTruncated) {
                        listNextSetOfPrefixes(data.NextContinuationToken);
                    } else {
                        resolve(allPrefixes);
                    }
                });
            }
            if(allPrefixes > limit){
                resolve(allPrefixes)
            }
            listNextSetOfPrefixes();
        });
    }
}
