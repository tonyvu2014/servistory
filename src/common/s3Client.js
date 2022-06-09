import S3 from 'react-aws-s3';

const config = {
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
    dirName: process.env.REACT_APP_S3_DIR_NAME, /* optional */
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_S3_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_USER_SECRET_ACCESS_KEY
}

const s3Client = new S3(config);

export { s3Client };
