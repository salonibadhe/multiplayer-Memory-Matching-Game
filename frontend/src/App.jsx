import { Link, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CreateRoomPage from './pages/CreateRoomPage.jsx';
import JoinRoomPage from './pages/JoinRoomPage.jsx';
import GameBoardPage from './pages/GameBoardPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useTheme } from './context/ThemeContext.jsx';

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

export default function App() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <nav className="nav">
        <Link to="/">MindMatch Arena</Link>
        <div>
          <Link to="/leaderboard">Leaderboard</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && <Link to="/profile">Profile</Link>}
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme} mode</button>
          {user ? <button onClick={logout}>Logout</button> : <Link to="/auth">Login</Link>}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/create-room" element={<Protected><CreateRoomPage /></Protected>} />
        <Route path="/join-room" element={<Protected><JoinRoomPage /></Protected>} />
        <Route path="/game/:roomCode" element={<Protected><GameBoardPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
      </Routes>
    </div>
  );
}
