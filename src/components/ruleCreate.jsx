import React from "react";
import {getFacts,postRuleCreate} from "../api/api";
import { withTranslation } from "react-i18next";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Col} from "react-bootstrap";


class RuleCreate extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      id:0,
      when: [],
      then: [],
      name: "",
      description: "",
      priority: 1,
      factList:[],
    };

      this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangePriority = this.handleChangePriority.bind(this);
    this.handleChangeWhen = this.handleChangeWhen.bind(this);
    this.handleChangeThen = this.handleChangeThen.bind(this);


  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    getFacts()
        .then((facts) => {
          this.setState({ factList: facts.map((each)=>each.name)});
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));

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

  handleSubmit = (event) => {
    event.preventDefault();
    postRuleCreate(this.props.match.params.id,
        {
          name: this.state.name,
          description: this.state.description,
          priority: this.state.priority,
          when: [this.state.when],
          then: [this.state.then],
    })
        .then((response) => {
          this.props.history.push("/tax/edit/"+this.props.match.params.id);
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  factListItems() {
    return this.state.factList.map((fact) =>
        <li className="breadcrumb-item">
          <span className={"badge bg-success"}> {fact} </span>
        </li>
    );
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
                    <div>
                      <Card>
                        <Card.Header>
                          {t("allowedFacts")}
                        </Card.Header>
                        <Card.Body>

                          <ol className="breadcrumb">
                            {this.factListItems()}
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

export default withTranslation()(RuleCreate);
