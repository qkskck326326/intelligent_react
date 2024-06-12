import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import styles from '../../styles/common/TestAI.module.css'; // CSS 모듈 임포트

const TestAI = () => {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("java");
    const [executionFeedback, setExecutionFeedback] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/analyze', {
                code: code,
                language: language
            });
            setExecutionFeedback(response.data.feedback.execution_feedback || "No Execution Feedback");
        } catch (error) {
            console.error("There was an error analyzing the code!", error);
            setExecutionFeedback("Error analyzing the code");
        }
    };

    return (
        <Container className={styles.container}>
            <h1>Simple Code Compiler</h1>
            <Form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div className={styles.row}>
                    <div className={styles.column}>
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
                    </div>
                    <div className={styles.column}>
                        {executionFeedback && (
                            <div>
                                <h3>컴파일 결과</h3>
                                <pre className={styles.feedbackPre}>{executionFeedback}</pre>
                            </div>
                        )}
                    </div>
                </div>
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
        </Container>
    );
};

export default TestAI;
