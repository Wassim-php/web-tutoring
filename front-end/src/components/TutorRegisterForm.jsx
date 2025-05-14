import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TutorService from '../services/TutorService';
import '../App.css';

const TutorRegisterForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id;

    // Form state initialization with empty defaults
    const [formData, setFormData] = useState({
        bio: '',
        hourlyRate: '',
        certifications: '',
        joinedDate: new Date().toISOString(),
        profilePicture: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);

    // Validates form fields before submission
    const validateForm = () => {
        const errors = {};
        if (!formData.bio.trim()) {
            errors.bio = 'Bio is required';
        }

        if (!formData.hourlyRate) {
            errors.hourlyRate = 'Hourly Rate is required';
        } else if (isNaN(formData.hourlyRate) || formData.hourlyRate <= 0) {
            errors.hourlyRate = 'Please enter a valid hourly rate';
        }

        if (!formData.certifications) {
            errors.certifications = 'Certifications are required';
            setIsError(true);
        }

        return errors;
    };

    // Handles form input changes and clears related error messages
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

        //Processes form submission and creates tutor profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const tutorData = {
                ...formData,
                id: userId,
                hourlyRate: parseFloat(formData.hourlyRate),
                certifications: formData.certifications,
                profilePicture: formData.profilePicture || 'default.png',
            };

            // Log the form data before submission
            console.log('Submitting tutor data:', tutorData);
            
            const response = await TutorService.createTutor(tutorData);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', {
                message: error.message,
                status: error.status,
                details: error.details
            });
            
            setFormErrors({
                submit: error.message || 'Failed to create tutor profile'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className='text-white'>Complete Your Tutor Profile</h2>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalBio">
                    <Form.Label column sm={3} className="form-label text-white">
                        Bio:
                    </Form.Label>
                    <Col sm={12}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Tell us about yourself and your teaching experience"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            isInvalid={!!formErrors.bio}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.bio}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formHorizontalHourlyRate">
                    <Form.Label column sm={3} className="form-label text-white">
                        Hourly Rate ($):
                    </Form.Label>
                    <Col sm={12}>
                        <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter your hourly rate"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            isInvalid={!!formErrors.hourlyRate}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.hourlyRate}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formHorizontalCertifications">
                    <Form.Label column sm={3} className="form-label text-white">
                        Certifications:
                    </Form.Label>
                    <Col sm={12}>
                        <Form.Control
                            type="text"
                            placeholder="Enter certifications (comma-separated)"
                            name="certifications"
                            value={formData.certifications}
                            onChange={handleChange}
                            isInvalid={!!formErrors.certifications}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.certifications}
                        </Form.Control.Feedback>

                        {!isError ?
                            <Form.Text className="text-white">
                                Separate multiple certifications with commas (e.g., "Teaching License, Math Certification")
                            </Form.Text> : ''}
                    </Col>
                </Form.Group>

                {formErrors.submit && (
                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }}>
                            <div className="error-message-container">
                                <div className="error-icon">⚠</div>
                                <div className="error-text">{formErrors.submit}</div>
                            </div>
                        </Col>
                    </Form.Group>
                )}

                <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 1 }} className="button-container">
                        <Button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
};

export default TutorRegisterForm;