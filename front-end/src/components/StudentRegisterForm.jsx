import React from 'react'
import {useState} from 'react';
import  axios  from 'axios';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentService  from '../services/StudentService';
import '../App.css';
const StudentRegisterForm = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const userId = user?.id;

      // Form state management with validation and submission handling
     
    const [formData, setFormData] = useState({
        gradeLevel: '',
        Major: '',
        enrolledDate: new Date().toISOString(),
        
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    //Validates form fields before submission
    const validateForm = () => {
        const errors = {};
        if(!formData.gradeLevel){
            errors.gradeLevel = 'Grade Level is required';
        }

        if(!formData.Major.trim()){
            errors.Major = 'Major is required';
        }
        return errors;  // Add this return statement
    };
    //Handles form input changes and clears related errors
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if(formErrors[name]){
            setFormErrors(prev => ({
                ...prev,
                [name ]: ''
            }))
        }
    }
    


    // Processes form submission and creates student profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(isSubmitting) return;

        const errors = validateForm();
        if(Object.keys(errors).length > 0){
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);
        
        try {
            const studentData = {
                ...formData,  // This spreads gradeLevel, major, enrollmentDate
                id: userId    // Add the user's ID
            };
            
            const response = await StudentService.createStudent(studentData);
            console.log('Student profile created: ', response.data);
            navigate('/');
        } catch(error) {
            console.error('Error details: ', error.response?.data);
            setFormErrors({
                submit: error.response?.data?.message || 'Registration failed'
            });
        } finally {
            setIsSubmitting(false);
        }
    }
  return (
    <>
    <div className="form-container">
      <h2 className='text-white'>Complete Your Student Profile</h2>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalGradeLevel">
          <Form.Label column sm={4} className="form-label text-white">
            Grade Level:
          </Form.Label>
          <Col sm={12}>
            <Form.Select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              isInvalid={!!formErrors.gradeLevel}
              required
            >
              <option value="">Select Grade Level</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.gradeLevel}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalMajor">
          <Form.Label column sm={3} className="form-label text-white">
            Major:
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="text"
              placeholder="Enter Your Major"
              name="Major"
              value={formData.Major}
              onChange={handleChange}
              isInvalid={!!formErrors.Major}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Major}
            </Form.Control.Feedback>
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
  


    </>
  )
}

export default StudentRegisterForm