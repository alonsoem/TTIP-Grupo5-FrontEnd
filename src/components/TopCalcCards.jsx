import React from "react";
import {getBrokers} from "../api/api";

class BrokerCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }

    listItemsInCards() {
        const slicedArray = this.state.list.slice(0, 3);
        return slicedArray.map((calculator) =>

            <div className="col-sm-4">
                <div className="card"  style={{minHeight:"220px"}}>
                    <div className="card-body calcCard" >

                        <h5 className="card-title">{calculator.name}</h5>
                        <p className="card-text">
                            {calculator.name}
                        </p>
                        <a href={"/maincalc/" + calculator.id} className="btn btn-primary">
                            Utilizar!
                        </a>
                    </div>
                </div>
            </div>

        );
    }


    componentDidMount() {
        getBrokers()
            .then((response) => {
                this.setState({list:response.map((each) => (
                    {   name: each.name,
                        id:each.id}))});
            })
            .catch(() => this.setState({ error: this.props.t("genericError") }));
    }

    render() {
        return (
            <div className="row">
                {this.listItemsInCards()}
            </div>

        )
    }


}
export default (BrokerCardList);
