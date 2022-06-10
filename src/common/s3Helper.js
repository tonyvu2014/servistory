const getPublicUrl = (key) => {
    const region = process.env.REACT_APP_AWS_REGION;
    const dir = process.env.REACT_APP_S3_DIR_NAME;
    const bucket = process.env.REACT_APP_S3_BUCKET_NAME;

    return `https://${bucket}.s3.${region}.amazonaws.com/${dir}/${key}`;
}

export { getPublicUrl };