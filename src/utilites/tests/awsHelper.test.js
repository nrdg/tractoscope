const awsHelper = require('../awsHelper');

describe('awsHelper', () => {
    describe('getUrl', () => {
        it('should return an s3 url', () => {
            const params = {
                Bucket: 'testBucket',
                Key: 'testKey'
            };
            const url = awsHelper.getUrl(params);
            expect(url).toEqual('https://testBucket.s3.amazonaws.com/testKey');
        });
        it('should return a normal url if bucket contains localhost', () => {
            const params = {
                Bucket: 'http://localhost:3000',
                Key: 'testKey'
            };
            const url = awsHelper.getUrl(params);
            expect(url).toEqual('http://localhost:3000/testKey');
        });
    });
});
