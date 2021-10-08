import React, { Component } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import App18 from "../App18.jsx";
import aleclogo from "../static/aleclogo.png";
import "./NavBar.css";

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
              className="img-thumbnail"
              src={aleclogo}
              alt="Logo"
              id="logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto justify-content-center ">
              <NavItem>
                <NavLink className="btn btn-primary" to="/broker">
                  <b>{t("brokers")}</b>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="btn btn-primary" to="/taxes">
                  <b>{t("preferences")}</b>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="btn btn-danger" to="/login">
                  <b>{t("logout")}</b>
                </NavLink>
              </NavItem>
              <NavItem>
                <App18 />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withTranslation()(NavBarPage);
