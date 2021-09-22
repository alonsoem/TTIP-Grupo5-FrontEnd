import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import { Image } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { getTaxes } from "./api/api";
import NavBarPage from "./components/NavBarPage";

class Taxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    getTaxes()
      .then((taxes) => {
        this.setState({ rows: taxes });
      })
      .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  render() {
    const { t } = this.props;
    const dataSet = this.state.rows.map((item) => {
      return { id: item.id, name: item.name, rate: item.rate };
    });
    const columns = [
      {
        label: t("lawNum"),
        field: "id",
      },
      {
        label: t("taxName"),
        field: "name",
      },
      {
        label: t("rate"),
        field: "rate",
      },
    ];

    return (
      <div>
        <NavBarPage />
        <div className="container-fluid">
          <h1 className="card-header">{t("calcs")}</h1>
          <br />
          <NavLink to="/maincalc">
            <Image
              title={t("mainCalc")}
              src={process.env.PUBLIC_URL + "/maincalc-icon.png"}
            />
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
          <h2 className="card-header">{t("news")}</h2>
          <br />
          <iframe
            className="mr-3"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/y2ODLQj3D4Q"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            className="mr-3"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/rRccV7J3cTI"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Taxes);
