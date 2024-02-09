import { S3 } from '@aws-sdk/client-s3';
const s3 = new S3();

const bucketName = "zmm-scraper"
const key = "programData.json"

import StorageClient from './StorageClient.mjs';

class S3StorageClient extends StorageClient {
    async upload(data) {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(data),
            ContentType: 'application/json'
        };

        try {
            const command = new PutObjectCommand(params);
            const result = await s3Client.send(command);
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
            const data = await s3.getObject(params);
            console.log("file downloaded successfully!")

            const bodyContents = await data.Body.transformToString('utf-8')

            return JSON.parse(bodyContents);
        } catch (error) {
            console.error('Error downloading file from S3:', error);
            throw error;
        }
    }
}

export default S3StorageClient;