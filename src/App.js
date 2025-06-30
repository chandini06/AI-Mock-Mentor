import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'; 
import MentorChat from './pages/MentorChat';
import MockInterview from './pages/MockInterview';
import Account from './pages/Account';
import Results from "./pages/Results";
import Performance from './pages/Performance';
import UserManagement from "./pages/UserManagement";
import BotManagement from "./pages/BotManagement";
import Reports from "./pages/Reports";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/mentor" element={<MentorChat />} />
         <Route path="/interview" element={<MockInterview />} />
          <Route path="/account" element={<Account />} /> 
           <Route path="/results" element={<Results />} />
           <Route path="/performance" element={<Performance />} />
           <Route path="/admin/users" element={<UserManagement />} />
<Route path="/admin/bots" element={<BotManagement />} />
<Route path="/admin/reports" element={<Reports />} />

      </Routes>
    </Router>
  );
}

export default App;
