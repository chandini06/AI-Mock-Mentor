import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'; 
import MentorChat from './pages/MentorChat';
import MockInterview from './pages/MockInterview';
import Account from './pages/Account';

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
      </Routes>
    </Router>
  );
}

export default App;
