import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const TestPage = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        axios.get('/api/users/registration-stats')
            .then(response => {
                const data = response.data;
                const dates = data.map(item => item.date);
                const counts = data.map(item => item.count);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'User Registrations',
                            data: counts,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('Error fetching the registration stats', error);
            });
    }, []);

    return (
        <div>
            <h2>Test Page</h2>
            <Line data={chartData} />
        </div>
    );
};

export default TestPage;
