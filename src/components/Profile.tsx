import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { useTimer } from '../hooks/useTimer';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { profile, countryInfo, loading, error, refetch } = usePlayerProfile(username);
  const timeSinceOnline = useTimer(profile?.last_online || null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastOnline = (timestamp: number) => {
    const now = Date.now();
    const lastOnline = timestamp * 1000;
    const diffInHours = Math.floor((now - lastOnline) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Online recently';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Link to="/" className="back-button">← Back to Grandmasters</Link>
        <div className="loading">
          <h2>Loading Profile...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-container">
        <Link to="/" className="back-button">← Back to Grandmasters</Link>
        <div className="error">
          <h2>Error</h2>
          <p>{error || 'Profile not found'}</p>
          <button onClick={refetch}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Link to="/" className="back-button">← Back to Grandmasters</Link>
      
      <div className="profile-card">
        <div className="profile-header">
          {profile.avatar && (
            <img 
              src={profile.avatar} 
              alt={`${profile.username}'s avatar`}
              className="profile-avatar"
            />
          )}
          <div className="profile-basic-info">
            <h1 className="profile-username">{profile.username}</h1>
            {profile.name && <p className="profile-real-name">{profile.name}</p>}
            <div className="profile-badges">
              {profile.verified && <span className="badge verified">✓ Verified</span>}
              {profile.is_streamer && <span className="badge streamer">📺 Streamer</span>}
              <span className="badge gm">♔ Grandmaster</span>
            </div>
          </div>
        </div>

        {/* Grandmaster Summary Section */}
        <div className="grandmaster-summary">
          <h3 className="summary-title">♔ Grandmaster Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Time Since Last Online:</span>
              <div className="online-timer">
                <span className="timer-display">{timeSinceOnline}</span>
                <span className="timer-label">HH:MM:SS</span>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-label">Account Status:</span>
              <span className="summary-value status-active">
                {profile.status || 'Active'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Player ID:</span>
              <span className="summary-value">#{profile.player_id}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Member Since:</span>
              <span className="summary-value">{formatDate(profile.joined)}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Followers</span>
            <span className="stat-value">{profile.followers.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Country</span>
            <span className="stat-value">
              {countryInfo ? (
                <span className="country-info">
                  <span className="country-flag">{countryInfo.code}</span>
                  <span className="country-name">{countryInfo.name}</span>
                </span>
              ) : (
                profile.country.split('/').pop()?.toUpperCase() || 'Unknown'
              )}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status</span>
            <span className="stat-value">{profile.status}</span>
          </div>
          {profile.fide && (
            <div className="stat-item">
              <span className="stat-label">FIDE Rating</span>
              <span className="stat-value">{profile.fide}</span>
            </div>
          )}
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3>Account Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">{formatDate(profile.joined)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Online:</span>
                <span className="detail-value">{formatLastOnline(profile.last_online)}</span>
              </div>
              {profile.location && (
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{profile.location}</span>
                </div>
              )}
              {profile.league && (
                <div className="detail-item">
                  <span className="detail-label">League:</span>
                  <span className="detail-value">{profile.league}</span>
                </div>
              )}
            </div>
          </div>

          {countryInfo && (
            <div className="detail-section">
              <h3>Country Information</h3>
              <div className="country-details">
                <div className="detail-item">
                  <span className="detail-label">Country Name:</span>
                  <span className="detail-value">{countryInfo.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Country Code:</span>
                  <span className="detail-value">{countryInfo.code}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Chess.com Country Profile:</span>
                  <span className="detail-value">
                    <a 
                      href={countryInfo['@id']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="platform-link"
                    >
                      View Country Stats
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {profile.streaming_platforms && profile.streaming_platforms.length > 0 && (
            <div className="detail-section">
              <h3>Streaming Platforms</h3>
              <div className="streaming-platforms">
                {profile.streaming_platforms.map((platform: string, index: number) => (
                  <a 
                    key={index}
                    href={platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform-link"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-links">
          <a 
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chess-com-link"
          >
            View on Chess.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;