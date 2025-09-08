import { useState } from 'react';
import './App.css';
import Header from './Header';
import  Home  from './Home';
import Sidebar from './Sidebar';

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
