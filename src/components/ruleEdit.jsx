import React from "react";
import {Card, Row, Form, Button, Col} from "react-bootstrap";
import FactList from "./factList";
import { withTranslation } from "react-i18next";
import {getRule, putRuleEdit} from "../api/api";
import NavBarPage from "./NavBarPage";



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
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangePriority = this.handleChangePriority.bind(this);
    this.handleChangeThen = this.handleChangeThen.bind(this);

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
          console.log(rule);
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));

  }

  handleLoadArray(array){
      return array.join();
  }

  handleChangeName = (event) => {
    this.setState({ taxName: event.target.value });
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
        this.validateFacts(event.target);
        this.setState({ then:  event.target.value });

    };

    validateFacts(input){
        const regex = new RegExp('/^[a-zA-Z0-9]*$/;');
        if (regex.test(input.value)) {
            console.log("OK");
        }else{
            console.log("ERROR");

        }
    }


    handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });

  }

  handleSubmit = (event) => {
    event.preventDefault();
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
                        <Form.Control  value={condition} onChange={e => this.handleInputChange(e, i)}/>
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


  render() {
    const { t } = this.props;



      return (

      <div>
        <NavBarPage />
        <div className="container-fluid">

          <Card>
            <Card.Header as="h5">{t("ruleEdit")}</Card.Header>
            <Card.Body>


              <Form onSubmit={this.handleSubmit}>
                  <Row>
                      <Col>
                          <Row className="mb-3">
                              <Form.Group className="mb-3" controlId="nameValue">
                                  <Form.Label>{t("name")}</Form.Label>
                                  <Form.Control  onChange={this.handleChangeName} value={this.state.name}/>
                              </Form.Group>
                          </Row>
                          <Row className="mb-3">
                              <Form.Group className="mb-3" controlId="descriptionValue">
                                  <Form.Label>{t("description")}</Form.Label>
                                  <Form.Control  onChange={this.handleChangeDescription} value={this.state.description}/>
                              </Form.Group>
                          </Row>
                          <Row className="mb-3">
                              <Form.Group className="mb-3" controlId="priorityValue">
                                  <Form.Label>{t("priority")}</Form.Label>
                                  <Form.Control  onChange={this.handleChangePriority} value={this.state.priority}/>
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
                                  <Form.Control  onChange={this.handleChangeThen} value={this.state.then}/>
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

                  <Row>
                      <Button variant="primary" type="submit">
                          {t("save")}
                      </Button>

                      <Button variant="outline-primary" type="cancel" onClick={this.cancelAction}>
                          {t("back")}
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

export default withTranslation()(RuleEdit);
