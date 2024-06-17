import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_CHAERIM,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_CHAERIM,
    region: process.env.NEXT_PUBLIC_AWS_REGION_CHAERIM
});

export default s3;