import * as md5 from "md5";
import { MDBCard, MDBCardBody, MDBInput } from "mdbreact";
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
import { postLogin } from "../api/api";
import App18 from "../App18";
import alecicon from "../static/alecicon.png";
import "./loginform.css";
import {NavLink} from "react-router-dom";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      errorVisible: false,
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleChangePassword = (event) => {
    let encPwd = md5(event.target.value);
    this.setState({ password: encPwd });
  };

  showAlert() {
    this.setState({ errorVisible: true });
    setTimeout(() => this.setState({ errorVisible: false }), 3000);
  }

  componentDidMount() {
    console.log("MONT");
      sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("username");
  }

  handleSubmit = (event) => {
    event.preventDefault();
    postLogin({ username: this.state.email, password: this.state.password })
      .then((response) => {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("userId", response.id);
        sessionStorage.setItem("username", this.state.email);
        this.props.history.push("/");
      })
      .catch((responseError) => this.handleAPIError(responseError));
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    if (responseError.response && responseError.response.status === 401) {
      errorToDisplay = this.props.t("invalidCredentials");
    }
    this.setState({ error: errorToDisplay });
    this.showAlert();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="container-fluid bg">
        <div className="container">
          <Row className="padding-5 justify-content-center">
            <Col className="col-12 col-sm-4 col-lg-6 col-xl-6">
              <MDBCard>
                <MDBCardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="card-header">
                      <h3 className="text-center text-black">
                        {t("loginTitle")}
                      </h3>
                    </div>
                    <br />
                    <Row className="justify-content-center justify-content-sm-center justify-content-lg-center justify-content-md-center justify-content-xl-center vertical">
                      <Col className="col-6 ">
                        <Image
                          title="Accounting Light Extensible Calculator"
                          src={alecicon}
                          width="100%"
                          height="100%"
                        />
                      </Col>
                    </Row>
                    <br />
                    <Alert
                      className="alert alert-dismissible"
                      variant="danger"
                      show={this.state.errorVisible}
                    >
                      {this.state.error}
                    </Alert>
                    <FormGroup controlId="formBasicEmail">
                      <MDBInput
                        type="text"
                        label={t("email")}
                        icon="envelope"
                        placeholder={t("email_help")}
                        onChange={this.handleChangeEmail}
                      />
                    </FormGroup>

                    <FormGroup controlId="formBasicPassword">
                      <MDBInput
                        type="password"
                        label={t("password")}
                        icon="lock"
                        placeholder={t("password_help")}
                        onChange={this.handleChangePassword}
                      />
                    </FormGroup>

                    <Row className="justify-content-center">
                      <Col className="justify-content-middle text-center">
                        <Button
                          variant="primary"
                          type="submit"
                          className="align-content-center"
                        >
                          {t("send")}
                        </Button>
                      </Col>
                    </Row>

                    <Row>&nbsp;</Row>

                    <Row className="justify-content-center">
                      <Col className="col-sm-5 align-content-md-center text-center">
                        <NavLink className="btn btn-outline-link" to="/register">
                          {t("register")}
                        </NavLink>
                      </Col>
                      <Col className="col-sm-5 align-content-md-center text-center">
                        <App18 />
                      </Col>
                    </Row>
                  </Form>
                </MDBCardBody>
              </MDBCard>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withTranslation()(LoginForm);
