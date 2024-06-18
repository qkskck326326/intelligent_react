import AWS from 'aws-sdk';

export default function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CustomUploadAdapter(loader);
    };
}

class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader;

        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_CHAERIM,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_CHAERIM,
            region: process.env.NEXT_PUBLIC_AWS_REGION_CHAERIM,
        });

        this.s3 = new AWS.S3({
            params: { Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_CHAERIM },
        });
    }

    upload() {
        return this.loader.file.then((file) => {
            return new Promise((resolve, reject) => {
                this._uploadFile(file)
                    .then((response) => resolve({ default: response.Location }))
                    .catch((error) => reject(error));
            });
        });
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _uploadFile(file) {
        const params = {
            Key: `packageImage/${file.name}`,
            Body: file,
            ContentType: file.type

        };

        return new Promise((resolve, reject) => {
            this.s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}