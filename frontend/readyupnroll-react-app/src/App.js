import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignUp'; 
import SuccessPage from './SuccessPage'; 
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/success" element={<SuccessPage />} /> 
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
}

export default App;