import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { deleteTax, getTax, putTaxEdit} from "../api/api";
import DragTest from "./dragTest";
import NavBarPage from "./NavBarPage";
import HeaderWithStepsFull from "./HeaderWithStepsFull";


class Taxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      url: "",
      rules: [],
      errors: [],
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getAllRules() {
    return (
      <DragTest
        taxRules={this.state.rules.map((e) => ({ id: e.id, name: e.name }))}
        context={this}
      />
    );
  }

  cancelAction = (event) => {
    event.preventDefault();
    this.props.history.goBack();
    //this.props.history.push("/broker");
  };

  componentDidMount() {
    if (!sessionStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.state.id = this.props.match.params.id;
    this.update();
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };
  handleChangeUrl = (event) => {
    this.setState({ url: event.target.value });
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });
  }

  submit = () => {
    putTaxEdit(this.state.id, {
      name: this.state.name,
      url: this.state.url,
    })
      .then((response) => {
        this.props.history.push("/broker");
      })
      .catch((responseError) => this.handleAPIError(responseError));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    var errors = [];

    // Check name of user
    if (this.state.name === "") {
      errors.push("name");
    }

    // Check email address
    const expression =
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

    var validExpression = expression.test(String(this.state.url).toLowerCase());
    if (!validExpression) {
      errors.push("url");
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

  update() {
    getTax(this.state.id)
      .then((aTax) => {
        this.setState({ name: aTax.name, url: aTax.url, rules: aTax.rules });
      })

      .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  deleteAction = (event) => {
    event.preventDefault();
    deleteTax(event.target.id)
        .then((response) => {
          this.props.history.push("/broker");
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  render() {
    const { t } = this.props;
    const idTax = this.props.match.params.id;

    return (
      <div className={"bg"}>
        <NavBarPage />
        <div className="container">
          <Form onSubmit={this.handleSubmit}>
          <Card>
              <HeaderWithStepsFull title={t("taxEdit")} stepIndex={1} steps={[t("calculator"),t("taxEdit"),t("ruleCreate")]} hereText={t("youAreHere")} leftSteps={t("leftSteps")} />
            <Card.Body>

                <Row>
                  <Col lg="7" xs="7" md="7">
                    <Row>
                      <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="idValue">
                          <Form.Label>{t("id")}</Form.Label>
                          <Form.Control value={idTax} />
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
                        <Form.Group className="mb-3" controlId="urlValue">
                          <Form.Label>{t("url")}</Form.Label>
                          <Form.Control
                            onChange={this.handleChangeUrl}
                            value={this.state.url}
                            className={
                              this.hasError("url")
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                          />
                          <div
                            className={
                              this.hasError("url")
                                ? "invalid-feedback"
                                : "visually-hidden"
                            }
                          >
                            {t("invalidUrl")}
                          </div>
                        </Form.Group>
                      </Row>
                    </Row>
                  </Col>

                  <Col lg="4" xs="4" md="4">
                    <Card>
                      <Card.Header as="h5">
                        <div className="row">
                          <div className="col-sm-8">
                          <h5>{t("rules")}</h5>
                          </div>
                          <div className="col-sm-4">
                            <NavLink to={"/rule/" + this.state.id}>
                              <Button title={t("taxAddRule")} class={"btn-sm"}>
                                <i className="fa fa-plus"></i>
                              </Button>
                            </NavLink>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup defaultActiveKey="#link1">
                          {" "}
                          {this.getAllRules()}
                        </ListGroup>
                        <br />
                        <p>
                          <b>{t("ruleApplication")}</b>
                        </p>
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
                <Col className={"sm-1"}>
                  <Button
                      variant="outline-danger"
                      onClick={this.deleteAction}
                      id={this.state.id}
                  >
                    <i className="fa fa-trash"></i>&nbsp;
                    {t("remove")}
                  </Button>
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

export default withTranslation()(Taxes);
