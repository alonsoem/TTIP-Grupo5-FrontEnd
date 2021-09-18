import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import { withTranslation } from "react-i18next";
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
        </div>
      </div>
    );
  }
}

export default withTranslation()(Taxes);
