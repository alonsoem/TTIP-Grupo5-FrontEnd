import {
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
} from "mdbreact";
import React, { Component } from "react";
import { Alert, Button, Col, Form, FormGroup, Row ,Card} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { getBroker, postCalc } from "../api/api";
import "./maincalc.css";
import NavBarPage from "./NavBarPage";
import i18next from "i18next";
import {FormattedNumber,IntlProvider} from 'react-intl';
import {toast} from "react-toastify";

class MainCalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      purchaseType: "NOAPARTADO",
      error: "",
      errorVisible: false,
      result: 0,
      brokerName: "",
      taxlist: [],
      needApartado:false,
      userFullName:"",
      userId:"",
      focusCalc:true,
      focusResult:false
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
    this.state.id = this.props.match.params.id;
    getBroker(this.state.id)
      .then((aBroker) => {
        console.log(aBroker);
        this.setState({
                            brokerName: aBroker.name,
                            description: aBroker.description,
                            userFullName: aBroker.userFullName,
                            userId: aBroker.userId,
                              needApartado: aBroker.taxes.flatMap(c=>c.rules).flatMap(d=>d.when).some((e)=>
                              {
                                const regExp = /\bapartado\b/g;
                                return regExp.test(e);
                              })
                            });
        })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  notify = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'colored',
    });
  }

  notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'colored',
    });
  }

  focusCalc= (event)=>{
    this.setState({focusCalc:true,focusResult:false});
  }

  focusResult(){
    this.setState({focusCalc:false,focusResult:true});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    postCalc({
      amount: this.state.amount,
      apartado: this.state.purchaseType,
      taxId: this.props.match.params.id,
    })
      .then((response) => {
        this.focusResult();
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
    this.notifyError(errorToDisplay);
  }

  showApartadoField = (t)=>{
    if (this.state.needApartado){
      return(

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
      )
    }
  }

  render() {
    const { t } = this.props;
    const {language} = i18next;


    const initials = (fullName) => {
      if (fullName==""){ return "..."}

      let names = fullName.split(" ");
      if (names.length>3){
        return names[0][0]+" "+names[1][0];
      }
      return names.map((n) => n[0].toUpperCase()).join(" ");
    }

    return (
      <div>
        <NavBarPage />
        <div className="container">
          <Card >
            <Card.Header className={"calculatorCard"}>
                  <h3 className="text-left"><b>{this.state.brokerName}</b></h3>
            </Card.Header>
            <Card.Body>

              <div className="card shadow-none border-light p-3" >
                <Row>


                   <Col className={"col-11  text-center"}>
                     <h5>{this.state.description}</h5>
                    </Col>
                    <Col className={"col-1 text-center"}>
                      <div className={"user-initials rounded-circle"} title={t("createdBy")+this.state.userFullName}>
                            <a href={"/brokers/"+ this.state.userId}>{initials(this.state.userFullName)}</a>
                      </div>
                   </Col>


                </Row>
              </div>




              <Row className="padding-5 justify-content-center">
                <Col className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
                  <Card className={"card "+(this.state.focusCalc?"bg-light":"")}>
                    <Card.Body>
                  <Form onSubmit={this.handleSubmit}>
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
                          onFocus={this.focusCalc}


                      />
                    </FormGroup>

                    {this.showApartadoField(t)}

                    <Row className="justify-content-center">
                      <Col className="justify-content-middle text-center">
                        <Button
                            variant="primary"
                            type="submit"
                            className="align-content-center"
                        >
                          {t("calculate")}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                    </Card.Body>
                  </Card>
                </Col>
                <Col id="appliedTaxesDiv"
                     className="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <Card className={"card "+(this.state.focusResult?"bg-info text-white":"")}>
                    <Card.Header>
                      {t("appliedTaxes")}
                    </Card.Header>
                    <Card.Body>
                      <MDBListGroup>
                        {this.state.taxlist.map((listitem) => (

                            <MDBListGroupItem
                                className="card-text"
                                key={listitem.taxId}
                            >
                              <Row>

                                <a
                                    href={listitem.taxUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                  <b>{listitem.taxDescription}</b>
                                </a>

                              </Row>
                              <Row >
                                <div className={"text-right"}>

                                <IntlProvider locale={language}>
                                  <FormattedNumber
                                      value={listitem.amount}
                                      style={"currency"}
                                      currency={"USD"}
                                      minimumFractionDigits={"2"}
                                      maximumFractionDigits={"2"}
                                  />
                                </IntlProvider>
                                </div>

                              </Row>


                            </MDBListGroupItem>
                        ))}
                        <MDBListGroupItem>
                        <Row>
                          <Col className={"col-2"}>
                            &nbsp;
                          </Col>

                          <Col className={"col-10 text-right"}>
                            <b>
                              <IntlProvider locale={language}>
                                <FormattedNumber
                                    value={this.state.result}
                                    style={"currency"}
                                    currency={"USD"}
                                    minimumFractionDigits={"2"}
                                    maximumFractionDigits={"2"}
                                />
                              </IntlProvider>
                            </b>
                          </Col>
                        </Row>
                        </MDBListGroupItem>

                      </MDBListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MainCalc);
