import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">Header</header>
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">Sidebar</aside>
        <main className="dashboard-main">
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard!</p>
        </main>
      </div>
      <footer className="dashboard-footer">Footer</footer>
    </div>
  );
}

export default Dashboard;
