import React, { useState, forwardRef } from 'react';

const ProfileImageUpload = forwardRef((props, ref) => { // Use forwardRef
    const [selectedImage, setSelectedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // State for error message


  const handleImageChange = (event) => {
    const file = event.target.files[0];
     // Check file size (5MB limit in this example)
     const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
     if (file.size > maxSizeInBytes) {
       setErrorMessage("Yer dang picture's filesize is too big! The limit's 5mb. Server space don't grow on trees,  y'know. ");
       setSelectedImage(null);
       return; // Prevent further processing
     }
    setSelectedImage(file);
    setErrorMessage(null); // Clear any previous error message
    props.onImageChange(file); // Access onImageChange from props
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        ref={ref} // Attach the ref to the input element
        id="imageUpload" // Add an ID to the input
        style={{display: 'none'}} // Hide the default button
      />
      <button onClick={() => document.getElementById('imageUpload').click()}> 
        Upload Profile Image {/* Your custom button text */}
      </button>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      <div> 
        {/* Display the selected image or a default image */}
        {selectedImage ? (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            style={{ maxWidth: '200px' }}
          />
        ) : (
          <img
            src="default-profile-image.png" // Replace with your default image URL
            alt="Default Profile"
            style={{ maxWidth: '200px' }}
          />
        )}
      </div>
    </div>
  );
});

export default ProfileImageUpload;