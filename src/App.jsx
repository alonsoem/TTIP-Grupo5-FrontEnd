import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Taxes from "./components/Taxes";
import MainCalc from "./components/MainCalc";
import BrokerCreate from "./components/brokerCreate";
import BrokerEdit from "./components/brokerEdit";
import Brokers from "./components/Brokers";
import TaxCreate from "./components/taxCreate";
import TaxEdit from "./components/TaxEdit";
import RuleCreate from "./components/ruleCreate";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/rule/:id' component={RuleCreate} />
          <Route exact path="/tax/edit/:id" component={TaxEdit} />
          <Route exact path='/broker/edit/:id/tax' component={TaxCreate} />
          <Route path={"/broker/edit/:id"}  component={BrokerEdit}></Route>
          <Route exact path="/broker/edit" component={BrokerCreate} />
          <Route exact path="/broker" component={Brokers} />
          <Route path="/taxes" component={Taxes} />
          <Route path="/maincalc/:id" component={MainCalc} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/" component={Taxes} />

        </Switch>
      </BrowserRouter>
    );
  }
}
