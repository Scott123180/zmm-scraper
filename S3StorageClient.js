const AWS = require('@aws-sdk/client-s3');
const s3 = new AWS.S3();

const bucketName = "zmm-scraper"
const key = "programData.json"

const StorageClient = require('./StorageClient');

class S3StorageClient extends StorageClient {
    async upload() {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(data),
            ContentType: 'application/json'
        };

        try {
            const result = await s3.upload(params).promise();
            console.log('Upload Success', result);
            return result;
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        }
    }

    async download() {
        const params = {
            Bucket: bucketName,
            Key: key
        };

        try {
            const data = await s3.getObject(params).promise();
            console.log("file downloaded successfully!")

            return data;
        } catch (error) {
            console.error('Error downloading file from S3:', error);
            throw error;
        }
    }
}

module.exports = S3StorageClient;