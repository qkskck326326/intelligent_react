import React, {useState, useEffect} from 'react'
import styles from '../../styles/announcementwrite.module.css'

export default function AnnouncementWrite(props){

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(9)
    const [content, setContent] = useState('')
    const [importance, setImportance] = useState(0)


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

    function handleAnnouncementSubmit(event){

        event.preventDefault();

        if(title.trim() === ''){
            window.alert(`제목을 입력해주세요`)
            console.log(importance)
            return false;
        }
        if(Number(category) === 9) {
            window.alert(`카테고리를 설정해주세요`)
            console.log(importance)
            return false;
        }
        if(content.trim() === ''){
            window.alert(`내용을 입력해주세요`)
            console.log(importance)
            return false;
        }

        fetch(`http://localhost:8080/announcement`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                title,
                content,
                createdAt: new Date(),
                creator: '관리자',
                category,
                importance
            })
        }).then(response => {
            console.log(response)
            if(!response.ok){
                throw new Error('error')
            }
            return response.json()
        }).then(data => {
            window.location.href = '/cs'
        })

    }

    return(
        <div className={styles.announceWriteContainer}>
            <form action="" onSubmit={handleAnnouncementSubmit}>
                <div className={styles.announceWriteHeader}>
                    <p>공지사항 작성</p>
                </div>
                <div className={styles.announceWriteMid}>
                    <input type="text" name="announceWriteTitle" id="announceWriteTitle" className={styles.announceWriteTitle} placeholder="제 목" onChange={handelTitle} />
                        <select name="announceWriteCategory" id="announceWriteCategory" className={styles.announceWriteCategory} onChange={handleCategory}>
                            <option value='9'>카테고리 설정</option>
                            <option value="0">서비스</option>
                            <option value="1">업데이트</option>
                            <option value="2">이벤트</option>
                        </select>
                </div>
                <div className={styles.announceWriteMain}>
                    <textarea name="" placeholder="내 용 작 성 란" className={styles.announceWriteContent} onChange={handleContent}></textarea>
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