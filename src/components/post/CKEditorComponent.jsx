// src/components/CKEditorComponent.jsx
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploadAdapterPlugin from "./CustomUploadAdapter";

const CKEditorComponent = ({ data, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={{
        extraPlugins: [CustomUploadAdapterPlugin],
        mediaEmbed: {
          previewsInData: true,
          providers: [
            {
              name: "youtube",
              url: [
                /^youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
                /^youtu\.be\/([a-zA-Z0-9_-]+)/,
                /^youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
              ],
              html: (match) => {
                const id = match[1];
                return match[0].includes("/shorts/")
                  ? '<div style="position: relative; width: 100%; max-width: 450px; padding-bottom: 70.78%; height: 0;">' +
                      `<iframe src="https://www.youtube.com/embed/${id}" ` +
                      'style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" ' +
                      'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                      "</iframe>" +
                      "</div>"
                  : '<div style="position: relative; padding-bottom: 56.25%; height: 0;">' +
                      `<iframe src="https://www.youtube.com/embed/${id}" ` +
                      'style="position: absolute; width: 100%; height: 100%; left: 0;" ' +
                      'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                      "</iframe>" +
                      "</div>";
              },
            },
          ],
        },
        image: {
          toolbar: [
            "imageTextAlternative",
            "|",
            "imageStyle:alignLeft",
            "imageStyle:alignRight",
            "imageStyle:alignCenter",
            "|",
            "resizeImage:original",
            "resizeImage:50",
            "resizeImage:75",
            "resizeImage:100",
          ],
          styles: ["full", "side", "alignLeft", "alignCenter", "alignRight"],
          resizeOptions: [
            {
              name: "resizeImage:original",
              label: "Original",
              value: null,
            },
            {
              name: "resizeImage:50",
              label: "50%",
              value: "50",
            },
            {
              name: "resizeImage:75",
              label: "75%",
              value: "75",
            },
            {
              name: "resizeImage:100",
              label: "100%",
              value: "100",
            },
          ],
          upload: {
            types: ["jpg", "jpeg", "png", "gif"],
          },
        },
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
          "|",
          "imageUpload",
          "mediaEmbed",
          "insertTable",
          "undo",
          "redo",
          "|",
        ],
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default CKEditorComponent;
