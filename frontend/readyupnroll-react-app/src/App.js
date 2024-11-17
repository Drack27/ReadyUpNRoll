import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignUp'; 
import SuccessPage from './SuccessPage'; 
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import PlayerPoolNamePage from './PlayerPoolNamePage'
import OfferGameSystems from './OfferGameSystems';
import OfferCampaignSettings from './OfferCampaignSettings';
import OfferModules from './OfferModules';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/success" element={<SuccessPage />} /> 
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/PPCname" element={<PlayerPoolNamePage />} />
      <Route path="/OfferGameSystems" element={<OfferGameSystems />} />
      <Route path="/OfferCampaignSettings" element={<OfferCampaignSettings />} />
      <Route path="/OfferModules" element={<OfferModules />} />
    </Routes>
  );
}

export default App;