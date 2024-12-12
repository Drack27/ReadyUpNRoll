import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignUp'; 
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import AccountCreationSuccess from './AccountCreationSuccess';
import WorldDetailsPlayer from './WorldDetailsPlayer';
import WorldDetailsGM from './WorldDetailsGM';
import JoinWorld from './JoinWorld';
import InvitePlayers from './InvitePlayers';
import ReadyUpScreen from './ReadyUpScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/AccountCreationSuccess" element={<AccountCreationSuccess />} />
      <Route path="/WorldDetailsPlayer" element={<WorldDetailsPlayer />} />
      <Route path="/WorldDetailsGM" element={<WorldDetailsGM />} />
      <Route path="/JoinWorld" element={<JoinWorld />} />
      <Route path="/InvitePlayers/:worldId" element={<InvitePlayers />} />
      <Route path="/ReadyUpScreen" element={<ReadyUpScreen />} />
    </Routes>
  );
}

export default App;