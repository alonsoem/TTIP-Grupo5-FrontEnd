import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Loginform from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Taxes from "./Taxes";
import MainCalc from "./components/MainCalc";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/maincalc" component={MainCalc} />
          <Route path="/taxes" component={Taxes} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={Loginform} />
          <Route path="/" component={Taxes} />
        </Switch>
      </BrowserRouter>
    );
  }
}
