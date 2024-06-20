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
                image: {
                    styles: ['alignLeft', 'alignCenter', 'alignRight'],
                    resizeOptions: [
                        {
                            name: 'resizeImage:original',
                            value: null,
                            icon: 'original'
                        },
                        {
                            name: 'resizeImage:50',
                            value: '50',
                            icon: 'medium'
                        },
                        {
                            name: 'resizeImage:75',
                            value: '75',
                            icon: 'large'
                        }
                    ],
                    toolbar: [
                        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                        '|',
                        'resizeImage',
                        '|',
                        'imageTextAlternative'
                    ]
                }
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CKEditorComponent;