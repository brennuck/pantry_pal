import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [pantries, setPantries] = useState<string[]>([]);
  const [newPantry, setNewPantry] = useState('');
  const [selectedPantry, setSelectedPantry] = useState<string | null>(null);

  const addPantry = () => {
    const trimmed = newPantry.trim();
    if (trimmed.length === 0) return;
    setPantries([...pantries, trimmed]);
    setNewPantry('');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">Header</header>
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <div className="add-pantry">
            <input
              type="text"
              value={newPantry}
              onChange={(e) => setNewPantry(e.target.value)}
              placeholder="New pantry name"
            />
            <button onClick={addPantry}>Add Pantry</button>
          </div>
          <ul className="pantry-list">
            {pantries.map((pantry, i) => (
              <li key={i}>
                <button
                  className={pantry === selectedPantry ? 'active' : ''}
                  onClick={() => setSelectedPantry(pantry)}
                >
                  {pantry}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="dashboard-main">
          <h1>{selectedPantry ? `${selectedPantry} Pantry` : 'Dashboard'}</h1>
          {selectedPantry ? (
            <p>You are viewing the {selectedPantry} pantry.</p>
          ) : (
            <p>Welcome to your dashboard!</p>
          )}
        </main>
      </div>
      <footer className="dashboard-footer">Footer</footer>
    </div>
  );
}

export default Dashboard;
