import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CreatePaste from './components/CreatePaste';
import ViewPaste from './components/ViewPaste';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CreatePaste />} />
          <Route path="/p/:id" element={<ViewPaste />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
