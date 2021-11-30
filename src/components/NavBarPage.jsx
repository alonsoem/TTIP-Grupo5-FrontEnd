import React, { Component } from "react";

import "./NavBar.css";
import {Dropdown, Navbar} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink} from "react-router-dom";
import App18 from "../App18.jsx";
import aleclogo from "../static/alecLogoTrans2.png";
import {withRouter} from "react-router";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class NavBarPage extends Component {

  componentDidMount(){

  let session = sessionStorage.getItem("token");

  if (!session) {
    this.props.history.push("/login");
  } else {
    const jwt_Token_decoded = jwt_decode(session);

    if (jwt_Token_decoded.exp * 1000 < Date.now()) {
      return this.props.history.push("/login");

    }

  }
  }




  render() {
    const { t } = this.props;

    return (

        <div>
          <ToastContainer />
        <Navbar
          collapseOnSelect
          expand="md"
          className="navbar-light heavy-rain-gradient darken-3 mb-4"
        >
          <Navbar.Brand href="/taxes">
            <img
              className="img-fluid"
              src={aleclogo}
              alt="Logo"
              id="logo"
              title="Accounting Light Extensible Calculator"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item ">
                <NavLink className="btn btn-primary" to="/">
                  {t("home")}
                </NavLink>
              </li>

              <li className="nav-item ">
                <NavLink className="btn btn-primary" to="/brokers">
                  {t("brokers")}
                </NavLink>
              </li>


              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {t("my")}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">{t("profile")}</Dropdown.Item>
                  <Dropdown.Item href="/myBrokers">{t("myBrokers")}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>


            </ul>

            <ul className="navbar-nav me-0">
              <li className="nav-item dropdown">
                <App18 />
              </li>
              <li>
                <NavLink className="btn btn-danger" to="/login">
                  <b>{t("logout")}</b>
                </NavLink>
              </li>
            </ul>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withTranslation()(withRouter(NavBarPage));
