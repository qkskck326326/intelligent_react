import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LecturePackageRegister from '../../../components/lecturePackage/lecturePackageRegister';
import {axiosClient} from "../../../axiosApi/axiosClient";

const EditLecturePackage = () => {
    const router = useRouter();
    const { id, data } = router.query;
    const [packageData, setPackageData] = useState(data ? JSON.parse(data) : null);
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackageData = async () => {
            try {
                const response = await axiosClient.get(`/packages/detail`, { params: { lecturePackageId: id } });
                setPackageData(response.data);
            } catch (error) {
                setError(error);
                console.error('패키지 데이터를 가져오는 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!data && id) {
            fetchPackageData();
        }
    }, [id, data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <LecturePackageRegister isEditMode={true} packageData={packageData} />
        </div>
    );
};

export default EditLecturePackage;