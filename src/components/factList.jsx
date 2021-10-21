import React from "react";
import {getFacts} from "../api/api";

class FactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            factList: [],
        };
    }

    factListItems () {
        return this.state.factList.map((fact) =>
            <li className="breadcrumb-item">
                <span className={"badge bg-success"}
                      data-toggle="tooltip"
                      data-placement="top"
                      title={fact.description}>
                {fact.name} </span>
            </li>
        );
    }

    componentDidMount() {
        getFacts()
            .then((facts) => {
                this.setState({factList:facts.map((each) => ({name: each.name, description: each.description}))});

            })
            .catch(() => this.setState({ error: this.props.t("genericError") }));
    }

    render() {
        return this.factListItems();
    }


}
export default (FactList);
