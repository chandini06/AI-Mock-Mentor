import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'; // ✅ Import Dashboard
import MentorChat from './pages/MentorChat';
import MockInterview from './pages/MockInterview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Add route */}
        <Route path="/mentor" element={<MentorChat />} />
         <Route path="/interview" element={<MockInterview />} />
      </Routes>
    </Router>
  );
}

export default App;
