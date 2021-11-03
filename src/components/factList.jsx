import React from "react";
import {getFacts} from "../api/api";
import Accordion from "bootstrap";

class FactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            factList: [],
        };
    }

    factListItems () {
        return this.state.factList.map((fact,index) =>

                <div class="accordion-item">
                    <h2 class="accordion-header" id={fact.name+"header"}>
                        <button class="accordion-button" type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={"#" + fact.name}
                                aria-expanded={index==0}
                                aria-controls={fact.name}>
                            {fact.name}
                        </button>
                    </h2>
                    <div id={fact.name}
                         class={"accordion-collapse collapse " +(index==0 && "show")}
                         aria-labelledby={fact.name+"header"}
                         >
                        <div class="accordion-body">
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
                <div class="accordion accordion-flush" id="accordionContainer">
                     {this.factListItems()}
                </div>
        )
    }


}
export default (FactList);
