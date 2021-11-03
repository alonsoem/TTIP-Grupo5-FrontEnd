import React, { Component } from "react";
import "./NavBar.css";
import {Navbar} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import App18 from "../App18.jsx";
import aleclogo from "../static/aleclogo.png";


class NavBarPage extends Component {
  render() {
    const { t } = this.props;

    return (
      <div>
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
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">

            <ul className="navbar-nav me-auto">
              <li className="nav-item ">
                <NavLink className="btn btn-primary" to="/taxes">
                  {t("home")}
                </NavLink>
              </li>

              <li className="nav-item ">
                <NavLink className="btn btn-primary" to="/broker">
                  {t("brokers")}
                </NavLink>
              </li>
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

export default withTranslation()(NavBarPage);
