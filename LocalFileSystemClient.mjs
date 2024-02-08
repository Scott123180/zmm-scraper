import fs from 'fs/promises';

import StorageClient from './StorageClient.mjs';

const sourcePath = './resources/testInput.json';

class LocalFileSystemClient extends StorageClient {

    async upload(data) {
        console.log(data)
    }

    async download() {
        try {
            const data = await fs.readFile(sourcePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error);
            throw error;
        }
    }
}

module.exports = LocalFileSystemClient;
