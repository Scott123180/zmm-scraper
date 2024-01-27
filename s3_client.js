const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucketName = "zmm-scraper"
const key = "programData.json"


/**
 * Uploads data to an S3 bucket.
 * @param {object} data - The data object to upload.
 */
async function uploadDataToS3(data) {
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

/**
 * Downloads a file from an S3 bucket.
 */
async function downloadFileFromS3() {
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

module.exports = { uploadDataToS3, downloadFileFromS3 };