import React, { useState, useEffect } from 'react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { submitForm, getFormSubmissions, getSubmissionCount, uploadFileToStorage } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';
import { debounce } from 'lodash'; // install via `npm install lodash`


const savedData = localStorage.getItem('formData');
const initialValues = savedData ? JSON.parse(savedData) : {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  address: '',
  nationality: '',
  linkedin: '',
  preferredLanguage: '',
  portfolio: '',
 };
const AutoSave = ({ values }) => {
  useEffect(() => {
    const debouncedSave = debounce(() => {
      localStorage.setItem('formData', JSON.stringify(values));
      console.log('✅ Form auto-saved');
    }, 1000); // save 1 sec after stop typing

    debouncedSave();

    return () => debouncedSave.cancel(); // cleanup
  }, [values]);

  return null; // this is a side-effect-only component
};

const SUPPORTED_FORMATS = [
  'application/pdf'];

const FormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .required('Please enter your first name'),

  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .required('Please enter your last name'),

  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Please select your date of birth'),

  gender: Yup.string()
    .oneOf(['male', 'female', 'other', 'prefer-not-to-say'], 'Please select a valid gender')
    .required('Please select your gender'),

  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Please enter your phone number'),

  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .required('Please enter your address'),

  nationality: Yup.string()
    .min(2, 'Nationality must be at least 2 characters')
    .max(50, 'Nationality cannot exceed 50 characters')
    .required('Please enter your nationality'),

  linkedin: Yup.string()
    .url('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)')
    .nullable(), // optional

  preferredLanguage: Yup.string()
    .oneOf(['english', 'french', 'spanish', 'german', 'other'], 'Please select a valid language')
    .required('Please select your preferred language'),
  
  cv: Yup.mixed()
    // .required('Please upload your CV')
    .test('fileFormat', 'CV must be a PDF(.pdf)', (value) => {
      return !value || SUPPORTED_FORMATS.includes(value.type);
    })
    .nullable(), // optional

  portfolio: Yup.string()
    .url('Please enter a valid URL for your portfolio (e.g., https://yourportfolio.com)')
    .nullable() // optional
});

const MultiStepForm = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, userId } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
  };

  // Load user's submissions
  useEffect(() => {
    loadSubmissions();
  }, [userId]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const [submissionsResult, countResult] = await Promise.all([
        getFormSubmissions(),
        getSubmissionCount()
      ]);

      if (submissionsResult.success) {
        // Show only current user's submissions
        const userSubmissions = submissionsResult.data.filter(
          submission => submission.userId === userId
        );
        setSubmissions(userSubmissions);
      } else {
        setError(submissionsResult.message);
      }

      if (countResult.success) {
        setSubmissionCount(countResult.count);
      }
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement form validation using Formik and Yup








  // TODO: Implement form data handling

  const handleSubmit = async (formData) => {
    // e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // TODO: Add validation before submitting


      let fileURL = null;
  
      if (formData.cv) {
        // Upload the file to Firebase Storage
        fileURL = await uploadFileToStorage(formData.cv, 'uploads');
      }

      const submissionData = {
        ...formData,
        cv: fileURL || null, // Save the file URL instead of the file object
        userId: userId
      };

      console.log("submit", submissionData, formData, JSON.stringify(submissionData), JSON.stringify(formData));
      
      const result = await submitForm(submissionData);
      
      if (result.success) {
        setSubmitMessage('Form submitted successfully!');
        // Reset form
        setFormData({});
        // Reload submissions to show the new one
        loadSubmissions();
      } else {
        setSubmitMessage(result.message);
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Personal Information Form</h1>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Logout
          </button>
        </div>
        <p>Please provide your basic personal details.</p>
        
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Logged in as:</strong> {user.email}
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={FormSchema}
         
          onSubmit={async (values, { setSubmitting }) => {


            console.log("onSubmit called")


            await handleSubmit(values);


            console.log("after onSubmit called")


            setTimeout(() => {
              console.log("onSubmit timeout")
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
          
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            /* and other goodies */
          }) => {
            return <>
            <form onSubmit={handleSubmit}>
            <AutoSave values={values} />
          <PersonalInfoStep 
            formData={formData} 
            setFormData={setFormData} 
            values={values} 
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            setFieldValue={setFieldValue}

          />
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
            {/*<form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && errors.email}
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
            */} </>
          }}
        </Formik>




        {/* Admin Panel - User's Submissions */}
        <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #e0e0e0' }}>
          <h2>Your Form Submissions</h2>
          <p>View all your submitted forms below.</p>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <p><strong>Logged in as:</strong> {user.email}</p>
            <p><strong>Total submissions:</strong> {submissionCount}</p>
            <p><strong>Your submissions:</strong> {submissions.length}</p>
          </div>

          {error && (
            <div className="submit-message error">
              {error}
            </div>
          )}

          <button 
            onClick={loadSubmissions} 
            className="btn btn-primary"
            style={{ marginBottom: '20px' }}
          >
            Refresh
          </button>

          {loading ? (
            <p>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p>No submissions yet. Fill out the form above to get started!</p>
          ) : (
            <div className="submissions-list">
              {submissions.map((submission) => (
                <div key={submission.id} className="submission-item">
                  <div className="submission-header">
                    <h3>Submission #{submission.id.slice(-8)}</h3>
                    <span className="submission-date">
                      {formatDate(submission.submittedAt)}
                    </span>
                  </div>
              <div className="submission-details">
                <p><strong>Name:</strong> {submission.firstName} {submission.lastName}</p>
                <p><strong>Date of Birth:</strong> {submission.dateOfBirth}</p>
                <p><strong>Gender:</strong> {submission.gender}</p>
              </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

export default MultiStepForm;
