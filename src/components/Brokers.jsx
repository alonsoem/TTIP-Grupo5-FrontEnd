import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import { Image } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {getBrokers} from "../api/api";
import NavBarPage from "./NavBarPage";
import maincalcicon from "../static/maincalcicon.png";

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
    getBrokers()
      .then((taxes) => {
        this.setState({ rows: taxes });
      })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  render() {
    const { t } = this.props;
    const dataSet = this.state.rows.map((item) => {
      return { id: item.id, name: item.name, url: <a href={"/broker/edit/"+item.id}>{t("edit")}</a>};
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

    ];

    return (
      <div>
        <NavBarPage />
        <div className="container-fluid">
          <h1 className="card-header">{t("brokers")}</h1>
          <br />
          <NavLink to="/broker/edit">
            <Image title={t("mainCalc")} src={maincalcicon} />
          </NavLink>
          <br />
          <br />
          <h2 className="card-header">{t("quickRef")}</h2>
          <br />
          <div className="form-content" align="center">
            <div className="row">
              <div id={"contenedor"}>
                <MDBTable className="table-secondary table-hover" responsive>
                  <MDBTableHead columns={columns} />
                  <MDBTableBody rows={dataSet} />
                </MDBTable>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default withTranslation()(Brokers);
