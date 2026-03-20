import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Layout from './components/Layout';

function App() {
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
