import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Dashboard />
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
