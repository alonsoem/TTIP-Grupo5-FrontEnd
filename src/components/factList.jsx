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
        console.log(this.state.factList);
        return this.state.factList.map((fact) =>
            <li className="breadcrumb-item">
                <span className={"badge bg-"+this.classForType(fact.type)}
                      data-toggle="tooltip"
                      data-placement="top"
                      title={fact.description}>
                {fact.name} </span>
            </li>
        );
    }
    classForType(type){

        switch (type) {
            case 'CORE':
                return 'success';
            case 'RATE':
                return 'warning';
            case 'ENUM':
                return 'info';
            default:
                return 'secondary';
        }

    }

    componentDidMount() {
        getFacts()
            .then((facts) => {
                this.setState({factList:facts.map((each) => ({name: each.name, description: each.description,type:each.type}))});

            })
            .catch(() => this.setState({ error: this.props.t("genericError") }));
    }

    render() {
        return this.factListItems();
    }


}
export default (FactList);
