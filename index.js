'use strict';

const aws = require('aws-sdk');

const s3 = new aws.S3();

/*
 * This nodejs module will move files to another S3 location. It has also an option to just copy the files.
 * @param {options} - parameters, as follows
    {
        sourceBucket: 's3-source-bucket-name',
        sourcePath: 's3-source-prefix-path',
        sourceFiles: ['source-file1.txt', 'source-file2.txt'],
        targetBucket: 's3-target-bucket-name',
        targetPath: 's3-target-prefix-path',
        createCopy: false
    }
 * @return {object} - a JSON object containing the details of the files that has been moved or copied.
    {
        s3Bucket: 's3-target-bucket-name',
        s3Objects: ['/s3-target-prefix-path/source-file1.txt', '/s3-target-prefix-path/source-file2.txt']
    }
 */
module.exports.move = (options) => new Promise(async (resolve, reject) => {
    try {
        const sourceBucket = checkRequiredParameter(options, "sourceBucket");
        const sourcePath = checkRequiredParameter(options, "sourcePath");

        const targetBucket = options.targetBucket || options.sourceBucket; // if targetBucket is empty, use sourceBucket!
        const targetPath = checkRequiredParameter(options, "targetPath");

        const createCopy = options.createCopy || false;

        let sourceFiles = options.sourceFiles || [];

        if (sourceFiles && sourceFiles.length > 0) {
            sourceFiles = sourceFiles.map(file => `${sourcePath}/${file}`);
        } else {
            let s3Objects = (await s3.listObjects({ Bucket: sourceBucket, Prefix: sourcePath }).promise());
            sourceFiles = s3Objects.Contents.map(content => { return content.Key; }).filter(key => key != `${sourcePath}/`);

            console.log(`Moving all ${sourceFiles.length} files found in sourcePath: ${sourcePath}...`);
        }

        const movedFilesLocation = [];

        for (let sourceFile of sourceFiles) {
            try {
                let targetFilePath = `${targetPath}/${sourceFile.substring(sourceFile.lastIndexOf("/") + 1)}`;
                await s3.copyObject({ CopySource: `${sourceBucket}/${sourceFile}`, Bucket: targetBucket, Key: targetFilePath }).promise();
                movedFilesLocation.push(targetFilePath);
            } catch (error) {
                console.log(`Error moving ${sourceFile}: ${error}`);
            }
        }

        if (!createCopy) {
            console.log(`Deleting files in sourcePath: ${sourcePath}...`);
            await s3.deleteObjects({ Bucket: sourceBucket, Delete: { Objects: sourceFiles.map(file => { return { Key: file } }) } }).promise();
        }

        resolve({
            s3Bucket: targetBucket,
            s3Objects: movedFilesLocation
        });

    } catch (error) {
        reject(error);
    }
});

const checkRequiredParameter = (options, paramName) => {
    if (!options[paramName]) {
        throw new Error(`${paramName} parameter is required.`);
    }
    return options[paramName];
};