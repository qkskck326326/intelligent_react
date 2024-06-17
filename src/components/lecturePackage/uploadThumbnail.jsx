import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_CHAERIM,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_CHAERIM,
    region: process.env.NEXT_PUBLIC_AWS_REGION_CHAERIM
});

export const UploadThumbnail = async (file) => {
    const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_CHAERIM,
        Key: `thumbnails/${Date.now()}-${file.name}`,
        Body: file,
        ContentType: file.type,

    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // 업로드된 파일의 URL
    } catch (error) {
        console.error('파일 업로드 중 오류 발생:', error);
        throw new Error('파일 업로드 실패');
    }
};

export default s3;