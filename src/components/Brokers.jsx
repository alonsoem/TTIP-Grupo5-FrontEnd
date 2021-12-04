import {MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import React from "react";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import Dialog from "react-bootstrap-dialog";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  deleteBroker,
  filterMyBrokers,
  getMyBrokers,
  postBrokerCopy,
} from "../api/api";
import NavBarPage from "./NavBarPage";
import "./table.css";
import {toast, ToastContainer} from "react-toastify";


class Brokers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem("userId"),
      rows: [],
      search:"",
    };

    this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentDidMount() {
    this.updateBrokers();
  }

  handleSearch = (event)=> {
    this.setState({search:event.target.value});
    filterMyBrokers({words:event.target.value.split(" ")})
        .then((response) => {
          this.setState({ rows: response });
        })
        .catch((responseError) => this.handleAPIError(responseError));

  }

  updateBrokers() {
    getMyBrokers()
      .then((response) => {
        this.setState({ rows: response });
      })
      .catch((responseError) => this.handleAPIError(responseError));
  }

  deleteBroker = (id) => {
    deleteBroker(id)
      .then(() => {
        this.updateBrokers();
      })
      .catch((responseError) => this.handleAPIError(responseError));
  };

  copyBroker = (event) => {
    postBrokerCopy(event.target.id)
        .then(() => {
          this.notify(this.props.t("brokerCopyOK"));
          this.updateBrokers();
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  editBroker = (event) => {
    this.props.history.push("/broker/" + event.target.id);
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

  confirmDelete = (event) => {
    event.preventDefault();
    Dialog.setOptions({
      defaultOkLabel: this.props.t("modalOkButton"),
      defaultCancelLabel: this.props.t("modalCancelButton"),
      primaryClassName: "btn-success",
      defaultButtonClassName: "btn-link",
    });

    this.dialog.show({
      title: this.props.t("modalTitleConfirm"),
      body: this.props.t("modelBodyMessage"),
      actions: [
        Dialog.OKAction(() => this.deleteBroker(event.target.id)),
        Dialog.CancelAction(() => console.log("Hello!")),
      ],
      bsSize: "small",
      onHide: (dialog) => {
        dialog.hide();
      },
    });
  };

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

  getBrokerCards () {
    console.log(this.state.rows);
    return this.state.rows.map((item) =>


        <div  className="col-sm-4" style={{ marginBottom: 30}}>

          <div className="card h-100 " style={{minHeight: "220px"}}>

            <div className="card-body calcCard h-100">
              <div className="row">
                <h5 className="card-title">
                  {item.name}
                  &nbsp;<i className={item.isPublic?"fa fa-eye":"fa fa-eye-slash"} ></i>
                </h5>

                <div className="card-text brokerCards h-100">
                  <div className={"h-75"}>
                    <a href={"/maincalc/" + item.id} class={"link-light"}>
                      <h5 >{item.name}
                        &nbsp;<i className={item.isPublic?"fa fa-eye":"fa fa-eye-slash"}
                                 title={this.props.t(item.isPublic?"tipIsVisible":"tipIsNotVisible")}></i>
                      </h5>

                    </a>
                    <p>{item.description}</p>
                  </div>
                  <div className="row h-25  justify-content-end brokerAction">
                    <div className={"col-auto"}>
                    <i className="fa fa-copy brokerAction" title={this.props.t("tipCopyBroker")} onClick={this.copyBroker} id={item.id}></i>
                    </div>
                    <div className={"col-auto brokerAction"}>
                      <i className="fa fa-edit " title={this.props.t("tipEditBroker")} onClick={this.editBroker} id={item.id}></i>
                    </div>
                    <div className={"col-auto brokerAction"}>
                      <i className="fa fa-trash brokerAction" title={this.props.t("tipDeleteBroker")} onClick={this.confirmDelete} id={item.id}></i>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

    );
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
        url:
          item.userId == this.state.userId ? (
            <Button variant="info" onClick={this.editBroker} id={item.id}>
              <i className="fa fa-edit"></i>
            </Button>
          ) : null,
        del:
          item.userId == this.state.userId ? (
            <Button variant="info" onClick={this.confirmDelete} id={item.id}>
              <i className="fa fa-minus"></i>
            </Button>
          ) : null,
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
      },
      {
        label: "",
        field: "url",
      },
      {
        label: "",
        field: "del",
      }
    ];

    return (
      <div >
        <NavBarPage />
        <div className="container">

          <ToastContainer />
          <Dialog
            ref={(component) => {
              this.dialog = component;
            }}
          />

          <Card>
            <Card.Header>
              <h5>{t("myBrokers")}</h5>
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

                    </Col>
                    <Col className="col-1 col-sm-2 col-lg-2 col-xl-2 pb-2">
                      <NavLink to="/broker">
                        <Button title={t("brokerNew")} class={"btn-sm"}>
                          <i className="fa fa-plus"></i>
                        </Button>
                      </NavLink>
                    </Col>
                  </Row>

                  <Row>
                    <Col className={"col-12 col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10"}>
                      <div className={"row "} id={"brokerCards"}>
                        {this.getBrokerCards()}
                      </div>
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

export default withTranslation()(Brokers);
