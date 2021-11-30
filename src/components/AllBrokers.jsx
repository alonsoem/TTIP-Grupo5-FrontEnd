import {MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import React from "react";
import {Button, Card, Col, Row, Form} from "react-bootstrap";
import Dialog from "react-bootstrap-dialog";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  getPublicBrokers,
  postBrokerCopy,
} from "../api/api";
import NavBarPage from "./NavBarPage";
import "./table.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class AllBrokers extends React.Component {
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
    getPublicBrokers({words:event.target.value.split(" ")})
        .then((response) => {
          this.setState({ rows: response });
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));

  }

  updateBrokers() {
    getPublicBrokers({words:this.state.search.split(" ")})
      .then((response) => {
        this.setState({ rows: response});
      })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
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
          <ToastContainer />
          <Dialog
            ref={(component) => {
              this.dialog = component;
            }}
          />

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
