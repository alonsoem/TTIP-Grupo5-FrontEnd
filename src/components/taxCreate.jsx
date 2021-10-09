import React from "react";
import { withTranslation } from "react-i18next";
import {postTaxCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card,Row,Form,Button} from "react-bootstrap";

class TaxCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url:"",
      name: "",
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

  handleSubmit = (event) => {
    event.preventDefault();
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
                    <Form.Control onChange={this.handleChangeName} value={this.state.name}/>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="nameValue">
                    <Form.Label>{t("url")}</Form.Label>
                    <Form.Control  onChange={this.handleChangeUrl} value={this.state.url}/>
                  </Form.Group>
                </Row>


                <Button variant="primary" type="submit">
                  {t("save")}
                </Button>

                <Button variant="outline-primary" type="cancel" onClick={this.cancelAction}>
                  {t("cancel")}
                </Button>
              </Form>
            </Card.Body>
          </Card>

        </div>
      </div>
    );
  }
}

export default withTranslation()(TaxCreate);
