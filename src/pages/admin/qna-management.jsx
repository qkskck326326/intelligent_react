import React from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminQuestionList from '../../components/qna/adminQuestionList';

const QnAManagement = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <AdminQuestionList />           
        </div>
    );
};

export default QnAManagement;
