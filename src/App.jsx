import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Loginform from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Taxes from "./components/Taxes";
import MainCalc from "./components/MainCalc";
import taxCreate from "./components/brokerCreate";
import brokerEdit from "./components/brokerEdit";
import Brokers from "./components/Brokers";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/broker/edit/:id' component={brokerEdit} />
          <Route path="/maincalc" component={MainCalc} />
          <Route path="/broker/edit" component={taxCreate} />
            <Route path="/broker" component={Brokers} />
          <Route path="/taxes" component={Taxes} />

          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={Loginform} />
          <Route path="/" component={Taxes} />

        </Switch>
      </BrowserRouter>
    );
  }
}
