import React from "react";
import logo from './logo.svg';
import './App.css';
import Particle from "particle-api-js"
import MainContent from "./MainContent";
import FirebaseContent from "./FirebaseContent";
import NavBar from "./NavBar";

function App() {

  return (
    <div className="App">
        <NavBar/>
        <FirebaseContent/>
    </div>
  );
}

export default App;
