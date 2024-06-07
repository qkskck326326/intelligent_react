import React, {useState, useEffect} from "react";
import {axiosClient} from "../../axiosApi/axiosClient";

const BoardList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient.get('/itNewsBoard')
            .then(response => {
                setData(response.data);
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
            {data.map((item) => (
                <div key={item.boardId} className="card mb-2">
                    <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text">{item.originalContext}</p>
                        <a href={item.siteUrl} className="btn btn-primary">Visit Site</a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BoardList;