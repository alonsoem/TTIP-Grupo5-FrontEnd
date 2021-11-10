import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import {Card, Image} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { getTaxes } from "../api/api";
import maincalcicon from "../static/maincalcicon.png";
import NavBarPage from "./NavBarPage";

class Landing extends React.Component {
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
      <div className={"bg"}>
        <NavBarPage />
        <div className="container">

          <div className="row">
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{t("mainCalc")}</h5>
                  <NavLink to="/maincalc/1">
                     <Image title={t("mainCalc")} src={maincalcicon} />
                  </NavLink>
                  <p className="card-text">Un detalle para la calculadora.Dejo el icono original</p>
                  <a href="/maincalc/1" className="btn btn-primary">Utilizar!</a>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{t("mainCalc")}</h5>
                  <NavLink to="/maincalc/1">
                    <Image title={t("mainCalc")} src={maincalcicon} />
                  </NavLink>
                  <p className="card-text">Un detalle para la calculadora.Dejo el icono original</p>
                  <a href="/maincalc/1" className="btn btn-primary">Utilizar!</a>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{t("mainCalc")}</h5>
                  <NavLink to="/maincalc/1">
                    <Image title={t("mainCalc")} src={maincalcicon} />
                  </NavLink>
                  <p className="card-text">Un detalle para la calculadora.Dejo el icono original</p>
                  <a href="/maincalc/1" className="btn btn-primary">Utilizar!</a>
                </div>
              </div>
            </div>
          </div>

          <br/>
          <Card>
            <Card.Header>
              {t("quickRef")}
            </Card.Header>
            <Card.Body>

              <div className="form-content" align="center">
            <div className="row">
              <div id={"contenedor"}>
                <MDBTable className="table table-striped table-hover" responsive>
                  <MDBTableHead columns={columns} color="secondary-color"/>
                  <MDBTableBody rows={dataSet} />
                </MDBTable>
              </div>
            </div>
          </div>
            </Card.Body>

          </Card>
          <br/>
          <Card>
            <Card.Header>
                {t("news")}
            </Card.Header>
          <Card.Body>
          <iframe
            className="mr-3"
            width="500"
            height="315"
            src="https://www.youtube.com/embed/y2ODLQj3D4Q"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            className="mr-3"
            width="500"
            height="315"
            src="https://www.youtube.com/embed/rRccV7J3cTI"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Landing);
