import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

function RegisterForm() {
  //Form state management and routing hooks
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingType, setSubmittingType] = useState('');

  //Validates all form fields before submission
  const validateForm = () => {
    const errors = {};
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address ';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    return errors;
  };
//
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
// * Processes form submission based on selected user type
  const handleSubmit = (userType) => async (e) => {
    e.preventDefault();

    // Prevent submission if already submitting
    if (isSubmitting) return;

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmittingType(userType);
    try {
      const userData = { ...formData, userType };
      const response = await UserService.create(userData);
      console.log("User registered: ", response.data);

      if (response.data.token) {
        login(response.data.token, response.data.user);
      }

      if (userType === 'Tutor') {
        navigate('/tutor-registration');
      } else {
        navigate('/student-registration');
      }
    } catch (error) {
      console.error("Error details: ", error.response?.data);
      setFormErrors({
        submit: error.response?.data?.message || 'Registration failed'
      });
    } finally {
      setIsSubmitting(false);
      setSubmittingType('');
    }
  };

  return (
    <div className="form-container">
      <h2 className='text-white'>Register</h2>
      <Form noValidate>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
          <Form.Label column sm={3} className="form-label text-white">
            Name:
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="text"
              placeholder="Enter Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!formErrors.name}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.name}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

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
          <Col sm={{ span: 10, offset: 1 }} className="button-container">
            <Button
              onClick={handleSubmit('Tutor')}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting && submittingType === 'Tutor' ? 'Registering...' : 'Register as Tutor'}
            </Button>
            <Button
              onClick={handleSubmit('Student')}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              {isSubmitting && submittingType === 'Student' ? 'Registering...' : 'Register as Student'}
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default RegisterForm;