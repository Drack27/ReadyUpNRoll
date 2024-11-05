    import './LoginPage.css'; // Import your CSS file
    import { useState } from 'react'; 

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div   
 className="login-page">
      <header className="login-page-header">
        <h1>So you think you belong here, huh? Prove it.</h1>
      </header>

      <form className="login-form">
        <div className="input-group">
          <label htmlFor="email">
            Who the heck are ya? <br /> (Email or Username)
          </label>
          <input
            type="text"
            id="email"
            placeholder="I.E. coolguy@gmail.com"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">
            What's the magic word? <br /> (Password)
          </label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="I.E. DiceD@wg27"
            />
            <button
              type="button" // Prevent form submission
              className="show-password-button"
              onClick={togglePasswordVisibility}
            >
              {/* You'll need to add an icon or image for the eyeball */}
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" className="submit-button">
          LEMME IN
        </button>
      </form>
    </div>
  );
}

export default LoginPage;