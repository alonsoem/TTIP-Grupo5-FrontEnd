import React, { Component} from "react";
import { NavLink} from 'react-router-dom';
import {Navbar, Nav,Form,  Button,NavItem} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

import './NavBar.css';
import { Modal } from "react-bootstrap";
import { withTranslation } from 'react-i18next';
import i18n from "../i18n";


import 'react-toastify/dist/ReactToastify.css';
import App18 from "../App18.jsx";

class NavBarPage extends Component {
  state = {
    isOpen: false,
    notification_qty:0,
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });


  componentWillUnmount() {
    clearInterval(this.interval);
  }


  readNotifications(){

    this.notification();
  }

  notification(){
    if (this.state.notification_qty>0) {
      toast("Hay " + this.state.notification_qty + " nuevas notificaciones!!");
      this.setState({notification_qty:0});
    }
  }

render() {
  const { t } = this.props;
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (

      <div>
  <Navbar  collapseOnSelect expand="md" bg="light" variant="light" className="navbar-light heavy-rain-gradient darken-3 mb-4">
      <Navbar.Brand href="/"><img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" id="logo" /></Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav " />

      <Navbar.Collapse id="responsive-navbar-nav ">
        <Nav className="mr-auto justify-content-center ">
          <NavItem ><NavLink to="/login" > {t("navLogin")} </NavLink></NavItem>
          <NavItem><NavLink to="/taxes"> {t("navTaxes")}</NavLink></NavItem>
          <NavItem><App18/></NavItem>
        </Nav>

      </Navbar.Collapse>
  </Navbar>

        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
        />



        <Modal size="sm" show={this.state.isOpen} onHide={this.closeModal} >
          <Modal.Header closeButton>
            <Modal.Title>Su Token</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Recuerde que precederlo por Bearer:</Form.Label>
              <Form.Control as="textarea" value={localStorage.token} rows={8} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeModal}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>
  </div>
    );
  }
}

export default withTranslation() (NavBarPage);