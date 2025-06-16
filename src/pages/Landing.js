import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
      {/* Main Box */}
      <div className="landing-box">
        <div className="text-section">
          <h1 className="landing-title">🚀 Welcome to GATE CS Tracker</h1>
          <p className="landing-subtitle">
            Your one-stop tool to monitor subject-wise progress, attempt mock tests,
            and visualize your GATE preparation.
          </p>
          <ul className="feature-list">
            <li>📚 Subject-wise progress tracking</li>
            <li>📝 Mock test completion checklist</li>
            <li>📊 Real-time performance charts</li>
            <li>📅 Personalized study planner (coming soon)</li>
          </ul>
          <div className="button-center-wrapper">
            <button className="start-button" onClick={handleStart}>
              Start Tracking →
            </button>
          </div>
        </div>

        <div className="animation-section">
          <DotLottieReact
            src="https://lottie.host/b3d6cc8a-be0d-43b3-94e2-865a24d13719/EkoP9IYXX3.lottie"
            autoplay
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* Footer OUTSIDE the box */}
      <div className="landing-footer">
        © 2025 GATE CS Tracker | Built with ❤️ by Mansvi
      </div>
    </div>
  );
};

export default Landing;
