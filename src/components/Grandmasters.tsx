import React from 'react';
import { Link } from 'react-router-dom';
import { useGrandmasters } from '../hooks/useGrandmasters';

const Grandmasters: React.FC = () => {
  const { grandmasters, loading, error, refetch } = useGrandmasters();

  if (loading) {
    return (
      <div className="grandmasters-container">
        <div className="loading">
          <h2>Loading Grandmasters...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grandmasters-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={refetch}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grandmasters-container">
      <header className="grandmasters-header">
        <h1>Chess.com Grandmasters</h1>
        <p className="grandmasters-count">
          Total: {grandmasters.length} Grandmasters
        </p>
      </header>
      
      <div className="grandmasters-grid">
        {grandmasters.map((username, index) => (
          <div key={username} className="grandmaster-card">
            <div className="grandmaster-rank">#{index + 1}</div>
            <div className="grandmaster-info">
              <h3 className="grandmaster-username">{username}</h3>
              <Link 
                to={`/profile/${username}`}
                className="grandmaster-link"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grandmasters;