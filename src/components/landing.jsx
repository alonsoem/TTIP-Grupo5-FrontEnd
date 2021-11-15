import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import { Card, Popover, OverlayTrigger } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { getTaxes } from "../api/api";
import NavBarPage from "./NavBarPage";
import BrokerCardList from "./TopCalcCards";
import jwt_decode from 'jwt-decode';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    if (!sessionStorage.getItem("token")) {
      this.props.history.push("/login");
    }else{
      const jwt_Token_decoded = jwt_decode(sessionStorage.getItem("token"));
      console.log(jwt_Token_decoded.exp * 1000);
      console.log(Date.now());
      if (jwt_Token_decoded.exp*1000<Date.now()){
        this.props.history.push("/login");

      }
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
    const popover = (body) => (
      <Popover id="popover-basic">
        <Popover.Content>{body}</Popover.Content>
      </Popover>
    );

    return (
      <div>
        <NavBarPage />
        <div className="container">

              <BrokerCardList t={t}/>

          <br />
          <Card>
            <Card.Header>{t("news")}</Card.Header>
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
          <br />
          <Card>
            <Card.Header>
              {t("quickRef")}
              <OverlayTrigger
                trigger="hover"
                placement="right"
                overlay={popover(t("quickRefDesc"))}
              >
                <i className="fa fa-info-circle blue-text"></i>
              </OverlayTrigger>
            </Card.Header>
            <Card.Body>
              <div className="form-content" align="center">
                <div className="row">
                  <div id={"contenedor"}>
                    <MDBTable
                      className="table table-striped table-hover"
                      responsive
                    >
                      <MDBTableHead columns={columns} color="info-color" />
                      <MDBTableBody rows={dataSet} />
                    </MDBTable>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Landing);
