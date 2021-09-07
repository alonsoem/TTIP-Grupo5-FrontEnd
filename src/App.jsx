import React from 'react';
import {Switch, Route}  from 'react-router';
import { BrowserRouter} from 'react-router-dom';
import Taxes from './Taxes';
import RegisterForm from './components/RegisterForm';
import Loginform from './components/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';




export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/taxes" component={Taxes} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/" component={Loginform} />
          <Route path="/login" component={Loginform} />
        </Switch>

      </BrowserRouter>
    );
  }
}