import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Form } from 'react-bootstrap';
import styles from '../../styles/common/TestAI.module.css'; // CSS 모듈 임포트

const TestAI = () => {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("java");
    const [executionFeedback, setExecutionFeedback] = useState(null);
    const [fixedCode, setFixedCode] = useState("");
    const [fixedCodeFeedback, setFixedCodeFeedback] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5002/analyze', {
                code: code,
                language: language
            });
            const data = response.data.feedback;
            console.log('Response data:', data); // 백엔드에서 받은 데이터 확인
            setExecutionFeedback(data.execution_feedback || "No Execution Feedback");
            setFixedCode(data.fixed_code || "No Fixed Code");
            setFixedCodeFeedback(data.fixed_code_feedback || "No Fixed Code Feedback");
        } catch (error) {
            console.error("There was an error analyzing the code!", error);
            setExecutionFeedback("Error analyzing the code");
            setFixedCode("Error getting fixed code");
            setFixedCodeFeedback("Error getting fixed code feedback");
        }
    };

    return (
        <Container className={styles.container}>
            <h1>Simple Code Compiler</h1>
            <Form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <Form.Group controlId="formCode">
                    <Form.Label>Code:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={styles.textarea}
                    />
                </Form.Group>
                <Form.Group controlId="formLanguage">
                    <Form.Label>Language:</Form.Label>
                    <Form.Control
                        as="select"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={styles.select}
                    >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </Form.Control>
                </Form.Group>
                <Button type="submit" className={styles.button}>컴파일하기</Button>
            </Form>
            {executionFeedback && (
                <div className={styles.feedbackSection}>
                    <h3>컴파일 결과</h3>
                    <pre className={styles.feedbackPre}>{executionFeedback}</pre>
                </div>
            )}
            {fixedCode && (
                <div className={styles.fixedCodeSection}>
                    <h3>수정된 코드</h3>
                    <pre className={styles.fixedCodePre}>{fixedCode}</pre>
                </div>
            )}
            {fixedCodeFeedback && (
                <div className={styles.fixedFeedbackSection}>
                    <h3>수정된 코드 컴파일 결과</h3>
                    <pre className={styles.fixedFeedbackPre}>{fixedCodeFeedback}</pre>
                </div>
            )}
        </Container>
    );
};

export default TestAI;
