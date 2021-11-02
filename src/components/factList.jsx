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


                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                        <button className="accordion-button open" type="button" data-bs-toggle="collapse"
                                data-bs-target="#flush-collapseOne" aria-expanded="false"
                                aria-controls="flush-collapseOne">
                            {fact.name}
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse open"
                         aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            <div>{fact.description}</div>
                            <div>{this.subFacts(fact.facts)}</div>
                        </div>
                    </div>
                </div>

        );
    }

    subFacts(facts){
        return  facts.map((each)=>
                <div>
                    <span className={"badge bg-" + this.classForType(each.type)}
                          data-toggle="tooltip"
                          data-placement="top"
                          title={each.description}>
                            {each.name}
                    </span>
                    <br/>
                </div>


        )

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
                this.setState({factList:facts.map((each) => (
                    {   name: each.name,
                        description: each.description,
                        facts:each.facts}))});
            })
            .catch(() => this.setState({ error: this.props.t("genericError") }));
    }

    render() {
        return (
                <div className="accordion accordion-flush" id="accordionFlushExample">
                     {this.factListItems()}
                </div>
        )
    }


}
export default (FactList);
