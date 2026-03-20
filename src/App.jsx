import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Layout from './components/Layout';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('handbook_user');
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={(user) => {
      localStorage.setItem('handbook_user', JSON.stringify(user));
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<Layout><BookDetail /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
