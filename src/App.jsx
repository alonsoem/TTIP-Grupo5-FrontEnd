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
          <Route exact path="/broker/:brokerId/tax/:taxId/rule" component={RuleCreate} />
          <Route exact path="/broker/:brokerId/tax/:taxId/rule/:ruleId" component={RuleEdit} />
          <Route exact path="/broker/:brokerId/tax" component={TaxCreate} />
          <Route exact path="/broker/:brokerId/tax/:taxId" component={TaxEdit} />
          <Route exact path="/broker/:brokerId" component={BrokerEdit}></Route>
          <Route exact path="/broker" component={BrokerCreate} />
          <Route exact path="/brokers/:userId" component={BrokersByUser} />
          <Route exact path="/brokers" component={Brokers} />


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
