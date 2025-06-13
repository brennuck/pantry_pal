import React, { useState, useRef } from 'react';
import './Dashboard.css';
import { extractItemName } from '../openAI';
import { toast } from 'react-toastify';

interface Pantry {
  name: string;
  items: string[];
}

function Dashboard() {
  const [pantries, setPantries] = useState<Pantry[]>([]);
  const [newPantry, setNewPantry] = useState('');
  const [selectedPantry, setSelectedPantry] = useState<number | null>(null);
  const [newItem, setNewItem] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addPantry = () => {
    const trimmed = newPantry.trim();
    if (trimmed.length === 0) {
      toast.error('Pantry name cannot be empty');
      return;
    }
    setPantries([...pantries, { name: trimmed, items: [] }]);
    setNewPantry('');
    toast.success('Pantry added');
  };

  const addItem = () => {
    if (selectedPantry === null) {
      toast.error('Select a pantry first');
      return;
    }
    const trimmed = newItem.trim();
    if (trimmed.length === 0) {
      toast.error('Item name cannot be empty');
      return;
    }
    const updated = [...pantries];
    updated[selectedPantry].items.push(trimmed);
    setPantries(updated);
    setNewItem('');
    toast.success('Item added');
  };

  const deleteItem = (index: number) => {
    if (selectedPantry === null) {
      toast.error('Select a pantry first');
      return;
    }
    const updated = [...pantries];
    updated[selectedPantry].items.splice(index, 1);
    setPantries(updated);
    toast.success('Item deleted');
  };

  const startEditItem = (index: number) => {
    if (selectedPantry === null) return;
    setEditingItemIndex(index);
    setEditingText(pantries[selectedPantry].items[index]);
  };

  const saveItem = (index: number) => {
    if (selectedPantry === null) {
      toast.error('Select a pantry first');
      return;
    }
    const trimmed = editingText.trim();
    if (trimmed.length === 0) {
      toast.error('Item name cannot be empty');
      return;
    }
    const updated = [...pantries];
    updated[selectedPantry].items[index] = trimmed;
    setPantries(updated);
    setEditingItemIndex(null);
    setEditingText('');
    toast.success('Item updated');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPantry === null) {
      toast.error('Select a pantry first');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }
    setLoading(true);
    try {
      const name = await extractItemName(file);
      if (name) {
        const updated = [...pantries];
        updated[selectedPantry].items.push(name);
        setPantries(updated);
        toast.success('Item added from photo');
      } else {
        toast.error('Could not detect item');
      }
    } catch {
      toast.error('Failed to process image');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
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
                  className={i === selectedPantry ? 'active' : ''}
                  onClick={() => setSelectedPantry(i)}
                >
                  {pantry.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="dashboard-main">
          <h1>
            {selectedPantry !== null
              ? `${pantries[selectedPantry].name} Pantry`
              : 'Dashboard'}
          </h1>
          {selectedPantry !== null ? (
            <div className="item-section">
            <div className="add-item">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="New item"
              />
              <button onClick={addItem}>Add Item</button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current?.click()}>
                Add Item from Photo
              </button>
              {loading && <span> Processing...</span>}
            </div>
              <ul className="item-list">
                {pantries[selectedPantry].items.map((item, i) => (
                  <li key={i}>
                    {editingItemIndex === i ? (
                      <>
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <button onClick={() => saveItem(i)}>Save</button>
                      </>
                    ) : (
                      <>
                        <span>{item}</span>
                        <button onClick={() => startEditItem(i)}>Edit</button>
                      </>
                    )}
                    <button onClick={() => deleteItem(i)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
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
