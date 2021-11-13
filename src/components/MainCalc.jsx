import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
} from "mdbreact";
import React, { Component } from "react";
import { Alert, Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { getBroker, postCalc } from "../api/api";
import "./maincalc.css";
import NavBarPage from "./NavBarPage";
import i18next from "i18next";

class MainCalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      purchaseType: "NOAPARTADO",
      error: "",
      errorVisible: false,
      result: undefined,
      brokerName: "",
      taxlist: [],
    };

    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangePurchaseType = this.handleChangePurchaseType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeAmount = (event) => {
    event.preventDefault();
    let newAmount = "";
    const newChars = event.target.value;
    if (!isNaN(newChars)) {
      newAmount = newChars;
    }
    this.setState({ amount: newAmount });
  };

  handleChangePurchaseType = (event) => {
    this.setState({ purchaseType: event.target.value });
  };

  componentDidMount() {
    if (!sessionStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.state.id = this.props.match.params.id;
    getBroker(this.state.id)
      .then((aBroker) => {
        this.setState({ brokerName: aBroker.name });
      })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
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
      taxId: this.props.match.params.id,
    })
      .then((response) => {
        const taxNames = response.detail.filter((detail) => detail.amount > 0);
        this.setState({
          result: response.totalAmount,
          taxlist: taxNames,
        });
      })
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
    const {language} = i18next;
    const formats = {
      number: {
        ARS: {
          style: 'currency',
          currency: '$'
        },
        USD: {
          style: 'currency',
          currency: 'USD'
        }
      }
    };

    return (
      <div className={"bg"}>
        <NavBarPage />
        <div className="container-fluid">
          <div className="container">
            <Row className="padding-5 justify-content-center">
              <Col className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                <MDBCard>
                  <MDBCardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <div className="card-header">
                        <h4 className="text-center">{this.state.brokerName}</h4>
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
                          icon="dollar-sign"
                          onChange={this.handleChangeAmount}
                          value={this.state.amount}
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
                        <Col>
                          <MDBInput
                            type="text"
                            label={t("result")}
                            icon="dollar-sign"
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
                <MDBCard className="card text-white bg-info">
                  <MDBCardHeader className="card-header">
                    <h4>{t("appliedTaxes")}</h4>
                  </MDBCardHeader>
                  <MDBCardBody className="card-body">
                    <MDBListGroup>
                      {this.state.taxlist.map((listitem) => (

                            <MDBListGroupItem
                                className="card-text"
                                key={listitem.taxId}
                            >
                              <a
                                  href={listitem.taxUrl}
                                  target="_blank"
                                  rel="noreferrer noopener"
                              >
                                <b>{listitem.taxDescription}</b>
                              </a>
                              <br />
                              {t("amount")}: {listitem.amount}
                            </MDBListGroupItem>
                            ))}
                          </MDBListGroup>
                          </MDBCardBody>
                </MDBCard>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MainCalc);
