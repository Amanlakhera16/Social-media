//!its a component
import React from "react";

const Loading = () => {
  return (
    <div className="nextgen-loading-overlay">
      <div className="nextgen-loader">
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-center">SM</div>
      </div>

      <div className="nextgen-loading-text">
        Loading
      </div>
    </div>
  );
};

export default Loading;
