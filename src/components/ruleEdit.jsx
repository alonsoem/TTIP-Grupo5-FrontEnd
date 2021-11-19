import React from "react";
import {Card, Row, Form, Button, Col, OverlayTrigger} from "react-bootstrap";
import FactList from "./factList";
import { withTranslation } from "react-i18next";
import {deleteRule, getFacts, getRule, putRuleEdit} from "../api/api";
import NavBarPage from "./NavBarPage";
import HeaderWithStepsFull from "./HeaderWithStepsFull";
import {Popover} from "react-bootstrap";
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
      errors:[],
      realFacts:[],
      useCondition:null
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeThen = this.handleChangeThen.bind(this);

  }

    toggleConditionOnOff = (event)=>{
        this.setState({"useCondition": event.target.checked});
    }

  validateExpression(expression) {
      const objects = this.state.realFacts.map((item) => (
            [item,1]
          )
      );
      const scope= Object.fromEntries(objects);
      try {
          math.evaluate(expression,scope);
          return true;

      }catch (e){
          console.log(e);
          return false;

      }
  }
  cancelAction=(event)=>{
      event.preventDefault();
      this.props.history.goBack();
  }

  componentDidMount() {
    this.state.id=this.props.match.params.id;
    getRule(this.state.id)
        .then(rule => {
            this.setState({name: rule.name,description:rule.description,
                when:(rule.when[0]=="always"? [""]:[...rule.when]),
                then:this.handleLoadArray(rule.then),
                useCondition: (rule.when[0]=="always"? false:true)
            });
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));

      getFacts()
          .then((facts) => {
              this.setState({realFacts:facts.flatMap(each => (
                      each.facts.map(each=>each.name)
                      ))});
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
                when: (this.state.useCondition ? this.state.when:["always"]),
                then: [this.state.then],
                useWhen:this.state.useCondition,
        })
        .then((response) => {
          this.props.history.push("/broker");
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

    getWhenList(t) {
        return this.state.when.map((condition,i) =>
            <Row className="padding-5">
                <Col className={"sm-10 col-9"}>
                    <Form.Group className="sm-2" controlId={"whenValue"+i} as={"Row"}>
                        <Row>
                        <Col className={"col-4"}>
                            <Form.Label>{t("whenCondition")} # {i}</Form.Label>
                        </Col>
                        <Col className={"col-8"}>
                        <Form.Control value={condition} onChange={e => this.handleInputChange(e, i)}

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
                        </Row>
                    </Form.Group>
                </Col>
                <Col className={"sm-2 col-3"}>
                    <div className={"btn-box"}>
                        {this.state.when.length !== 1 &&
                        <button type="button" class="btn-sm btn-secondary" onClick={() => this.handleRemoveClick(i)}>
                            <i className="fas fa-minus "></i></button>
                        }
                        &nbsp;
                        {this.state.when.length - 1 === i &&
                        <button type="button" className="btn-sm btn-secondary" onClick={() => this.handleAddClick(i)}>
                            <i className="fas fa-plus"></i></button>
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

        if (this.state.useCondition) {
            if (this.state.when.length > 0) {
                this.state.when.forEach((anExpression, index) => {
                        if (anExpression === "") {
                            errors.push("when" + index)
                        }
                        if (!this.validateExpression(anExpression)) {
                            errors.push("when" + index);
                        }
                    }
                )
            } else {
                errors.push("when" + 0);
            }
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

      const popover = (title,body)=>(

          <Popover id="popover-basic">

              <Popover.Title as="h3">{title}</Popover.Title>

              <Popover.Content>
                  {body}
              </Popover.Content>

          </Popover>

      );



      return (
        <div >
        <NavBarPage />
          <div className="container">
            <Form onSubmit={this.handleSubmit}>
          <Card>
              <HeaderWithStepsFull title={t("brokerNew")} stepIndex={2} steps={[t("calculator"),t("taxCreate"),t("ruleCreate")]} hereText={t("youAreHere")} leftSteps={t("leftSteps")} />
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
                              <Form.Group className="mb-3" controlId="whenValue" >
                              <div className="card shadow-none border-light" >
                                  <Card.Header>
                                    <Row>
                                        <div className={"col-11"} >
                                          <div className='custom-control custom-switch'>
                                              <input
                                                  type='checkbox'
                                                  className='custom-control-input'
                                                  id='customSwitchesChecked'
                                                  checked={this.state.useCondition ? "checked":null}
                                                  value={this.state.useCondition}
                                                  onChange={this.toggleConditionOnOff}


                                              />
                                              <label className='custom-control-label' htmlFor='customSwitchesChecked'>
                                                  {t("when")}

                                              </label>
                                          </div>
                                        </div>
                                        <div className={"col-1"}>
                                            <OverlayTrigger trigger="hover" placement="right" overlay={popover(t("whenCondition"),t("whenInfo"))}>
                                                <i className="fa fa-info-circle blue-text"></i>
                                            </OverlayTrigger>
                                        </div>
                                    </Row>

                                  </Card.Header>
                                  <Card.Body className={this.state.useCondition ? "show":"collapse"}>
                                          {this.getWhenList(t)}
                                  </Card.Body>



                              </div>
                          </Form.Group>
                          </Row>
                          <Row className="mb-3">
                              <Form.Group className="mb-3" controlId="thenValue">
                                  <Form.Label>{t("then")}</Form.Label>&nbsp;
                                  <OverlayTrigger trigger="hover" placement="right" overlay={popover(t("then"),t("thenInfo"))}>
                                      <i className="fa fa-info-circle blue-text"></i>
                                  </OverlayTrigger>
                                  <Form.Control onChange={this.handleChangeThen} value={this.state.then}
                                                 className={
                                                     this.hasError("then")
                                                         ? "form-control is-invalid"
                                                         : "form-control"
                                                 }
                                  />
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
                                  <Card.Body >
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
                      <Col>
                          <button class="btn btn-outline-danger"

                              onClick={this.deleteAction}
                              id={this.state.id}
                          >
                              <i class="fa fa-trash"></i><span>{t("remove")}</span>
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

export default withTranslation()(RuleEdit);
