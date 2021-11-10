import { MDBCard, MDBCardBody } from "mdbreact";
import React, { Component } from "react";
import { Alert, Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { getProfile, postProfile } from "../api/api";
import App18 from "../App18";
import "./loginform.css";
import NavBarPage from "./NavBarPage";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      province: "",
      taxpayerType: "",
      otherTaxes: "",
      error: "",
      errorVisible: false,
      username: "",
    };

    this.username = localStorage.getItem("username");
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const obj = {};
    obj[key] = value;
    this.setState(obj);
  };

  showAlert() {
    this.setState({ errorVisible: true });
    setTimeout(() => this.setState({ errorVisible: false }), 3000);
  }

  updateStateAndSelects = (userData) => {
    const prov = userData.province,
      ri = String(userData.isResponsableInscripto),
      ganancias = String(userData.isgananciasYBienesP);

    this.setState({
      province: prov,
      taxpayerType: ri,
      otherTaxes: ganancias,
    });

    document.querySelector('#province [value="' + prov + '"]').selected = true;
    document.querySelector(
      '#taxpayerType [value="' + ri + '"]'
    ).selected = true;
    document.querySelector(
      '#otherTaxes [value="' + ganancias + '"]'
    ).selected = true;
  };

  componentDidMount() {
    getProfile(this.username)
      .then((response) => this.updateStateAndSelects(response))
      .catch((responseError) => this.handleAPIError(responseError));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    postProfile({
      username: this.username,
      province: this.state.province,
      isResponsableInscripto: this.state.taxpayerType,
      isgananciasYBienesP: this.state.otherTaxes,
    })
      .then((response) => this.updateStateAndSelects(response))
      .catch((responseError) => this.handleAPIError(responseError));
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }

    this.setState({ error: errorToDisplay });
    this.showAlert();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="container-fluid bg">
        <NavBarPage />
        <div className="container">
          <Row className="padding-5 justify-content-center">
            <Col className="col-12 col-sm-4 col-lg-6 col-xl-6">
              <MDBCard>
                <MDBCardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="card-header">
                      <h3 className="text-center text-monospace text-black">
                        {t("profileFormTitle")}
                      </h3>
                    </div>
                    <br />

                    <Alert
                      className="alert alert-dismissible"
                      variant="danger"
                      show={this.state.errorVisible}
                    >
                      {this.state.error}
                    </Alert>

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
                        <option value="BUENOS_AIRES">Buenos Aires</option>
                        <option value="CABA">Capital Federal</option>
                        <option value="CATAMARCA">Catamarca</option>
                        <option value="CHACO">Chaco</option>
                        <option value="CHUBUT">Chubut</option>
                        <option value="CORDOBA">Córdoba</option>
                        <option value="CORRIENTES">Corrientes</option>
                        <option value="ENTRE_RIOS">Entre Ríos</option>
                        <option value="FORMOSA">Formosa</option>
                        <option value="JUJUY">Jujuy</option>
                        <option value="LA_PAMPA">La Pampa</option>
                        <option value="LA_RIOJA">La Rioja</option>
                        <option value="MENDOZA">Mendoza</option>
                        <option value="MISIONES">Misiones</option>
                        <option value="NEUQUEN">Neuquén</option>
                        <option value="RIO_NEGRO">Río Negro</option>
                        <option value="SALTA">Salta</option>
                        <option value="SAN_JUAN">San Juan</option>
                        <option value="SAN_LUIS">San Luis</option>
                        <option value="SANTA_CRUZ">Santa Cruz</option>
                        <option value="SANTA_FE">Santa Fe</option>
                        <option value="SANTIAGO_DEL_ESTERO">
                          Santiago del Estero
                        </option>
                        <option value="TIERRA_DEL_FUEGO">
                          Tierra del Fuego
                        </option>
                        <option value="TUCUMAN">Tucumán</option>
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
                      <Col className="col-sm-5">
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

export default withTranslation()(UserProfile);
