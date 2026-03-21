import React from 'react';
import DiscoverFeed from '../components/DiscoverFeed';
import AddMore from '../components/AddMore';
import '../styles/discover.css';

const Discover = () => {
    return (
      <div className="discover_container">
        <DiscoverFeed />
        <AddMore />
      </div>
    );
}

export default Discover;
