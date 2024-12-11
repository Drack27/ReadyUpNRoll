import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignUp'; 
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import AccountCreationSuccess from './AccountCreationSuccess';
import WorldDetails from './WorldDetails';
import JoinWorld from './JoinWorld';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/AccountCreationSuccess" element={<AccountCreationSuccess />} />
      <Route path="/WorldDetails" element={<WorldDetails />} />
      <Route path="/JoinWorld" element={<JoinWorld />} />
    </Routes>
  );
}

export default App;