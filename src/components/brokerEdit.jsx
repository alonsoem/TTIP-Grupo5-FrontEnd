import React from "react";
import { withTranslation } from "react-i18next";
import {deleteTax, getBroker, putBrokerEdit} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Col} from "react-bootstrap";
import {NavLink} from "react-router-dom";

class BrokerEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:0,
      name: "",
      taxes:[],
      broker:null,
      errors:[],
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  cancelAction=(event)=>{
    this.props.history.push("/broker");

  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }

    this.state.id= this.props.match.params.id;
    this.updateBroker();
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });

  }

  submit = () =>{
    putBrokerEdit(this.state.id,{
      name: this.state.name,
    })
        .then((response) => {
          this.props.history.push("/broker");
        })
        .catch((responseError) => this.handleAPIError(responseError));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    var errors = [];

    // Check name of broker
    if (this.state.name === "") {
      errors.push("name");
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


  generate() {
    return this.state.taxes.map((each) =>

          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto"  id={each.id}>
              <a href={"/tax/edit/"+each.id}>{each.name}</a>
            </div>
            <i className="fas fa-trash-alt " id={each.id} onClick={this.removeTax}></i>
          </li>

    );
  }

  removeTax=(event) =>{
    event.preventDefault();
    deleteTax(event.target.id)
        .then(() => {
          this.updateBroker();
        })
        .catch((responseError) => this.handleAPIError(responseError));
  }

  updateBroker = ()=>{
    getBroker(this.state.id)
        .then(aBroker => {
          this.setState({name: aBroker.name,taxes:aBroker.taxes});
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  render() {
    const { t } = this.props;
    const { id } = this.props.match.params;

      return (

      <div>
        <NavBarPage />
        <div className="container-fluid">

          <Card>
            <Card.Header as="h5">{t("brokerEdit")}</Card.Header>
            <Card.Body>


              <Form onSubmit={this.handleSubmit}>
                <Row>
                <Col lg="7" xs="7" md="7">
                  <Row>
                    <Row className="mb-3">
                      <Form.Group className="mb-3" controlId="idValue">
                        <Form.Label>{t("id")}</Form.Label>
                        <Form.Control value={id}/>
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
                    </Row>
                  </Col>

                  <Col lg="4" xs="4" md="4">
                    <Card>
                      <Card.Header as="h5">
                          <div className="row">
                              <div className="col-sm-8">{t("brokerAddTax")}</div>
                              <div className="col-sm-4">
                                  <NavLink to={"/broker/edit/" + this.state.id + "/tax"}>
                                      <Button variant="primary"  class={"w-100"}>
                                          <i className="fa fa-plus"></i>
                                      </Button>
                                  </NavLink>
                              </div>
                          </div>
                        </Card.Header>
                      <Card.Body>
                        <ol className="list-group">
                          {this.generate()}
                        </ol>
                      </Card.Body>
                    </Card>

                  </Col>
                </Row>

                <Row class={"justify-content-start"}>
                  <Col className="justify-content-start text-left">
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
                </Row>

              </Form>
            </Card.Body>
          </Card>

        </div>
      </div>
    );
  }


}

export default withTranslation()(BrokerEdit);
