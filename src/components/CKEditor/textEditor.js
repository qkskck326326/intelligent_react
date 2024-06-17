import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';

// CKEditor 컴포넌트를 동적으로 import
const CKEditorComponent = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), {
    ssr: false,
});

// Editor 빌드를 동적으로 import
const Editor = dynamic(() => import('/public/ckeditor5/build/ckeditor'), {
    ssr: false,
});

const TextEditor = ({ setEditorData, initialData }) => {
    const editorRef = useRef();

    useEffect(() => {
        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
            import('/public/ckeditor5/build/ckeditor').then(({ default: ClassicEditor }) => {
                ClassicEditor
                    .create(document.querySelector('.editor'))
                    .then(editor => {
                        window.editor = editor;
                        editorRef.current = editor;

                        // 초기 데이터를 설정합니다.
                        if (initialData) {
                            editor.setData(initialData);
                        }

                        editor.model.document.on('change:data', () => {
                            setEditorData(editor.getData());
                        });
                    })
                    .catch(error => {
                        console.error('Oops, something went wrong!', error);
                    });
            });
        }
    }, [setEditorData, initialData]);

    return (
        <div className="editor">
            <p> 이곳에 내용을 작성해 주세요!</p>
        </div>
    );
};

export default TextEditor;