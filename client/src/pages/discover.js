import React, { useState } from 'react';
import DiscoverFeed from '../components/DiscoverFeed';
import AddMore from '../components/AddMore';
import AnonFeed from '../components/AnonFeed';
import '../styles/discover.css';
import '../styles/anonymous.css';

const Discover = () => {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="discover_container">
      {/* Tab Switcher */}
      <div className="discover_tabs_wrapper">
        <div className="discover_tabs">
          <button
            className={`discover_tab_btn ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            🔭 Discover
          </button>
          <button
            className={`discover_tab_btn ${activeTab === 'anon' ? 'active' : ''}`}
            onClick={() => setActiveTab('anon')}
          >
            👻 Anonymous Zone
          </button>
        </div>
      </div>

      {activeTab === 'discover' ? (
        <>
          <DiscoverFeed />
          <AddMore />
        </>
      ) : (
        <AnonFeed />
      )}
    </div>
  );
};

export default Discover;
