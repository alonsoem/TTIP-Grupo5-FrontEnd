import React from "react";
import { withTranslation } from "react-i18next";
import {postBrokerCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Col} from "react-bootstrap";
import HeaderWithStepsFull from "./HeaderWithStepsFull";


class BrokerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      errorVisible: false,
      isPublic:false,
      taxName: "",
      description:"",

    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  cancelAction=(event)=>{
    this.props.history.push("/myBrokers");
  }

  submit = () =>{
    postBrokerCreate({
      name: this.state.taxName,
      description:this.state.description,
      isPublic:this.state.isPublic
    })
        .then((response) => {
          this.props.history.push("/broker/"+response.id);
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

  handleChangeName = (event) => {
    this.setState({ taxName: event.target.value });
  };

    handleChangeDescription= (event) => {
        this.setState({ description: event.target.value });
    };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });
  }

    toggleIsPublic = (event)=>{
        this.setState({"isPublic": event.target.checked});
    }

  render() {
    const { t } = this.props;


    return (
      <div >
        <NavBarPage />
          <div className="container">
            <Form onSubmit={this.handleSubmit}>
          <Card>

              <HeaderWithStepsFull title={t("brokerNew")} stepIndex={0} steps={[t("calculator"),t("taxCreate"),t("ruleCreate")]}
                                   stepRefs={["#", "#", "#"]}
                                   pastText={t("pastSteps")}
                                   hereText={t("youAreHere")} leftSteps={t("leftSteps")} />

            <Card.Body>
                <div className={"container"}>

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

                                   value={this.state.isPublic}
                                   onChange={this.toggleIsPublic}
                            />
                            <label className="form-check-label" htmlFor="isPublic">
                                {t("isPublic")}
                            </label>
                        </div>
                    </Form.Group>

                </Row>
            </div>





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
