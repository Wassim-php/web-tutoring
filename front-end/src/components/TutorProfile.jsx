import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TutorService from '../services/TutorService';
import '../App.css';

const BACKEND_URL = 'http://localhost:3000';

const TutorProfile = () => {
    // Profile data state management
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        bio: '',
        certifications: '',
        hourlyRate: '',
        joinedDate: '',
        profilePicture: '',
    });

    const [previewImage, setPreviewImage] = useState(null);

    // Fetches tutor profile data on component mount

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                console.log('Fetching profile for user:', user?.id);
                const data = await TutorService.getTutorById(user?.id);
                setProfileData(data);
                console.log('Profile data:', data);
                console.log('image id: ', data.profilePicture);
                
                if (data.profilePicture) {
                    setPreviewImage(`${BACKEND_URL}/uploads/images/${data.profilePicture}`);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        if (user?.id) {
            fetchProfileData();
        }
    }, [user]);
    //Handles form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };
    //Handles profile picture upload and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageString = file.name;
            setProfileData({
                ...profileData,
                profilePicture: imageString,
            });
            // Create temporary preview URL for new file
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    
    //Processes form submission and updates profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updateData = {
            bio: profileData.bio,
            hourlyRate: parseFloat(profileData.hourlyRate),
            profilePicture: profileData.profilePicture,
        };

        console.log('Sending update data:', updateData);

        try {
            const updatedTutor = await TutorService.updateTutorProfile(user.id, updateData);
            setProfileData(updatedTutor);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data
            });
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="tutor-profile-container">
            <h2>Tutor Profile</h2>
            <form onSubmit={handleSubmit}>
                {/* Profile Picture */}
                <div className="profile-picture-section">
                    <label htmlFor="profile-picture" className="profile-picture-label">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile Preview" className="profile-preview" />
                        ) : (
                            <div className="upload-placeholder">Upload Profile Picture</div>
                        )}
                    </label>
                    <input
                        type="file"
                        id="profile-picture"
                        name="profilePicture"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="profile-picture-input"
                    />
                </div>

                {/* Read-Only Fields */}
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        readOnly
                        className="read-only"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="certifications">Certifications</label>
                    <input
                        type="text"
                        id="certifications"
                        name="certifications"
                        value={profileData.certifications}
                        readOnly
                        className="read-only"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="joinedDate">Joined Date</label>
                    <input
                        type="text"
                        id="joinedDate"
                        name="joinedDate"
                        value={profileData.joinedDate}
                        readOnly
                        className="read-only"
                    />
                </div>

                {/* Editable Fields */}
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                    <input
                        type="number"
                        id="hourlyRate"
                        name="hourlyRate"
                        value={profileData.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default TutorProfile;