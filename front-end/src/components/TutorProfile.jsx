import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { fetchTutorProfile, updateTutorProfile, clearTutorProfile, setProfile } from '../features/tutor/tutorSlice';
import { selectTutorProfile, selectTutorStatus, selectTutorError } from '../features/tutor/tutorSelectors';
import '../App.css';

const BACKEND_URL = 'http://localhost:3000';

const TutorProfile = () => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const [previewImage, setPreviewImage] = useState(null);
    const profile = useAppSelector(selectTutorProfile);
    const status = useAppSelector(selectTutorStatus);
    const error = useAppSelector(selectTutorError);
    const [formData, setFormData] = useState({
        bio: '',
        hourlyRate: 0,
        profilePicture: ''
    });

    // Combined profile initialization effect
    useEffect(() => {
        const initializeProfile = async () => {
            if (!user?.id) return;

            try {
                // First try to get from localStorage with proper null check
                const savedProfile = localStorage.getItem('tutorProfile');
                if (savedProfile && savedProfile !== 'undefined') {
                    try {
                        const parsedProfile = JSON.parse(savedProfile);
                        if (parsedProfile && typeof parsedProfile === 'object') {
                            dispatch(setProfile(parsedProfile));
                        }
                    } catch (error) {
                        console.error('Error parsing saved profile:', error);
                        localStorage.removeItem('tutorProfile'); // Clean up invalid data
                    }
                }

                // Then fetch fresh data from server
                const result = await dispatch(fetchTutorProfile(user.id)).unwrap();
                console.log('Fresh profile data:', result);
                
                // Update localStorage only if we have valid data
                if (result && typeof result === 'object') {
                    localStorage.setItem('tutorProfile', JSON.stringify(result));
                }
            } catch (error) {
                console.error('Profile initialization error:', error);
            }
        };

        initializeProfile();

        // Cleanup on unmount
        return () => {
            setFormData({
                bio: '',
                hourlyRate: 0,
                profilePicture: ''
            });
            setPreviewImage(null);
        };
    }, [dispatch, user?.id]);

    // Update form data when profile changes
    useEffect(() => {
        if (profile) {
            console.log('Setting form data from profile:', profile);
            setFormData({
                bio: profile.bio || '',
                hourlyRate: parseFloat(profile.hourlyRate) || 0,
                profilePicture: profile.profilePicture || ''
            });
        }
    }, [profile]);

    // Update preview image when profile changes
    useEffect(() => {
        if (profile?.profilePicture) {
            const imageUrl = `${BACKEND_URL}/uploads/images/${profile.profilePicture}`;
            console.log('Setting preview image:', imageUrl);
            setPreviewImage(imageUrl);
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'hourlyRate' ? Number(value) : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageString = file.name;
            setFormData(prev => ({
                ...prev,
                profilePicture: imageString
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.hourlyRate || isNaN(formData.hourlyRate) || formData.hourlyRate <= 0) {
            alert('Please enter a valid hourly rate greater than 0');
            return;
        }

        try {
            const updatedProfile = {
                ...profile,
                bio: formData.bio.trim(),
                hourlyRate: Number(formData.hourlyRate),
                profilePicture: formData.profilePicture
            };

            const result = await dispatch(updateTutorProfile({ 
                id: user.id, 
                updateData: updatedProfile
            })).unwrap();
            
            // Update both localStorage and Redux state
            localStorage.setItem('tutorProfile', JSON.stringify(result));
            dispatch(setProfile(result));
            
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Update failed:', err);
            alert(err.message || 'Failed to update profile. Please try again.');
        }
    };

    if (!user) {
        return <div>Please log in to view your profile</div>;
    }

    if (status === 'loading') {
        return <div>Loading profile...</div>;
    }

    if (status === 'failed') {
        return (
            <div className="error-message">
                <p>{error || 'Failed to load profile'}</p>
                <button onClick={() => dispatch(fetchTutorProfile(user.id))}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="no-profile">
                <p>No profile data found. This could mean:</p>
                <ul>
                    <li>You haven't created a tutor profile yet</li>
                    <li>There was an error loading your profile</li>
                </ul>
                <button onClick={() => dispatch(fetchTutorProfile(user.id))}>
                    Refresh Profile
                </button>
            </div>
        );
    }

    return (
        <div className="tutor-profile-container">
            <h2>Tutor Profile</h2>
            <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
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
                        value={profile.certifications}
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
                        value={profile.joinedDate}
                        readOnly
                        className="read-only"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
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
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
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