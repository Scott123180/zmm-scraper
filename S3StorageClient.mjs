import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({});

const bucketName = "zmm-scraper"
const key = "programData.json"

import StorageClient from './StorageClient.mjs';

class S3StorageClient extends StorageClient {
    async upload(data) {

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(data),
            ContentType: 'application/json'
        });

        try {
            const result = await s3.send(command);
            console.log('Upload Success', result);
            return result;
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        }
    }

    async download() {

        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key
            });

            const data = await s3.send(command);
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