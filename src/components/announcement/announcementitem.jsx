import React from 'react';
import '../styles/announcement.module.css';
import clsx from 'clsx'

export default function AnnouncementItem(props){

    const{title, createdAt, category, importance} = props.details
    
    
    const important = Number(importance)

    function checkImportance(){
        return important === 1;
    }

    // console.log(checkImportance)

    const classes = clsx({
        'announce-title': true,
        'important': checkImportance()
    })
    
return(                 
    <li className="announce-item">
        <div className="announce-category">{category}</div>
        <div className={classes}>{(important === 1) ? `[중요]` : '' } {title}</div>
        <div className="announce-date">{new Date(createdAt).toLocaleDateString()}</div> 
    </li>
);
}