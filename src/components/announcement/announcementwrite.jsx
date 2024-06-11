import React, {useState, useEffect} from 'react'
import styles from '../../styles/announcementwrite.module.css'
import {useRouter} from "next/router";
import AnnouncementAxios from "../../axiosApi/announcementAxios";

export default function AnnouncementWrite(props){

    const router = useRouter();
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(9)
    const [content, setContent] = useState('')
    const [importance, setImportance] = useState(0)
    const axios = new AnnouncementAxios();
    const [announcementId, setAnnouncementId] = useState(0)

    useEffect(() => {

        if(router.isReady){
            const {givenCategory, givenId, givenContent, givenTitle } = router.query

            setAnnouncementId(givenId);
            setCategory(givenCategory);
            setTitle(givenTitle);
            setContent(givenContent);
            console.log(announcementId)
        }

        console.log(announcementId)

    }, [])


    function toggleImportance(){

        if(Number(importance) === 0){
            setImportance(1)
        }else {
            setImportance(0)
        }
    }

    function handelTitle(event){
        setTitle(event.target.value);
    }

    function handleCategory(event){
        setCategory(event.target.value);
    }

    function handleContent(event){
        setContent(event.target.value);
    }

    function postSubmit(){

        axios.post('/announcement',
            {
                    title,
                    content,
                    createdAt: new Date(),
                    creator: '관리자',
                    category,
                    importance
        }).then(data => {
            console.log(data)
            window.location.href = '/cs'
        })
    }

    function putSubmit(){

        axios.put('/announcement', {
            announcementId,
            title,
            content,
            createdAt: new Date(),
            creator: '관리자',
            category,
            importance
        }).then(data => {
                console.log(data)
                window.location.href = '/cs'
            })
    }

    function handleAnnouncementSubmit(event){

        event.preventDefault();

        if(title.trim() === ''){
            console.log('제목에러 실행')
            window.alert('제목을 입력해주세요')
            return;
        }
        if(Number(category) === 9) {
            console.log('카테고리에러 실행')
            window.alert(`카테고리를 설정해주세요`)
            return;
        }
        if(content.trim() === ''){
            console.log('내용에러 실행')
            window.alert(`내용을 입력해주세요`)
            return;
        }

        if(announcementId){
            console.log(announcementId)
            console.log('풋요청')
            putSubmit()
        }else{
            console.log(announcementId)
            console.log('포스트요청')
            postSubmit()
        }


    }



    return(
        <div className={styles.announceWriteContainer}>
            <form action="" onSubmit={handleAnnouncementSubmit}>
                <div className={styles.announceWriteHeader}>
                    <p>공지사항 작성</p>
                </div>
                <div className={styles.announceWriteMid}>
                    <input type="text" name="announceWriteTitle" id="announceWriteTitle" className={styles.announceWriteTitle} value={title} placeholder="제 목" onChange={handelTitle} />
                        <select name="announceWriteCategory" id="announceWriteCategory" value={category} className={styles.announceWriteCategory} onChange={handleCategory}>
                            <option value='9'>카테고리 설정</option>
                            <option value="0">서비스</option>
                            <option value="1">업데이트</option>
                            <option value="2">이벤트</option>
                        </select>
                </div>
                <div className={styles.announceWriteMain}>
                    <textarea name="" placeholder="내 용 작 성 란" className={styles.announceWriteContent} value={content} onChange={handleContent}></textarea>
                </div>
                <div className={styles.announceWriteBottom}>
                    <label>
                        <input type='checkbox' name='importance' onChange={toggleImportance}/>
                        중요
                    </label>
                    <button type='submit' className={styles.announceConfirm}>
                        게시
                    </button>
                </div>
            </form>
        </div>
    );
}