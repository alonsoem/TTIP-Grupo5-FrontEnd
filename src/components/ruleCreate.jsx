import React from "react";
import {postRuleCreate} from "../api/api";
import { withTranslation } from "react-i18next";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Col} from "react-bootstrap";
import FactList from "./factList";
const math = require('mathjs');


class RuleCreate extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      id:0,
      when: [""],
      then: [],
      name: "",
      description: "",
      priority: 1,
      errors:[],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangePriority = this.handleChangePriority.bind(this);
    this.handleChangeWhen = this.handleChangeWhen.bind(this);
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

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
  }

  cancelAction=(event)=>{
    this.props.history.push("/tax/edit/"+this.props.match.params.id);

  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };
  handleChangeDescription = (event) => {
    this.setState({ description: event.target.value });
  };
  handleChangePriority = (event) => {
    this.setState({ priority: event.target.value });
  };
  handleChangeWhen = (event) => {
    this.setState({ when: event.target.value });
  };
  handleChangeThen = (event) => {
    this.setState({ then: event.target.value });
  };
  
  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });

  }

  submit = () => {
    postRuleCreate(this.props.match.params.id,
        {
          name: this.state.name,
          description: this.state.description,
          priority: this.state.priority.valueOf(),
          when: this.state.when,
          then: [this.state.then],
    })
        .then((response) => {
          this.props.history.push("/tax/edit/"+this.props.match.params.id);
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  getWhenList(t) {
    return this.state.when.map((condition,i) =>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId={"whenValue"+i}>
              <Form.Label>{t("whenCondition")} #{i}</Form.Label>
              <Row class={"align-middle"}>
                <Col>
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
                </Col>
                <Col>
                  <div className={"btn-box"}>
                    {this.state.when.length !== 1 &&
                    <Button variant="secondary" onClick={() => this.handleRemoveClick(i)} type="button">-</Button>}
                    {this.state.when.length - 1 === i &&
                    <Button variant="secondary" onClick={()=>this.handleAddClick()} type="button">+</Button>}
                  </div>
                </Col>
              </Row>
            </Form.Group>
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
        if (this.state.description.length <= 3) {
            errors.push("description");
        }

        const expression = /^-{0}?\b([1-9]|10)\b/;
        var validExpression = expression.test(String(this.state.priority).toLowerCase());
        if (!validExpression) {
            errors.push("priority");
        }

        if (this.state.when.length > 0){

            this.state.when.forEach((anExpression, index) => {
                    if (anExpression==""){
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
            <Card.Header as="h5">{t("ruleCreate")}</Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
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

                    <Form.Control  onChange={this.handleChangePriority} value={this.state.priority} variant="outlined"
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
                    <div className="form-group">
                      <label>{t("when")}</label><br/>
                      {this.getWhenList(t)}
                    </div>

                  </Row>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="thenValue">
                    <Form.Label>{t("then")}</Form.Label>
                    <Form.Control  onChange={this.handleChangeThen} value={this.state.then}
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

                          <ol className="breadcrumb">
                              <FactList/>
                          </ol>


                        </Card.Body>
                      </Card>
                    </div>
                  </Row>
                </Col>
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

export default withTranslation()(RuleCreate);
