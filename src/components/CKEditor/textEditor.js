import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';

const CKEditorComponent = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), {
    ssr: false,
});

const TextEditor = ({ setEditorData, initialData }) => {
    const editorRef = useRef();
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('/public/ckeditor5/build/ckeditor').then(({ default: ClassicEditor }) => {
                if (!editorRef.current && containerRef.current) {
                    ClassicEditor
                        .create(containerRef.current, {
                            ckfinder: {
                                uploadUrl: '/api/upload' // 업로드 엔드포인트 설정
                            }
                        })
                        .then(editor => {
                            editorRef.current = editor;
                            window.editor = editor;

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
                }
            });
        }
    }, [initialData, setEditorData]);

    return (
        <div ref={containerRef} className="editor">
            <p>이곳에 내용을 작성해 주세요!</p>
        </div>
    );
};

export default TextEditor;