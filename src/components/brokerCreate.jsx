import React from "react";
import { withTranslation } from "react-i18next";
import {postBrokerCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Col} from "react-bootstrap";


class BrokerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      errorVisible: false,
      taxName: "",

    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
  }

  cancelAction=(event)=>{
    this.props.history.push("/broker");
  }

  submit = () =>{
    postBrokerCreate({
      name: this.state.taxName,
    })
        .then((response) => {
          this.props.history.push("/broker/edit/"+response.id);
        })
        .catch((responseError) => this.handleAPIError(responseError));

  }

  handleSubmit = (event) => {
    event.preventDefault();
    var errors = [];

    // Check name of user
    if (this.state.taxName === "") {
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

  render() {
    const { t } = this.props;


    return (
      <div>
        <NavBarPage />
        <div className="container-fluid">
            <Form onSubmit={this.handleSubmit}>
          <Card>
            <Card.Header as="h5">
                <h5>{t("brokerNew")}</h5>
                <div className="row">
                    <p className="fs-6">
                        <ul className="breadcrumb">
                            <li className="active" title={t("youAreHere")}><a href="javascript:void(0);"><b>1. Calculator</b></a></li>
                        </ul>
                    </p>
                </div>
            </Card.Header>
            <Card.Body>

                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="nameValue">
                    <Form.Label>{t("name")}</Form.Label>
                    <Form.Control  onChange={this.handleChangeName} value={this.state.taxName}
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






            </Card.Body>
              <Card.Footer>
                  <Row class={"justify-content-start"}>
                      <Col className="justify-content-start text-left">
                          <Button variant="primary" type="submit">
                              {t("save")}
                          </Button>

                          <Button variant="outline-primary" type="cancel" onClick={this.cancelAction}>
                              {t("cancel")}
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

export default withTranslation()(BrokerCreate);
