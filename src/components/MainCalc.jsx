import { MDBCard, MDBCardBody, MDBInput } from "mdbreact";
import React, { Component } from "react";
import { Alert, Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { postCalc } from "../api/api";
import App18 from "../App18";
import "./maincalc.css";
import NavBarPage from "./NavBarPage";

class MainCalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: undefined,
      purchaseType: "NOAPARTADO",
      error: "",
      errorVisible: false,
      result: undefined,
    };

    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangePurchaseType = this.handleChangePurchaseType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeAmount = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleChangePurchaseType = (event) => {
    this.setState({ purchaseType: event.target.value });
  };

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login');
    }
  }

  showAlert() {
    this.setState({ errorVisible: true });
    setTimeout(() => this.setState({ errorVisible: false }), 3000);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    postCalc({
      amount: this.state.amount,
      apartado: this.state.purchaseType,
      taxId: 4,
    })
      .then((response) => {
        this.setState({ result: response.totalAmount });
      })
      .catch((responseError) => this.handleAPIError(responseError));
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status===0){
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });
    this.showAlert();

  }

  render() {
    const { t } = this.props;

    return (
        <div>
          <NavBarPage />
          <div className="container-fluid">

        <div className="container">

          <Row className="padding-5 justify-content-center">
            <Col className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
              <MDBCard>
                <MDBCardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="card-header">
                      <h4 className="text-center text-monospace text-black">
                        {t("maincalcTitle")}
                      </h4>
                    </div>
                    <br />
                    <Alert
                      className="alert alert-dismissible"
                      variant="danger"
                      show={this.state.errorVisible}
                    >
                      {this.state.error}
                    </Alert>
                    <FormGroup controlId="formBasicAmount">
                      <MDBInput
                        type="text"
                        label={t("amount")}
                        onChange={this.handleChangeAmount}
                      />
                    </FormGroup>

                    <FormGroup controlId="formBasicPurchaseType">
                      <label htmlFor="purchaseType" className="form-label">
                        {t("purchaseType")}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="http://biblioteca.afip.gob.ar/pdfp/RG_4240_AFIP_A2.pdf"
                        >
                          {t("typeReference")}
                        </a>
                      </label>
                      <select
                        name="purchaseType"
                        className="form-control"
                        id="purchaseType"
                        onChange={this.handleChangePurchaseType}
                      >
                        <option value="NOAPARTADO">{t("none")}</option>
                        <option value="APARTADOA">A</option>
                        <option value="APARTADOB">B</option>
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
                    <br />
                    <Row className="justify-content-left">
                      <Col className="text-center">
                        <MDBInput
                          type="text"
                          label={t("result")}
                          readOnly
                          value={this.state.result}
                        />
                      </Col>
                    </Row>
                    <br />

                  </Form>
                </MDBCardBody>
              </MDBCard>
            </Col>
            <Col
              id="appliedTaxesDiv"
              className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4"
            >
              <div className="card text-white bg-info">
                <div className="card-header">
                  <h4>{t("appliedTaxes")}</h4>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Impuesto 1</h5>
                  <p className="card-text text-white">Resumen</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
        </div>

    );
  }
}

export default withTranslation()(MainCalc);
