import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";

const BoardList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient.get('/itNewsBoard')
            .then(response => {
                const responseData = response.data;
                const dataArray = Array.isArray(responseData) ? responseData : [responseData];
                setData(dataArray);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container">
            <h1>Board List</h1>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Original Context</th>
                    <th scope="col">Link</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.boardId}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.title}</td>
                        <td>{item.originalContext}</td>
                        <td>
                            <a href={item.siteUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                Visit Site
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default BoardList;
