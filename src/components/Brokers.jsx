import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { deleteBroker, getBrokers } from "../api/api";
import NavBarPage from "./NavBarPage";
import { Button, Col, Row } from "react-bootstrap";

class Brokers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
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

  handleSubmit = (event) => {
    event.preventDefault();
    deleteBroker(event.target.id)
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
          <Button variant="secondary" onClick={this.handleSubmit} id={item.id}>
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
      <div>
        <NavBarPage />
        <div className="container-fluid">
          <h1 className="card-header">{t("brokers")}</h1>
          <br />
          <div className="form-content" align="center">
            <div className="row">
              <div id={"contenedor"}>
                <Row className="row">
                  <Col className="col-12 col-sm-4 col-lg-6 col-xl-6 pb-4">
                    <MDBTable
                      className="table-hover table table-success table-striped"
                      responsive
                    >
                      <MDBTableHead columns={columns} />
                      <MDBTableBody rows={dataSet} />
                    </MDBTable>
                  </Col>
                  <Col className="col-1 col-sm-1 col-lg-1 col-xl-1 pb-4">
                    <NavLink to="/broker/edit">
                      <Button title={t("brokerNew")} class={"btn-sm"}>
                        <i className="fa fa-plus"></i>
                      </Button>
                    </NavLink>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Brokers);
