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