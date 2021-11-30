import {MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import React from "react";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import Dialog from "react-bootstrap-dialog";
import { withTranslation } from "react-i18next";
import {
    filteredBrokers,
    getUser,
    getUserBrokers,
    postBrokerCopy,
} from "../api/api";
import NavBarPage from "./NavBarPage";
import "./table.css";
import {toast} from "react-toastify";


class BrokersByUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem("userId"),
      rows: [],
      search:"",
      showUIDBrokers:props.match.params.userId,
      user:"",
    };

    this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentDidMount() {
    this.updateBrokers();
    this.getUserData();
  }

    handleAPIError(responseError) {
        let errorToDisplay = this.props.t("genericError");

        if (responseError.request && responseError.request.status === 0) {
            errorToDisplay = this.props.t("comError");
        }
        this.setState({ error: errorToDisplay });
        this.notifyError(errorToDisplay);
    }

  handleSearch = (event)=> {
    this.setState({search:event.target.value});
    filteredBrokers(this.state.showUIDBrokers,
                    {words:event.target.value.split(" ")})
        .then((response) => {
          this.setState({ rows: response });
        })
        .catch((responseError) => this.handleAPIError(responseError));

  }

    getUserData() {
        getUser(this.state.showUIDBrokers)
            .then((response) => {
                this.setState({ user: response});
            })
            .catch((responseError) => this.handleAPIError(responseError));
    }

  updateBrokers() {
    getUserBrokers(this.state.showUIDBrokers)
      .then((response) => {
        this.setState({ rows: response });
      })
      .catch((responseError) => this.handleAPIError(responseError));
  }


  copyBroker = (event) => {
    postBrokerCopy(event.target.id)
        .then(() => {
          this.notify(this.props.t("brokerCopyOK"));
          this.updateBrokers();
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
      console.log(item);
      return {
        id: item.id,
        name: item.name,
        copy:(
           <Button variant="info" onClick={this.copyBroker} id={item.id}>
              <i className="fa fa-copy"></i>
           </Button>
            ),
        url:null,
        del: null,
        calc: (
          <Button variant="info" onClick={this.useBroker} id={item.id}>
            <i className="fa fa-calculator"></i>
          </Button>
        ),
      };
    });
    const columns = [
      {
        label: t("brokerId"),
        field: "id",
      },
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
      },
      {
        label: "",
        field: "calc",
      },
    ];
      const initials = (fullName) => {
          if (fullName==undefined){ return ""};
          let names = fullName.split(" ");
          if (names.length>3){
              return names[0][0].toUpperCase()+" "+names[1][0].toUpperCase();
          }
          return names.map((n)=>n[0].toUpperCase()).join(" ");

      }

    return (
      <div >
        <NavBarPage />
        <div className="container">
          <Dialog
            ref={(component) => {
              this.dialog = component;
            }}
          />

          <Card>
            <Card.Header>
              <h5>{t("brokersFrom") } </h5>
            </Card.Header>
            <Card.Body>
                <div className={"row justify-content-md-center"}>
                    <div className="col-8 col-sm-8 col-lg-8 col-xl-8 pb-8 ">
                        <Card className={"bg-light-grey"}>
                            <Card.Body>
                                <div className={"container"}>

                                <div className={"row justify-content-md-center"}>
                                    <div className={"col col-2 text-center"}>
                                        <div className={"user-initials rounded-circle"} >
                                              <a href={"/brokers/"+ this.state.showUIDBrokers}>{initials(this.state.user.name)}</a>
                                        </div>
                                    </div>
                                    <div className={"col col-6 text-center"}>
                                        <h3>{this.state.user.name}</h3>
                                    </div>
                                </div>

                                </div>

                            </Card.Body>
                        </Card>
                    </div>
                </div>
              <div className="row">
                <div id={"contenedor"}>

                  <Row className="row">
                    <Col className="col-12 col-sm-12 col-lg-12 col-xl-12 pb-12">
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

export default withTranslation()(BrokersByUser);
