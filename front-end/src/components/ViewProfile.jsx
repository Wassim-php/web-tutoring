//Features:
 //* - Profile image display with fallback
 //* - Personal information display
 //* - Professional credentials
 //* - Loading states
 //* - Error handling
 //* - Responsive layout
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container } from 'react-bootstrap';
import UserService from '../services/UserService';
import TutorService from '../services/TutorService';
const ViewProfile = ({id}) => {
    const [user, setUser] = useState(null);
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserTutor = async () => {
            try {
                setLoading(true);
                const [userResponse, tutorResponse] = await Promise.all([
                    UserService.getUserById(id),
                    TutorService.getTutorById(id)
                ]);
                
                setUser(userResponse.data);
                setTutor(tutorResponse);
                console.log('Tutor data:', tutorResponse); // Debug log
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserTutor();
        }
    }, [id]);

    // Debug log when tutor state changes
    useEffect(() => {
        if (tutor) {
            console.log('Tutor Profile Picture:', tutor.profilePicture);
        }
    }, [tutor]);

    const getImageUrl = (filename) => {
        if (!filename) {
            console.log('No filename provided, using default avatar');
            return '/default-avatar.png';
        }

        // Clean the filename and construct URL
        const cleanFilename = filename.trim().replace(/\\/g, '/');
        const url = `http://localhost:3000/uploads/images/${cleanFilename}`;
        
        // Debug log
        console.log({
            originalFilename: filename,
            cleanedFilename: cleanFilename,
            constructedUrl: url
        });
        
        return url;
    };

    const renderProfileImage = () => {
        if (!tutor?.profilePicture) {
            return (
                <div className="default-profile-image">
                    {user?.name?.charAt(0) || '?'}
                </div>
            );
        }

        return (
            <img
                src={getImageUrl(tutor.profilePicture)}
                alt={`${user?.name}'s profile`}
                className="profile-image"
                onError={(e) => {
                    console.error('Image load error:', {
                        originalSrc: e.target.src,
                        profilePicture: tutor.profilePicture
                    });
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                }}
            />
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user || !tutor) return <div>Profile not found</div>;

    return (
        <Container className="mt-4">
            <Card className="profile-card">
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center">
                            <div className="profile-image-container mb-3">
                                {renderProfileImage()}
                            </div>
                        </Col>
                        <Col md={8}>
                            <Card.Title className="mb-4">
                                <h2>{user?.name}'s Profile</h2>
                            </Card.Title>
                            <div className="profile-info">
                                <div className="info-group">
                                    <label>Email:</label>
                                    <p>{user?.email}</p>
                                </div>
                                <div className="info-group">
                                    <label>Bio:</label>
                                    <p>{tutor?.bio || 'No bio provided'}</p>
                                </div>
                                <div className="info-group">
                                    <label>Hourly Rate:</label>
                                    <p>${tutor?.hourlyRate}/hour</p>
                                </div>
                                <div className="info-group">
                                    <label>Certifications:</label>
                                    <p>{tutor?.certifications || 'No certifications listed'}</p>
                                </div>
                                <div className="info-group">
                                    <label>Topics:</label>
                                    <p>
                                        {tutor?.topics?.map(topic => topic.name).join(', ') || 'No topics listed'}
                                    </p>
                                </div>
                                <div className="info-group">
                                    <label>Member Since:</label>
                                    <p>{tutor?.joinedDate ? new Date(tutor.joinedDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ViewProfile;