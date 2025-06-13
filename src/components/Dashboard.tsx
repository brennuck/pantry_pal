import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import { extractItemName } from '../openAI';

interface Item {
  name: string;
  quantity: number;
}

interface Pantry {
  name: string;
  items: Item[];
}

function Dashboard() {
  const [pantries, setPantries] = useState<Pantry[]>([]);
  const [newPantry, setNewPantry] = useState('');
  const [selectedPantry, setSelectedPantry] = useState<number | null>(null);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addPantry = () => {
    const trimmed = newPantry.trim();
    if (trimmed.length === 0) {
      setNotification({ type: 'error', message: 'Pantry name cannot be empty' });
      return;
    }
    setPantries([...pantries, { name: trimmed, items: [] }]);
    setNewPantry('');
    setNotification({ type: 'success', message: 'Pantry added' });
  };

  const addItem = () => {
    if (selectedPantry === null) {
      setNotification({ type: 'error', message: 'Select a pantry first' });
      return;
    }
    const trimmed = newItem.trim();
    if (trimmed.length === 0) {
      setNotification({ type: 'error', message: 'Item name cannot be empty' });
      return;
    }
    if (newQuantity <= 0) {
      setNotification({ type: 'error', message: 'Quantity must be greater than 0' });
      return;
    }
    const updated = [...pantries];
    updated[selectedPantry].items.push({ name: trimmed, quantity: newQuantity });
    setPantries(updated);
    setNewItem('');
    setNewQuantity(1);
    setNotification({ type: 'success', message: 'Item added' });
  };

  const deleteItem = (index: number) => {
    if (selectedPantry === null) return;
    const updated = [...pantries];
    updated[selectedPantry].items.splice(index, 1);
    setPantries(updated);
    setNotification({ type: 'success', message: 'Item deleted' });
  };

  const startEditItem = (index: number) => {
    if (selectedPantry === null) return;
    setEditingItemIndex(index);
    setEditingText(pantries[selectedPantry].items[index].name);
    setEditingQuantity(pantries[selectedPantry].items[index].quantity);
  };

  const saveItem = (index: number) => {
    if (selectedPantry === null) return;
    const trimmed = editingText.trim();
    if (trimmed.length === 0) {
      setNotification({ type: 'error', message: 'Item name cannot be empty' });
      return;
    }
    if (editingQuantity <= 0) {
      setNotification({ type: 'error', message: 'Quantity must be greater than 0' });
      return;
    }
    const updated = [...pantries];
    updated[selectedPantry].items[index] = { name: trimmed, quantity: editingQuantity };
    setPantries(updated);
    setEditingItemIndex(null);
    setEditingText('');
    setEditingQuantity(1);
    setNotification({ type: 'success', message: 'Item updated' });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPantry === null) {
      setNotification({ type: 'error', message: 'Select a pantry first' });
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const name = await extractItemName(file);
      if (name) {
        const updated = [...pantries];
        updated[selectedPantry].items.push({ name, quantity: 1 });
        setPantries(updated);
        setNotification({ type: 'success', message: 'Item added from photo' });
      } else {
        setNotification({ type: 'error', message: 'Could not identify item' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to process image' });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">Header</header>
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}
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
              <input
                type="number"
                min="1"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value, 10))}
                placeholder="Qty"
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
                        <input
                          type="number"
                          min="1"
                          value={editingQuantity}
                          onChange={(e) => setEditingQuantity(parseInt(e.target.value, 10))}
                        />
                        <button onClick={() => saveItem(i)}>Save</button>
                      </>
                    ) : (
                      <>
                        <span>{item.name} - Qty: {item.quantity}</span>
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
