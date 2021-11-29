import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./components/breadcumb.css";
import BrokerCreate from "./components/brokerCreate";
import BrokerEdit from "./components/brokerEdit";
import Brokers from "./components/Brokers";
import LoginForm from "./components/LoginForm";
import MainCalc from "./components/MainCalc";
import RegisterForm from "./components/RegisterForm";
import RuleCreate from "./components/ruleCreate";
import RuleEdit from "./components/ruleEdit";
import TaxCreate from "./components/taxCreate";
import TaxEdit from "./components/TaxEdit";
import Landing from "./components/landing";
import UserProfile from "./components/UserProfile";
import BrokersByUser from "./components/BrokersByUser";

export default class App extends React.Component {
  render() {
    return (
        <div   >
      <BrowserRouter>
        <Switch>
          <Route exact path="/rule/:id" component={RuleCreate} />
          <Route exact path="/rule/edit/:id" component={RuleEdit} />
          <Route exact path="/broker/edit/:id/tax" component={TaxCreate} />
          <Route exact path="/tax/edit/:id" component={TaxEdit} />
          <Route path={"/broker/edit/:id"} component={BrokerEdit}></Route>
            <Route exact path="/broker/edit" component={BrokerCreate} />
            <Route exact path="/broker/:userId" component={BrokersByUser} />

          <Route exact path="/broker" component={Brokers} />


          <Route path="/maincalc/:id" component={MainCalc} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/" component={Landing} />
        </Switch>
      </BrowserRouter>
        </div>
    );
  }
}
