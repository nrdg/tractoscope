const AWS = require('aws-sdk');

AWS.config.credentials = {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
};

const s3 = new AWS.S3({
    signatureVersion: null,
});

//expects params{Bucket, Prefix, MaxKeys (optional)}
//returns a promise that resolves to an array of objects
//will only return up to 1000 objects
export async function listObjects(params) {
    return new Promise((resolve, reject) => {
        s3.makeUnauthenticatedRequest('listObjectsV2', params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


//returns all objects with common prefix in params, up to the object limit
export async function listCommonPrefixes(params,limit) {
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
