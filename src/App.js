import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import TaskList from './components/views/TaskList';
import Login from './components/views/Login';
import Logout from './components/views/Logout';
import 'antd/dist/antd.css';
import './App.css';
import useLocalStorage from 'use-local-storage';
import { useEffect } from 'react';

function App() {
  const [accessToken] = useLocalStorage("accessToken", "");
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken === "" && window.location.href !== "/login")
      navigate("/login");
  }, [navigate, accessToken]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
