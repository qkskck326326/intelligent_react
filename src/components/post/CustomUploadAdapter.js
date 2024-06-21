import { axiosClient } from "../../axiosApi/axiosClient";

class CustomUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("upload", file);

          axiosClient
            .post(`/api/files/upload`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              const result = response.data;
              if (result.url) {
                resolve({
                  default: result.url,
                });
              } else {
                reject("Failed to upload file");
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
    );
  }

  abort() {
    // If the upload is aborted, reject the promise.
  }
}

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader);
  };
}

export default CustomUploadAdapterPlugin;
