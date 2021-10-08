import React from "react";
import { withTranslation } from "react-i18next";
import {postTaxCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card,Row,Form,Button} from "react-bootstrap";

class Taxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      taxName: "",
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
  }

  handleChangeName = (event) => {
    this.setState({ taxName: event.target.value });
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
          this.props.history.push("/taxes");
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  render() {
    const { t } = this.props;
    const { id } = this.props.match.params;

    return (
      <div>
        <NavBarPage />
        <div className="container-fluid">

          <Card>
            <Card.Header as="h5">Edit your Broker</Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>

                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="idValue">
                    <Form.Label>Broker Id</Form.Label>
                    <Form.Control value={id}/>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="nameValue">
                    <Form.Label>Broker/Tax Name</Form.Label>
                    <Form.Control onChange={this.handleChangeName} value={this.state.taxName}/>
                  </Form.Group>
                </Row>


                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>

        </div>
      </div>
    );
  }
}

export default withTranslation()(Taxes);
