import React from 'react';
import {getTaxes} from "./api/api";
import NavBarPage from "./components/NavBarPage";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";


export default class Taxes extends  React.Component {
  constructor(props) {
    super(props);
    this.state = {
        rows:[],
        columns: [
            {
                label: 'Id',
                field: 'id',
                sort: 'asc'
            },
            {
                label: 'Texto',
                field: 'text',
                sort: 'asc'
            },
            {
                label: 'Texto Extendido',
                field: 'text',
                sort: 'asc'
            },
            {
                label: 'Valoracion',
                field: 'rating',
                sort: 'asc'
            }
        ]
    };

  }
  componentDidMount() {
    getTaxes()
        .then((reviews) => this.setState({rows:reviews}))
        .catch(() => this.setState({ error: 'Algo anduvo mal! Volvé a internar' }));
  }


  render () {

    const dataSet = this.state.rows.map(item => {

      return [
        item.id,
        item.text,
        item.textExtended,
        item.rating,
      ]
   });



    return (
        <div>
            <NavBarPage/>
            <div className="container-fluid">
                <br/>
                <h1>Reviews</h1>

                <div className="form-content" align="center">
                    <div className="row">
                        <div id={"contenedor"}>
                            <MDBTable responsive>
                                <MDBTableHead columns={this.state.columns}/>
                                <MDBTableBody rows={dataSet}/>
                            </MDBTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
  }
}

