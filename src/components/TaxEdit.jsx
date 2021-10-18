import React from "react";
import { withTranslation } from "react-i18next";
import {getTax, postTaxCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Image,Col} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import DragTest from "./dragTest";


class Taxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:0,
      name: "",
      url:"",
      rules:[],
      broker:null,
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  getAllRulesOld() {
    /*return this.state.rules.map((each) =>
        <ListGroup.Item action >
          <a href={"/rule/edit/"+each.id}>{each.name}</a>
        </ListGroup.Item>
    );*/
  }
  getAllRules() {
    return <DragTest taxRules={this.state.rules.map(e=>({id:e.id,name:e.name}))} context={this}/>;

  }
  cancelAction=(event)=>{
    this.props.history.push("/broker");

  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.state.id=this.props.match.params.id
    getTax(this.state.id)
        .then(aTax => {
          this.setState({name: aTax.name,
                                url: aTax.url,
                                rules:aTax.rules});
          console.log(aTax);
        })

        .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  handleChangeName = (event) => {
    this.setState({ taxName: event.target.value });
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



  render() {
    const { t } = this.props;
    const idTax= this.props.match.params.id;

      return (

      <div>
        <NavBarPage />
        <div className="container-fluid">

          <Card>
            <Card.Header as="h5">{t("taxEdit")}</Card.Header>
            <Card.Body>


              <Form onSubmit={this.handleSubmit}>
                <Row>
                <Col lg="7" xs="7" md="7">
                  <Row>
                    <Row className="mb-3">
                      <Form.Group className="mb-3" controlId="idValue">
                        <Form.Label>{t("id")}</Form.Label>
                        <Form.Control value={idTax}/>
                      </Form.Group>
                    </Row>

                    <Row className="mb-3">
                      <Form.Group className="mb-3" controlId="nameValue">
                        <Form.Label>{t("name")}</Form.Label>
                        <Form.Control onChange={this.handleChangeName} value={this.state.name}/>
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group className="mb-3" controlId="urlValue">
                        <Form.Label>{t("url")}</Form.Label>
                        <Form.Control onChange={this.handleChangeUrl} value={this.state.url}/>
                      </Form.Group>
                    </Row>


                  </Row>
                </Col>

                <Col lg="4" xs="4" md="4">
                  <Row>
                    <NavLink to={"/rule/"+this.state.id}>
                      {t("taxAddRule")}
                    </NavLink>
                  </Row>
                  <Row>

                  <ListGroup defaultActiveKey="#link1"> {this.getAllRules()}</ListGroup>
                  </Row>
                </Col>
                </Row>

                <Row>
                  <Button variant="primary" type="submit">
                    {t("update")}
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

export default withTranslation()(Taxes);
