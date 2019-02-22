# lambda-s3-mv

```
npm install lambda-s3-mv --save
```

## Introduction

This nodejs module will move S3 files to another S3 location.

## Description

The AWS S3 sdk doesn't come out with a built-in move files operation. This module will handle that for you using the available built-in operations, such copyObject (and deleteObjects if "createCopy" set to false).

This module can move single S3 file, or can move all the files in the specified S3 sourcePath parameter.

```nodejs
/*
 * This nodejs module will move files to another S3 location. It has also an option to just copy the files.
 * @param {options} - parameters, as follows
    {
        sourceBucket: 's3-source-bucket-name',
        sourcePath: 's3-source-prefix-path',
        sourceFiles: ['source-file1.txt', 'source-file2.txt'],
        targetBucket: 's3-target-bucket-name',
        targetPath: 's3-target-prefix-path',
        targetFiles: ['source-file1-moved.txt', 'source-file2-moved.txt'],
        createCopy: false
    }
 * @return {object} - a JSON object containing the details of the files that has been moved or copied.
    {
        s3Bucket: 's3-target-bucket-name',
        s3Objects: [
            '/s3-target-prefix-path/source-file1.txt', 
            '/s3-target-prefix-path/source-file2.txt'
        ]
    }
 */
```

| Options | Required    | Description |
| --------|---------|-------|
| sourceBucket  | **REQUIRED** | the bucket name containing the source files
| sourcePath | **REQUIRED** | the s3 prefix path containing the source files
| sourceFiles | OPTIONAL | If not specified, *by default it will include all files in the $sourcePath*
| targetBucket | OPTIONAL | If not specified, *by default the $sourceBucket will be used as the $targetBucket*
| targetPath | **REQUIRED** | the s3 prefix path to store the target files
| targetFiles | OPTIONAL | the modified name of the files after moved. This should match the number of files in $sourceFiles, else it will fallback to the name in $sourceFiles. If not specified, *by default it will use the name of the files in $sourceFiles*. 
| createCopy | OPTIONAL | If not specified, *by default it is set to* **false**

## Usage

1. Move **ALL files** in the specified S3 sourcePath into the same S3 bucket.

    ```nodejs
    const s3mv = require('lambda-s3-mv');

    const result = await s3mv.move({
        sourceBucket: 's3-source-bucket-name',
        sourcePath: 's3-source-prefix-path',
        targetPath: 's3-target-prefix-path'
    });
    console.log(result);
    ```

2. Move **ALL files** in the specified S3 sourcePath into different S3 bucket.

    ```nodejs
    const s3mv = require('lambda-s3-mv');

    const result = await s3mv.move({
        sourceBucket: 's3-source-bucket-name',
        sourcePath: 's3-source-prefix-path',
        targetBucket: 's3-target-bucket-name',
        targetPath: 's3-target-prefix-path'
    });
    console.log(result);
    ```

3. Move **specified list of files** in the specified S3 sourcePath into the same S3 bucket.

    ```nodejs
    const s3mv = require('lambda-s3-mv');

    const result = await s3mv.move({
        sourceBucket: 's3-source-bucket-name',
        sourcePath: 's3-source-prefix-path',
        sourceFiles: ['source-file1.txt', 'source-file2.txt'],
        targetPath: 's3-target-prefix-path'
    });
    console.log(result);
    ```

4. Move **specified list of files** in the specified S3 sourcePath into the same S3 bucket, and rename files after moved.

    ```nodejs
    const s3mv = require('lambda-s3-mv');

    const result = await s3mv.move({
        sourceBucket: 's3-source-bucket-name',
        sourcePath: 's3-source-prefix-path',
        sourceFiles: ['source-file1.txt', 'source-file2.txt'],
        targetPath: 's3-target-prefix-path',
        targetFiles: ['source-file1-moved.txt', 'source-file2-moved.txt']
    });
    console.log(result);
    ```

5. Copy **ALL files** in the specified S3 sourcePath into the same S3 bucket. "createCopy" set to **true**.

    ```nodejs
    const s3mv = require('lambda-s3-mv');

    const result = await s3mv.move({
        sourceBucket: 's3-source-bucket-name',
        sourcePath: 's3-source-prefix-path',
        sourceFiles: ['source-file1.txt', 'source-file2.txt'],
        targetPath: 's3-target-prefix-path',
        createCopy: true
    });
    console.log(result);
    ```

#### Important

Please make sure the lambda has read and write access to specifed source S3 Bucket.

Sample Lambda using the lambda-s3-mv, with Cloudformation, [can be found here](https://github.com/francismeynard/aws-journey/tree/master/sample-lambda-s3-helper-service).

## Test

```
npm run test
```
