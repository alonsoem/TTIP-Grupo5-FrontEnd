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
                    label: 'Tax Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Rate',
                    field: 'rate',
                    sort: 'asc'
                }
            ]
        };

    }
    componentDidMount() {
        getTaxes()
            .then((taxes) => this.setState({rows:taxes}))
            .catch(() => this.setState({ error: 'Algo anduvo mal! Volvé a internar' }));
    }


    render () {

        const dataSet = this.state.rows.map(item => {

            return [
                item.id,
                item.name,
                item.rate,
            ]
        });


        return (
            <div>
                <NavBarPage/>
                <div className="container-fluid">
                    <br/>
                    <h1>Taxes</h1>

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

