import * as md5 from "md5";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  FormGroup,
  Image,
  Row,
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { IntlProvider } from "react-intl";
import { postRegister } from "../api/api";
import App18 from "../App18";
import i18n from "../i18n.js";
import signup from "../static/signup.jpg";
import "./registerform.css";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      province: "0",
      taxpayerType: "false",
      otherTaxes: "false",
      error: "",
      fecha: new Date(),
      number: 106.34,
      errors: [],
      errorVisible: false,
      okMsgVisible: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showAlert() {
    this.setState({ errorVisible: true });
    setTimeout(() => this.setState({ errorVisible: false }), 3000);
  }

  handleInputChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const obj = {};
    obj[key] = value;
    this.setState(obj);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    var errors = [];

    // Check name of user
    if (this.state.name === "") {
      errors.push("name");
    }

    // Check email address
    const expression = /\S+@\S+/;
    var validEmail = expression.test(String(this.state.email).toLowerCase());
    if (!validEmail) {
      errors.push("email");
    }

    // Check password length
    if (this.state.password.length < 4) {
      errors.push("password");
    }

    this.setState({
      errors: errors,
    });

    if (errors.length > 0) {
      return false;
    } else {
      postRegister({
        name: this.state.name,
        email: this.state.email,
        password: md5(this.state.password),
        province: this.state.province,
        respInscripto: this.state.taxpayerType,
        gananciasYBienesP: this.state.otherTaxes,
      })
        .then(() => {
          this.setState({ okMsgVisible: true });
          setTimeout(() => this.props.history.push("/login"), 3000);
        })
        .catch((responseError) => this.handleAPIError(responseError));
    }
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }

    if (
      responseError.response &&
      responseError.response.data.message.startsWith("User already exists")
    ) {
      errorToDisplay = this.props.t("duplicateUser");
    }
    this.setState({ error: errorToDisplay });
    this.showAlert();
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  render() {
    const { t } = this.props;

    return (
      <div className="container-fluid bg">
        <br />
        <br />
        <MDBContainer>
          <Row className="row">
            <Col className="col-12 col-sm-4 col-lg-6 col-xl-6 pb-4">
              <MDBCard>
                <Image
                  className="card-img-top"
                  src={signup}
                  alt="Sign Up image"
                />
                <MDBCardBody>
                  <IntlProvider locale={i18n.language}>
                    <p className="list-group-item list-group-item-action list-group-item-primary text-dark">
                      <b>{t("priceLegend")}</b>
                    </p>
                  </IntlProvider>
                </MDBCardBody>
              </MDBCard>
            </Col>
            <Col className="col-12 col-sm-8 col-lg-6 col-xl-6">
              <MDBRow className="row-sm d-flex justify-content-center">
                <MDBCol>
                  <MDBCard>
                    <MDBCardBody>
                      <Form onSubmit={this.handleSubmit}>
                        <p className="h5 text-center mb-4 card-header">
                          {t("registerTitle")}
                        </p>
                        <br />
                        <Alert
                          className="alert alert-dismissible"
                          variant="danger"
                          show={this.state.errorVisible}
                        >
                          {this.state.error}
                        </Alert>
                        <Alert
                          className="alert alert-dismissible"
                          variant="success"
                          show={this.state.okMsgVisible}
                        >
                          {t("userCreationOk")}
                        </Alert>

                        <FormGroup controlId="formUser">
                          <label htmlFor="name" className="form-label">
                            {t("name")}
                          </label>
                          <input
                            name="name"
                            type="text"
                            className={
                              this.hasError("name")
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            icon="user"
                            id="name"
                            onChange={this.handleInputChange}
                          />
                          <div
                            className={
                              this.hasError("name")
                                ? "invalid-feedback"
                                : "visually-hidden"
                            }
                          >
                            {t("userInvalidFeedback")}
                          </div>
                        </FormGroup>

                        <FormGroup controlId="formBasicEmail" className="form">
                          <label htmlFor="email" className="form-label">
                            {t("email")}
                          </label>
                          <input
                            name="email"
                            className={
                              this.hasError("email")
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            type="email"
                            icon="envelope"
                            onChange={this.handleInputChange}
                            size="sm"
                          />
                          <div
                            className={
                              this.hasError("email")
                                ? "invalid-feedback"
                                : "visually-hidden"
                            }
                          >
                            {t("emailInvalidFeedback")}
                          </div>
                        </FormGroup>

                        <FormGroup controlId="formBasicPassword">
                          <label htmlFor="password" className="form-label">
                            {t("password")}
                          </label>
                          <input
                            name="password"
                            className={
                              this.hasError("password")
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            id="password"
                            type="password"
                            icon="lock"
                            onChange={this.handleInputChange}
                            size="sm"
                          />
                          <div
                            className={
                              this.hasError("password")
                                ? "invalid-feedback"
                                : "visually-hidden"
                            }
                          >
                            {t("passwordInvalidFeedback")}
                          </div>
                        </FormGroup>

                        <FormGroup controlId="formBasicProvince">
                          <label htmlFor="province" className="form-label">
                            {t("province")}
                          </label>
                          <select
                            name="province"
                            className="form-control"
                            id="province"
                            onChange={this.handleInputChange}
                          >
                            <option value="0">Buenos Aires</option>
                            <option value="1">Capital Federal</option>
                            <option value="10">Catamarca</option>
                            <option value="13">Chaco</option>
                            <option value="18">Chubut</option>
                            <option value="3">Córdoba</option>
                            <option value="5">Corrientes</option>
                            <option value="6">Entre Ríos</option>
                            <option value="14">Formosa</option>
                            <option value="9">Jujuy</option>
                            <option value="16">La Pampa</option>
                            <option value="11">La Rioja</option>
                            <option value="7">Mendoza</option>
                            <option value="4">Misiones</option>
                            <option value="15">Neuquén</option>
                            <option value="17">Río Negro</option>
                            <option value="8">Salta</option>
                            <option value="12">San Juan</option>
                            <option value="22">San Luis</option>
                            <option value="19">Santa Cruz</option>
                            <option value="2">Santa Fe</option>
                            <option value="21">Santiago del Estero</option>
                            <option value="20">Tierra del Fuego</option>
                            <option value="23">Tucumán</option>
                          </select>
                        </FormGroup>

                        <FormGroup controlId="formTaxpayer">
                          <label htmlFor="taxpayerType" className="form-label">
                            {t("taxpayerType")}
                          </label>
                          <select
                            name="taxpayerType"
                            className="form-control"
                            id="taxpayerType"
                            onChange={this.handleInputChange}
                          >
                            <option value="false">No</option>
                            <option value="true">{t("yes")}</option>
                          </select>
                        </FormGroup>

                        <FormGroup controlId="formOtherTaxes">
                          <label htmlFor="otherTaxes" className="form-label">
                            {t("otherTaxes")}
                          </label>
                          <select
                            name="otherTaxes"
                            className="form-control"
                            id="otherTaxes"
                            onChange={this.handleInputChange}
                          >
                            <option value="false">No</option>
                            <option value="true">{t("yes")}</option>
                          </select>
                        </FormGroup>

                        <Row>&nbsp;</Row>
                        <MDBRow>
                          <MDBCol>
                            <Button variant="primary" type="submit">
                              {t("send")}
                            </Button>
                          </MDBCol>
                          <Col className="col-sm-5 text-right">
                            <App18 />
                          </Col>
                        </MDBRow>
                      </Form>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </Col>
          </Row>
        </MDBContainer>
      </div>
    );
  }
}

export default withTranslation()(RegisterForm);
