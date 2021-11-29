import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { deleteBroker, deleteTax, getBroker, putBrokerEdit } from "../api/api";
import NavBarPage from "./NavBarPage";
import HeaderWithStepsFull from "./HeaderWithStepsFull";
import Dialog from "react-bootstrap-dialog";

class BrokerEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      taxes: [],
      broker: null,
      isPublic:false,
      description:"",
      errors: [],
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  cancelAction = (event) => {
    this.props.history.push("/brokers");
  };

  setDialogDefaults(){
        Dialog.setOptions({
            defaultOkLabel: this.props.t("modalOkButton"),
            defaultCancelLabel: this.props.t("modalCancelButton"),
            primaryClassName: "btn-success",
            defaultButtonClassName: "btn-link",
        });
    }

    showDialog(title,body,func){
        this.dialog.show({
            title,
            body,
            actions: [
                Dialog.OKAction(() => func()),
                Dialog.CancelAction(() => console.log("Canceled!")),
            ],
            bsSize: "small",
            onHide: (dialog) => {
                dialog.hide();
            },
        });
    }

    confirmDelete = (event) => {
        event.preventDefault();
        this.setDialogDefaults();
        let id = event.target.id;
        this.showDialog(this.props.t("modalTitleConfirm"),
                        this.props.t("modelBodyMessage"),
                        () => this.removeBroker(id)
                        );
    }

    handleRemoveTax = (event) => {
        event.preventDefault();
        this.setDialogDefaults();
        let id = event.target.id;
        this.showDialog(this.props.t("modalTitleConfirm"),
                        this.props.t("modelBodyMessage"),
                        () => this.removeTax(id)
                        );
    }

    removeTax = (id) => {
        deleteTax(id)
            .then(() => {
                this.updateBroker();
            })
            .catch((responseError) => this.handleAPIError(responseError));
    }

    removeBroker = (id)  =>{
        deleteBroker(id)
            .then(() => {
                this.props.history.push("/brokers");
            })
            .catch((responseError) => this.handleAPIError(responseError));
    }

  componentDidMount() {
    this.state.id = this.props.match.params.brokerId;
    this.updateBroker();
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  handleChangeDescription = (event) => {
    this.setState({ description: event.target.value });
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });
  }

  submit = () => {
    putBrokerEdit(this.state.id, {
      name: this.state.name,
      description:this.state.description,
      isPublic:this.state.isPublic
    })
      .then(() => {
        this.props.history.push("/brokers");
      })
      .catch((responseError) => this.handleAPIError(responseError));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    var errors = [];

    // Check name of broker
    if (this.state.name === "") {
      errors.push("name");
    }

    // Check if description have more than 5 chars
    if (this.state.description.length<5) {
      errors.push("description");
    }

    this.setState({
      errors: errors,
    });

    if (errors.length > 0) {
      return false;
    } else {
      this.submit();
    }
  };

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  generate (){
    if (this.state.taxes.length === 0) {
      return <div align="center">{this.props.t("noTaxes")}</div>;
    } else {
      return this.state.taxes.map((each) => (
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto" id={each.id}>
            <a href={"/broker/"+ this.state.id + "/tax/" + each.id}>{each.name}</a>
          </div>
          <i
            className="fas fa-trash-alt "
            id={each.id}
            onClick={this.handleRemoveTax}
          ></i>
        </li>
      ));
    }
  }



  updateBroker = () => {
    getBroker(this.state.id)
      .then((aBroker) => {
        console.log(aBroker);
        this.setState({ name: aBroker.name,
                              description: aBroker.description,
                              taxes: aBroker.taxes,
                              isPublic:aBroker.isPublic });
      })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
  };

  toggleIsPublic = (event)=>{
    this.setState({"isPublic": event.target.checked});
    console.log(event.target);
  }
  render() {
    const { t } = this.props;
    const { brokerId } = this.props.match.params;

    return (
      <div >
        <NavBarPage />
        <div className="container">

            <Dialog
                ref={(component) => {
                    this.dialog = component;
                }}
            />

          <Form onSubmit={this.handleSubmit}>
            <Card>
              <HeaderWithStepsFull title={t("brokerEdit")} stepIndex={0}
                                   steps={[t("calculator"),t("taxes"),t("rules")]}
                                   stepRefs={["#", "#", "#"]}
                                   hereText={t("youAreHere")}
                                   pastText={t("pastSteps")}
                                   leftSteps={t("leftSteps")} />
              <Card.Body>
                <Row>
                  <Col lg="7" xs="7" md="7">
                    <Row>
                      <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="idValue">
                          <Form.Label>{t("id")}</Form.Label>
                          <Form.Control value={brokerId} />
                        </Form.Group>
                      </Row>


                      <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="nameValue">
                          <Form.Label>{t("name")}</Form.Label>
                          <Form.Control
                              onChange={this.handleChangeName}
                              value={this.state.name}
                              className={
                                this.hasError("name")
                                    ? "form-control is-invalid"
                                    : "form-control"
                              }
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
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="descriptionValue">
                          <Form.Label>{t("description")}</Form.Label>
                          <Form.Control  onChange={this.handleChangeDescription} value={this.state.description}
                                         className={
                                           this.hasError("description")
                                               ? "form-control is-invalid"
                                               : "form-control"
                                         }
                          />
                          <div
                              className={
                                this.hasError("description")
                                    ? "invalid-feedback"
                                    : "visually-hidden"
                              }
                          >
                            {t("descriptionInvalidFeedback")}
                          </div>
                        </Form.Group>

                      </Row>


                      <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="publicValue">
                          <div className="form-check">
                            <input name="isPublic"
                                   id="isPublic"
                                   className="form-check-input" type="checkbox"
                                   checked={this.state.isPublic ? "checked":null}
                                   value={this.state.isPublic}
                                   onChange={this.toggleIsPublic}
                            />
                            <label className="form-check-label" htmlFor="isPublic">
                              {t("isPublic")}
                            </label>
                          </div>
                        </Form.Group>

                      </Row>
                    </Row>
                  </Col>

                  <Col lg="5" xs="5" md="5">
                    <Card>
                      <Card.Header as="h5">
                        <div className="row">
                          <div className="col-sm-8">
                            <h5>{t("taxes")}</h5>
                          </div>
                          <div className="col-sm-4">
                            <NavLink to={"/broker/" + this.state.id + "/tax"}>
                              <Button title={t("brokerAddTax")} className={"btn-sm"}>
                                <i className="fa fa-plus"></i>
                              </Button>
                            </NavLink>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <ol className="list-group">{this.generate()}</ol>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Row class={"justify-content-start"}>
                  <Col className="justify-content-start text-left col-sm-10">
                    <Button variant="primary" type="submit">
                      {t("update")}
                    </Button>

                    <Button
                      variant="outline-primary"
                      type="cancel"
                      onClick={this.cancelAction}
                    >
                      {t("back")}
                    </Button>
                  </Col>
                  <Col>
                    <button className="btn btn-outline-danger"
                            onClick={this.confirmDelete}
                            id={this.state.id}
                    >
                      <i className="fa fa-trash"></i><span>{t("remove")}</span>
                    </button>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}

export default withTranslation()(BrokerEdit);
