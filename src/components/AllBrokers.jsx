import {MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import React from "react";
import {Button, Card, Col, Row, Form} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {getPublicBrokers, postBrokerCopy} from "../api/api";
import NavBarPage from "./NavBarPage";
import "./table.css";
import {toast} from "react-toastify";

class AllBrokers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem("userId"),
      rows: [],
      search:"",
    };
  }

  componentDidMount() {
    this.updateBrokers();
  }

  handleSearch = (event)=> {
    this.setState({search:event.target.value});
    this.updateBrokers();
  }

  updateBrokers() {
    getPublicBrokers({words:this.state.search.split(" ")})
      .then((response) => {
        this.setState({ rows: response});
      })
      .catch((responseError) => this.handleAPIError(responseError));
  }

  copyBroker = (event) => {
    postBrokerCopy(event.target.id)
        .then(() => {
          this.notify(this.props.t("brokerCopyOK"));
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  useBroker = (event) => {
    this.props.history.push("/maincalc/" + event.target.id);
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });
    this.notifyError(errorToDisplay);
  }

  notify = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'colored',
    });
  }

  notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'colored',
    });
  }


  render() {
    const { t } = this.props;
    const dataSet = this.state.rows.map((item) => {
      return {
        name: (<a href={"#"} onClick={this.useBroker} id={item.id} className={"nav-link"}>{item.name}</a>),
        copy:(
           <Button variant="info" onClick={this.copyBroker} id={item.id}>
              <i className="fa fa-copy"></i>
           </Button>
            ),
      };
    });
    const columns = [
      {
        label: t("brokerName"),
        field: "name",
      },

      {
        label: t("actionCol"),
        field: "copy",
      }
    ];

    return (
      <div >
        <NavBarPage />
        <div className="container">

          <Card>
            <Card.Header>
              <h5>{t("publicBrokers")}</h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div id={"contenedor"}>

                  <Row className="row">
                    <Col className="col-11 col-sm-10 col-lg-10 col-xl-10 pb-10">
                      <Row>
                        <Form.Group className="mb-3" controlId="searchValue">
                          <MDBInput
                              type="text"
                              label={t("search")}
                              value={this.state.search}
                              icon="search"
                              onChange={this.handleSearch}
                              className={"form-control"} />

                        </Form.Group>
                      </Row>
                      <MDBTable
                        className="table table-striped table-hover"
                        responsive
                      >
                        <MDBTableHead columns={columns} color="info-color" />
                        <MDBTableBody rows={dataSet} />
                      </MDBTable>
                    </Col>
                    <Col className="col-1 col-sm-2 col-lg-2 col-xl-2 pb-2">
                      <NavLink to="/broker">
                        <Button title={t("brokerNew")} class={"btn-sm"}>
                          <i className="fa fa-plus"></i>
                        </Button>
                      </NavLink>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default withTranslation()(AllBrokers);
