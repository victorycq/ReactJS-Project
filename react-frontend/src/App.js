import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Register from './component/register';
import Login from './component/login';
import Home from './component/home';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path ="/" component={Home}></Route>
        {/* <Redirect from ="/" to="/login" exact /> */}
        <Route path ="/register" component={Register} />
        <Route path ="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
