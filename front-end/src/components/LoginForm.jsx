import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useAuth } from '../context/AuthContext';
import authService from '../services/AuthService';
import '../App.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const errors = {};
        // Email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };
    // Handles input changes and clears related error messages
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
    //Handles form submission and authentication
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
            const data = await authService.login(formData);
            console.log('Login successful:', data);
            
            if (data.token) {
                login(data.token, data.user);
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data);
            setFormErrors({
                submit: error.response?.data?.message || 'Login failed. Please check your credentials.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className='text-white'>Login</h2>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={3} className="form-label text-white">
                        Email:
                    </Form.Label>
                    <Col sm={12}>
                        <Form.Control
                            type="email"
                            placeholder="Enter Your Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!formErrors.email}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.email}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                    <Form.Label column sm={3} className="form-label text-white">
                        Password:
                    </Form.Label>
                    <Col sm={12}>
                        <Form.Control
                            type="password"
                            placeholder="Enter Your Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!formErrors.password}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.password}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                {formErrors.submit && (
                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 1 }}>
                            <div className="error-message-container">
                                <div className="error-icon">⚠️</div>
                                <div className="error-text">{formErrors.submit}</div>
                            </div>
                        </Col>
                    </Form.Group>
                )}

                <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 4}} className="button-container ">
                        <Button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
};

export default LoginForm;