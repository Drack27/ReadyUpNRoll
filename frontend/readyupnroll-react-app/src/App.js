import { Routes, Route } from 'react-router-dom';

import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignUp';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import AccountCreationSuccess from './AccountCreationSuccess';
import WorldDetailsPlayer from './WorldDetailsPlayer';
import WorldDetailsGM from './WorldDetailsGM';
import JoinWorld from './JoinWorld';
import InvitePlayers from './InvitePlayers';
import ReadyUpScreen from './ReadyUpScreen';
import AvailabilitySubmitted from './AvailabilitySubmitted';
import LeaveWorldConfirmation from './LeaveWorldConfirmation';
import LeaveWorldSuccess from './LeaveWorldSuccess';
import GroundRulesAcceptance from './GroundRulesAcceptance';
import JoinWorldSuccess from './JoinWorldSuccess';
import Pricing from './Pricing';

import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/AccountCreationSuccess" element={<AccountCreationSuccess />} />
          <Route path="/Pricing" element={<Pricing />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/WorldDetailsPlayer" element={<WorldDetailsPlayer />} />
          <Route path="/WorldDetailsGMCreate" element={<WorldDetailsGM />} />
          <Route path="/WorldDetailsGMEdit/:worldId" element={<WorldDetailsGM />} />
          <Route path="/JoinWorld" element={<JoinWorld />} />
          <Route path="/InvitePlayers/:worldId" element={<InvitePlayers />} />
          <Route path="/ReadyUpScreen" element={<ReadyUpScreen />} />
          <Route path="/AvailabilitySubmitted" element={<AvailabilitySubmitted />} />
          <Route path="/LeaveWorldConfirmation" element={<LeaveWorldConfirmation />} />
          <Route path="/LeaveWorldSuccess" element={<LeaveWorldSuccess />} />
          <Route path="/GroundRulesAcceptance" element={<GroundRulesAcceptance />} />
          <Route path="/JoinWorldSuccess" element={<JoinWorldSuccess />} />
        </Route>
    </Routes>
  );
}

export default App;