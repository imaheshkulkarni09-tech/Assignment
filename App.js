import { useState } from 'react';
import './App.css';
import Header from './Header';
import  Home  from './Home';
import Sidebar from './Sidebar';
import dashboard from './dashboard.jsx';
function App() {
  return (
    <div className="grid-container">
     <Header/>
     <Home/>
     <Sidebar/>
    </div>
  );
}

export default App;
