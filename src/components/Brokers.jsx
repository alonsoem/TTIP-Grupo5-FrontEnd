import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { deleteBroker, getBrokers } from "../api/api";
import NavBarPage from "./NavBarPage";
import {Button, Card, Col, Row, Table} from "react-bootstrap";
import Dialog from 'react-bootstrap-dialog';



class Brokers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],

    };

    this.confirmDelete = this.confirmDelete.bind(this)
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.updateBrokers();
  }

  updateBrokers() {
    getBrokers()
      .then((taxes) => {
        console.log(taxes);
        this.setState({ rows: taxes });
      })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  deleteBroker = (id) => {

    deleteBroker(id)
      .then((response) => {
        this.updateBrokers();
      })
      .catch((responseError) => this.handleAPIError(responseError));
  };

  editBroker = (event) => {
    this.props.history.push("/broker/edit/" + event.target.id);
  };

  useBroker = (event) => {
    this.props.history.push("/maincalc/" + event.target.id);
  };

  confirmDelete =(event) => {
    event.preventDefault();
    Dialog.setOptions({
      defaultOkLabel: this.props.t("modalOkButton"),
      defaultCancelLabel: this.props.t("modalCancelButton"),
      primaryClassName: 'btn-success',
      defaultButtonClassName: 'btn-link'
    })

    this.dialog.show({
      title: this.props.t("modalTitleConfirm"),
      body: this.props.t("modelBodyMessage"),
      actions: [
        Dialog.OKAction(() => this.deleteBroker(event.target.id)),
        Dialog.CancelAction(() => console.log('Hello!'))
      ],
      bsSize: 'small',
      onHide: (dialog) => {
        dialog.hide()
      }
    })

  }


  render() {
    const { t } = this.props;
    const dataSet = this.state.rows.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: (
          <Button variant="secondary" onClick={this.editBroker} id={item.id}>
            <i className="fa fa-edit"></i>
          </Button>
        ),
        del: (
          <Button variant="secondary" onClick={this.confirmDelete} id={item.id}>
            <i className="fa fa-minus"></i>
          </Button>
        ),
        calc: (
          <Button variant="secondary" onClick={this.useBroker} id={item.id}>
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




    return (
      <div className={"bg"}>

        <NavBarPage />
        <div className="container">


          <Dialog ref={(component) => { this.dialog = component }} />

          <Card>
            <Card.Header>
              <h5>{t("brokers")}</h5>
            </Card.Header>
            <Card.Body>
                <div className="row">
                  <div id={"contenedor"}>
                    <Row className="row">
                      <Col className="col-11 col-sm-10 col-lg-10 col-xl-10 pb-10">
                       <MDBTable className="table table-striped table-hover"
                            responsive
                        >
                          <MDBTableHead columns={columns} color="secondary-color"/>
                          <MDBTableBody rows={dataSet} />
                        </MDBTable>
                      </Col>
                      <Col className="col-1 col-sm-2 col-lg-2 col-xl-2 pb-2">
                        <NavLink to="/broker/edit">
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

export default withTranslation()(Brokers);
