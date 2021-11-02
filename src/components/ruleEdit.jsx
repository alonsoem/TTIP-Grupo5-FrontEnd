import React from "react";
import {Card, Row, Form, Button, Col} from "react-bootstrap";
import FactList from "./factList";
import { withTranslation } from "react-i18next";
import {deleteRule, getRule, putRuleEdit} from "../api/api";
import NavBarPage from "./NavBarPage";
import HeaderWithSteps from "./HeaderWithSteps";
const math = require('mathjs');




class RuleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:0,
      name: "",
      description:"",
      when:[],
      then:[],
      priority:0,
      errors:[],
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangePriority = this.handleChangePriority.bind(this);
    this.handleChangeThen = this.handleChangeThen.bind(this);

  }

  validateExpression(expression) {
      console.log(expression);
      const scope={amount:10,iva:21,pais30:30,pais8:8,apartado:20,apartadoClass:10};
      try {
          math.evaluate(expression,scope);
          console.log("TRUE");
          return true;

      }catch (e){
          console.log("FALSE");
          console.log(e);
          return false;

      }
  }
  cancelAction=(event)=>{
      event.preventDefault();
      this.props.history.goBack();
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.state.id=this.props.match.params.id
    getRule(this.state.id)
        .then(rule => {
          this.setState({name: rule.name,description:rule.description,priority:rule.priority,
              when:[...rule.when],
              then:this.handleLoadArray(rule.then)});
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));

  }

  handleLoadArray(array){
      return array.join();
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };
  handleChangeUrl = (event) => {
    this.setState({ url: event.target.value });
  };

    handleChangeDescription = (event) => {
        this.setState({ description: event.target.value });
    };
    handleChangePriority = (event) => {
        this.setState({ priority: event.target.value });
    };
    handleChangeThen = (event) => {
        this.setState({ then:  event.target.value });

    };


    handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });

  }

  submit = () => {
    putRuleEdit(this.state.id,
         {
                name: this.state.name,
                description: this.state.description,
                priority: this.state.priority.valueOf(),
                when: this.state.when,
                then: [this.state.then],
        })
        .then((response) => {
          this.props.history.push("/broker");
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

    getWhenList(t) {
        return this.state.when.map((condition,i) =>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId={"whenValue"+i}>
                        <Form.Label>{t("whenCondition")} #{i}</Form.Label>
                        <Form.Control  value={condition} onChange={e => this.handleInputChange(e, i)}

                                       className={
                                           this.hasError("when" +i)
                                               ? "form-control is-invalid"
                                               : "form-control"
                                       }/>
                        <div
                            className={
                                this.hasError("when" + i)
                                    ? "invalid-feedback"
                                    : "visually-hidden"
                            }
                        >
                            {t("whenInvalidFeedback")}
                        </div>
                    </Form.Group>
                </Col>
                <Col>
                    <div className={"btn-box"}>
                        {this.state.when.length !== 1 &&
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.handleRemoveClick(i)}>
                            <i className="fas fa-minus fa-2x"></i></button>
                        }
                        {this.state.when.length - 1 === i &&
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.handleAddClick(i)}>
                            <i className="fas fa-plus fa-2x"></i></button>
                        }
                    </div>

                </Col>

            </Row>

        );
    }


    handleInputChange = (e, index) => {

        const {value } = e.target;
        const list = [...this.state.when];
        list[index] = value;
        this.setState({when:list});
    };

    handleRemoveClick = index => {
        const list = [...this.state.when];
        list.splice(index, 1);
        this.setState({when:list});
    };

    handleAddClick = () => {
        this.setState({when:[...this.state.when,'']});
    }


    handleSubmit = (event) => {
        event.preventDefault();
        var errors = [];


        // Check name of Rule
        if (this.state.name === "") {
            errors.push("name");
        }

        // Check description of Rule
        if (this.state.description.length<=3) {
            errors.push("description");
        }

        const expression = /^-{0}?\b([1-9]|10)\b/;
        var validExpression = expression.test(String(this.state.priority).toLowerCase());
        if (!validExpression) {
            errors.push("priority");
        }

        if (this.state.when.length > 0){

            this.state.when.forEach((anExpression, index) => {
                    if (anExpression===""){
                        errors.push("when"+ index)
                    }
                    if (!this.validateExpression(anExpression)) {
                        errors.push("when" + index);
                    }
                }
            )
        }else {
            errors.push("when"+0);
        }

        if (this.state.then.length > 0) {
            if (!this.validateExpression(this.state.then)) {
                errors.push("then");
            }
        }else{
            errors.push("then")
        }

        this.setState({
            errors,
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

    deleteAction = (event) => {
        event.preventDefault();
        deleteRule(event.target.id)
            .then((response) => {
                this.props.history.push("/broker");
            })
            .catch((responseError) => this.handleAPIError(responseError));
    };
  render() {
    const { t } = this.props;



      return (

      <div>
        <NavBarPage />
          <div className="container">
            <Form onSubmit={this.handleSubmit}>
          <Card>
            <HeaderWithSteps title={t("brokerEdit")} steps={[t("calculator"),t("tax"),t("ruleEdit")]} hereText={t("youAreHere")} backText={t("backToStep")} />
            <Card.Body>




                  <Row>
                      <Col>
                          <Row className="mb-3">
                              <Form.Group className="mb-3" controlId="nameValue">
                                  <Form.Label>{t("name")}</Form.Label>
                                  <Form.Control  onChange={this.handleChangeName} value={this.state.name}
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
                                      {t("nameInvalidFeedback")}
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
                                                 }/>
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
                              <Form.Group className="mb-3" controlId="priorityValue">
                                  <Form.Label>{t("priority")}</Form.Label>
                                  <Form.Control  onChange={this.handleChangePriority} value={this.state.priority}
                                                 className={
                                                     this.hasError("priority")
                                                         ? "form-control is-invalid"
                                                         : "form-control"
                                                 }/>
                                  <div
                                      className={
                                          this.hasError("priority")
                                              ? "invalid-feedback"
                                              : "visually-hidden"
                                      }
                                  >
                                      {t("priorityInvalidFeedback")}
                                  </div>
                              </Form.Group>
                          </Row>
                          <Row className="mb-3">
                              <Form.Group className="mb-3" controlId="whenValue">
                                  <Form.Label>{t("when")}</Form.Label>
                                  {this.getWhenList(t)}

                              </Form.Group>
                          </Row>
                          <Row className="mb-3">
                              <Form.Group className="mb-3" controlId="thenValue">
                                  <Form.Label>{t("then")}</Form.Label>
                                  <Form.Control onChange={this.handleChangeThen} value={this.state.then}
                                                 className={
                                                     this.hasError("then")
                                                         ? "form-control is-invalid"
                                                         : "form-control"
                                                 }/>
                                  <div
                                      className={
                                          this.hasError("then")
                                              ? "invalid-feedback"
                                              : "visually-hidden"
                                      }
                                  >
                                      {t("thenInvalidFeedback")}
                                  </div>
                              </Form.Group>


                          </Row>

                      </Col>

                      <Col lg="4" xs="4" md="4">
                          <Row>
                              <div>
                              <Card>
                                  <Card.Header>
                                      {t("allowedFacts")}
                                  </Card.Header>
                                  <Card.Body>

                                          <FactList/>

                                  </Card.Body>
                              </Card>
                              </div>
                          </Row>
                      </Col>
                  </Row>

            </Card.Body>
              <Card.Footer>
                  <Row class={"justify-content-start"}>
                      <Col className="justify-content-start text-left col-sm-10">
                          <Button variant="primary" type="submit">
                              {t("save")}
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

export default withTranslation()(RuleEdit);
