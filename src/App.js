import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import './App.css';

function App() {
  return (
    <Switch>
      <Route exact path="/trybe-wallet/" component={ Login } />
      <Route path="/trybe-wallet/carteira" component={ Wallet } />
    </Switch>
  );
}

export default App;
