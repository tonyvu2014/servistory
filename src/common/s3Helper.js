import S3 from 'react-aws-s3';
import AWS from 'aws-sdk';

const config = {
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
    dirName: process.env.REACT_APP_S3_DIR_NAME, /* optional */
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_S3_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_USER_SECRET_ACCESS_KEY
}

const s3Client = new S3(config);

const getPublicUrl = (key) => {
    const region = process.env.REACT_APP_AWS_REGION;
    const dir = process.env.REACT_APP_S3_DIR_NAME;
    const bucket = process.env.REACT_APP_S3_BUCKET_NAME;

    return `https://${bucket}.s3.${region}.amazonaws.com/${dir}/${key}`;
}

AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_S3_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_USER_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

export { s3Client, s3, getPublicUrl };