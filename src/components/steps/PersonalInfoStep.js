import React from 'react';

const PersonalInfoStep = ({ formData, setFormData, 
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  setFieldValue }) => {
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  return (
    <div>
      <h2>Personal Information</h2>
      <p>Please provide your basic personal details.</p>

      {/* First Name */}
      <div className="form-group">
        <label className="form-label">First Name *</label>
        <input 
          type="text" 
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input" 
          placeholder="Enter your first name" 
        />
      </div>
      {errors.firstName && touched.firstName && (
  <div className="form-error">{errors.firstName}</div>
)}
      
      {/* Last Name */}
      <div className="form-group">
        <label className="form-label">Last Name *</label>
        <input 
          type="text" 
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input" 
          placeholder="Enter your last name" 
        />
      </div>
      {errors.lastName && touched.lastName && (
  <div className="form-error">{errors.lastName}</div>
)}

      

      {/* Date of Birth */}
      <div className="form-group">
        <label className="form-label">Date of Birth *</label>
        <input 
          type="date" 
          name="dateOfBirth"
          value={values.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input" 
        />
      </div>
      {errors.dateOfBirth && touched.dateOfBirth && (
  <div className="form-error">{errors.dateOfBirth}</div>)}


      {/* Gender */}
      <div className="form-group">
        <label className="form-label">Gender *</label>
        <select 
          name="gender"
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>
      {errors.gender && touched.gender && (
  <div className="form-error">{errors.gender}</div>
)}


      {/* Phone Number */}
      <div className="form-group">
        <label className="form-label">Phone Number *</label>
        <input 
          type="tel" 
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input"
          placeholder="Enter your phone number"
        />
      </div>
      {errors.phone && touched.phone && (
  <div className="form-error">{errors.phone}</div>
)}

      

      {/* Address */}
      <div className="form-group">
        <label className="form-label">Address *</label>
        <textarea 
          name="address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input"
          placeholder="Enter your address"
        />
      </div>
      {errors.address && touched.address && (
  <div className="form-error">{errors.address}</div>
)}


      {/* Nationality */}
      <div className="form-group">
        <label className="form-label">Nationality *</label>
        <input 
          type="text" 
          name="nationality"
          value={values.nationality}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input"
          placeholder="Enter your nationality"
        />
      </div>
      {errors.nationality && touched.nationality && (
  <div className="form-error">{errors.nationality}</div>
)}

      

      {/* LinkedIn URL */}
      <div className="form-group">
        <label className="form-label">LinkedIn Profile</label>
        <input 
          type="url" 
          name="linkedin"
          value={values.linkedin}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input"
          placeholder="https://linkedin.com/in/your-profile"
        />
      </div>
      {errors.linkedin && touched.linkedin && (
  <div className="form-error">{errors.linkedin}</div>
)}

      

      {/* Preferred Language */}
      <div className="form-group">
        <label className="form-label">Preferred Language *</label>
        <select 
          name="preferredLanguage"
          value={values.preferredLanguage}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input"
        >
          <option value="">Select a language</option>
          <option value="english">English</option>
          <option value="french">French</option>
          <option value="spanish">Spanish</option>
          <option value="german">German</option>
          <option value="other">Other</option>
        </select>
      </div>
      {errors.preferredLanguage && touched.preferredLanguage && (
  <div className="form-error">{errors.preferredLanguage}</div>
)}


      {/* CV Upload */}
      <div className="form-group">
        <label className="form-label">Upload CV</label>
        <input 
          type="file" 
          name="cv"
          accept='.pdf'
          onChange={(event) => {setFieldValue("cv",event.currentTarget.files[0])}}
          onBlur={handleBlur}
          className="form-input"
        />
        {formData.cv && <p>Selected file: {formData.cv.name}</p>}
      </div>
      {errors.cv && touched.cv && (
  <div className="form-error">{errors.cv}</div>
)}


      {/* 🔧 Optional: Add More Useful Fields */}

      {/* Website/Portfolio */}
      <div className="form-group">
        <label className="form-label">Portfolio Website</label>
        <input 
          type="url" 
          name="portfolio"
          value={values.portfolio}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input"
          placeholder="https://yourportfolio.com"
        />
      </div>
      {errors.portfolio && touched.portfolio && (
  <div className="form-error">{errors.portfolio}</div>
)}

      {/* Availability */}
      {/* <div className="form-group">
        <label className="form-label">Availability *</label>
        <select 
          name="availability"
          value={formData.availability || ''}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">Select</option>
          <option value="immediately">Immediately</option>
          <option value="2-weeks">In 2 weeks</option>
          <option value="1-month">In 1 month</option>
        </select>
      </div> */}

    </div>
  );
};

export default PersonalInfoStep;
