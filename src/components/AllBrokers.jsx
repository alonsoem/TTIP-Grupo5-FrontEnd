import {MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import React from "react";
import {Button, Card, Col, Row, Form, OverlayTrigger} from "react-bootstrap";
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

  tooltip(){return (<div>HOLA</div>)}

  getBrokerCards () {
    return this.state.rows.map((item) =>


        <div  className="col-sm-4" style={{ marginBottom: 30}}>

          <div className="card h-100 " style={{minHeight: "220px"}}>

            <div className="card-body calcCard h-100">
              <div className="row">
                <h5 className="card-title">{item.name}</h5>

                <div className="card-text brokerCards h-100">
                  <div className={"h-75"}>
                    <a href={"/maincalc/" + item.id} class={"link-light"}><h5 >{item.name}</h5></a>
                    <p>{item.description}</p>
                  </div>
                  <div className="row h-25  float-end brokerAction">
                      <i className="fa fa-copy" title={this.props.t("tipCopyBroker")} onClick={this.copyBroker} id={item.id}></i>
                  </div>
                </div>

              </div>

            </div>
          </div>
          </div>

    );
  }

  render() {
    const {t} = this.props;





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

                    <Col className="col-12">
                      <Row>
                        <Col className="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 pb-12">
                        <Form.Group className="mb-3" controlId="searchValue">
                          <MDBInput
                              type="text"
                              label={t("search")}
                              value={this.state.search}
                              icon="search"
                              onChange={this.handleSearch}
                              className={"form-control"} />

                        </Form.Group>
                        </Col>
                       </Row>
                      <Row>
                        <Col className={"col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"}>
                          <div className={"row "} id={"brokerCards"}>
                          {this.getBrokerCards()}
                          </div>
                        </Col>
                      </Row>
                    </Col>
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
