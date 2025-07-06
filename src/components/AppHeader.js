import React from "react";

function AppHeader({ children }) {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg"
          alt="SpaceX"
          className="logo"
        />
        {children}
      </div>
    </header>
  );
}

export default AppHeader;
