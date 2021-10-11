import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { getBroker, postTaxCreate } from "../api/api";
import NavBarPage from "./NavBarPage";

class Taxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      taxes: [],
      broker: null,
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  cancelAction = (event) => {
    this.props.history.push("/broker");
  };

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.setState({ id: this.props.match.params.id });
    getBroker(this.state.id)
      .then((aBroker) => {
        this.setState({ name: aBroker.name, taxes: aBroker.taxes });
      })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  handleChangeName = (event) => {
    this.setState({ taxName: event.target.value });
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    postTaxCreate({
      name: this.state.taxName,
    })
      .then((response) => {
        this.props.history.push("/broker");
      })
      .catch((responseError) => this.handleAPIError(responseError));
  };

  generate() {
    return this.state.taxes.map((each) => (
      <ListGroup.Item action>{each.name}</ListGroup.Item>
    ));
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
                          <Form.Control value={id} />
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="nameValue">
                          <Form.Label>{t("name")}</Form.Label>
                          <Form.Control
                            onChange={this.handleChangeName}
                            value={this.state.name}
                          />
                        </Form.Group>
                      </Row>
                    </Row>
                  </Col>

                  <Col lg="4" xs="4" md="4">
                    <Row>
                      <NavLink to={"/broker/edit/" + this.state.id + "/tax"}>
                        {t("brokerAddTax")}
                      </NavLink>
                    </Row>
                    <Row>
                      <ListGroup defaultActiveKey="#link1">
                        {" "}
                        {this.generate()}{" "}
                      </ListGroup>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Button variant="primary" type="submit">
                    {t("save")}
                  </Button>

                  <Button
                    variant="outline-primary"
                    type="cancel"
                    onClick={this.cancelAction}
                  >
                    {t("cancel")}
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Taxes);
