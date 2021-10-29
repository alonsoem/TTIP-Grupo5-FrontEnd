import React from "react";
import { withTranslation } from "react-i18next";
import {postTaxCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Col} from "react-bootstrap";

class TaxCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url:"",
      name: "",
      errors:[],
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
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
  cancelAction=(event)=>{
    this.props.history.push("/broker/edit/"+this.props.match.params.id);

  }

  submit = () => {
    postTaxCreate(this.props.match.params.id,
                {
                      name: this.state.name,
                      url: this.state.url
                })
        .then((response) => {
          this.props.history.push("/broker/edit/"+ this.props.match.params.id);
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
    const expression = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

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

  render() {
    const { t } = this.props;


    return (
      <div>
        <NavBarPage />
        <div className="container-fluid">

          <Card>
            <Card.Header as="h5">{t("taxCreate")}</Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="nameValue">
                    <Form.Label>{t("name")}</Form.Label>
                    <Form.Control onChange={this.handleChangeName} value={this.state.name}
                                  className={
                                    this.hasError("name")
                                        ? "form-control is-invalid"
                                        : "form-control"
                                  }/>
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
                    <Form.Control  onChange={this.handleChangeUrl} value={this.state.url}
                                   className={
                                     this.hasError("url")
                                         ? "form-control is-invalid"
                                         : "form-control"
                                   }/>
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
              </Form>
            </Card.Body>
          </Card>

        </div>
      </div>
    );
  }
}

export default withTranslation()(TaxCreate);
