import React from "react";
import { withTranslation } from "react-i18next";
import {getFacts, getRule, postTaxCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Image,Col} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";


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
        factList:[],
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangePriority = this.handleChangePriority.bind(this);
    this.handleChangeWhen = this.handleChangeWhen.bind(this);
    this.handleChangeThen = this.handleChangeThen.bind(this);

  }

  cancelAction=(event)=>{
    this.props.history.push("/tax/"+this.props.match.params.id);

  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.state.id=this.props.match.params.id
    getRule(this.state.id)
        .then(rule => {
          this.setState({name: rule.name,description:rule.description,priority:rule.priority,when:rule.when,then:rule.then});


        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));

    getFacts()
        .then((facts) => {
            this.setState({ factList: facts.map((each)=>each.name)});
            console.log(this.state.factList);
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));
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

    factListItems() {
        return this.state.factList.map((fact) =><li><span className={"badge bg-success"}> {fact} </span></li>);
    }


  render() {
    const { t } = this.props;
    const idTax= this.props.match.params.id;

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
                              <Form.Group className="mb-3" controlId="whenValue">
                                  <Form.Label>{t("when")}</Form.Label>
                                  <Form.Control  onChange={this.handleChangeWhen} value={this.state.when}/>
                              </Form.Group>
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
                              {t("allowedFacts")}
                          </Row>
                          <Row>
                              <ul>
                                  {this.factListItems()}
                              </ul>

                          </Row>
                      </Col>
                  </Row>

                  <Row>
                      <Button variant="primary" type="submit">
                          {t("save")}
                      </Button>

                      <Button variant="outline-primary" type="cancel" onClick={this.cancelAction}>
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

export default withTranslation()(RuleEdit);
