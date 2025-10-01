import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Grandmasters from './components/Grandmasters';
import Profile from './components/Profile';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Grandmasters />} />
            <Route path="/profile/:username" element={<Profile />} />
            {/* Catch-all route to redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;