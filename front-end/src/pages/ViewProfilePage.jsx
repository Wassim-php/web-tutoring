import React from 'react';
import ViewProfile from '../components/ViewProfile';
import { useParams } from 'react-router-dom';

const ViewProfilePage = () => {
    const { tutorId } = useParams(); 
    return <ViewProfile id={tutorId} />;
};

export default ViewProfilePage;