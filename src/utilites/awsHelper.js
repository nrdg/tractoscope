//returns https link to object at key
export function getUrl(params){
    return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

}
//expects params{Bucket, Key}
//returns https link to object at key
export async function getSignedUrl(params) {

    return new Promise((resolve, reject) => {
        const url = `https://${params.Bucket}.s3.amazonaws.com/{params.Key}`;
        resolve(url);
    });
}

//expects params{Bucket, Prefix, MaxKeys (optional)}
//returns a promise that resolves to an array of objects
//will only return up to 1000 objects
export function listObjects(params) {
    return new Promise((resolve, reject) => {
        fetchObjectsV2(params)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
}


//returns all objects with common prefix in params, up to the object limit
export async function listCommonPrefixes(params,limit) {
    return new Promise((resolve, reject) => {
        let allPrefixes = [];

        function listNextSetOfPrefixes(token = null) {
            if (token) {
                params.ContinuationToken = token;
            }
            fetchObjectsV2(params)
                .then(data => {
                    if (data.CommonPrefixes) {
                        allPrefixes = allPrefixes.concat(data.CommonPrefixes);
                    }
                    if(allPrefixes > limit ){
                        resolve(allPrefixes)
                    }
                    if (data.IsTruncated == true) {
                        listNextSetOfPrefixes(data.NextContinuationToken);
                    } else {
                        resolve(allPrefixes);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        }
        listNextSetOfPrefixes();
    });
}
/**
 * Fetches objects from an S3 bucket using version 2 of the list objects
 * @async
 * @param {Object} params - An object containing the parameters for the request.
 * @returns {Document} The XML document containing the list of objects.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
async function fetchObjectsV2(params){
    let query = {}
    if(params.Prefix){
        query.prefix = params.Prefix
    }
    if(params.Delimiter){
        query.delimiter = params.Delimiter
    }
    if(params.ContinuationToken){
        query['continuation-token'] = params.ContinuationToken
    }
    // if(params.ContinuationToken){
    //     query['continuation-token'] = params.ContinuationToken
    // }else{
    //     query['continuation-token'] = '1SMGuYwSAoGBZM53Q40LLNhy8kTr1mxgzF%2Bnuxb1y9w2gKaRlKi1pKvP2dq9FtBVIw4HYAPL2VLhwFnIkqMjMo0vIEnJa3owG69NVwi8wON63U2n2Ln06cA%3D%3D'
    // }

    const url = `https://${params.Bucket}.s3.amazonaws.com/?list-type=2&`;

    const queryString = Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const toFetch = (url + queryString);

    let response = await fetch(toFetch);
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.text();


    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(data,"text/xml");
    let output = { Contents:[]}

    output.Contents = Array.from(xmlDoc.getElementsByTagName('Contents')).map(el => ({Key: el.getElementsByTagName('Key')[0].textContent}));
    output.CommonPrefixes = Array.from(xmlDoc.getElementsByTagName('CommonPrefixes')).map(el => el.textContent);
    output.IsTruncated = xmlDoc.getElementsByTagName('IsTruncated')[0].textContent;
    output.Prefix = xmlDoc.getElementsByTagName('Prefix')[0].textContent;
    if(output.IsTruncated == 'true'){
        output.IsTruncated == true;
        output.NextContinuationToken = xmlDoc.getElementsByTagName('NextContinuationToken')[0].textContent;
    }
    return output
}
