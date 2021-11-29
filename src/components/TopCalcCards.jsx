import React from "react";
import {getPublicBrokers} from "../api/api";
import {Col} from "react-bootstrap";

class BrokerCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            traslateObj: props.translateObj,
        };
    }

    listItemsInCards() {
        const slicedArray = this.state.list.slice(0, 3);

        const initials = (fullName) => {
            let names = fullName.split(" ");
            if (names.length>3){
                return names[0][0]+" "+names[1][0];
            }
            return names.map((n)=>n[0].toUpperCase()).join(" ");

       }

        return slicedArray.map((calculator) =>

            <div className="col-sm-4">
                <div className="card h-100"  style={{minHeight:"220px"}}>
                    <div className="card-body calcCard h-100" >
                        <div class="row h-75 ">
                            <h5 className="card-title">{calculator.name}</h5>
                            <p className="card-text">
                                {calculator.description}
                            </p>
                        </div>
                        <div class="row h-25">
                            <Col className={"col-9"}>
                                <a href={"/maincalc/" + calculator.id} className="btn btn-primary">
                                    Utilizar!
                                </a>
                            </Col>
                            <Col className={"col-3 text-center"}>
                                <div className={"user-initials rounded-circle"} title={calculator.userFullName}>
                                    <a href={"/brokers/"+ calculator.userId}>{initials(calculator.userFullName)}</a>
                                </div>
                            </Col>
                        </div>
                    </div>
                </div>
            </div>

        );
    }


    componentDidMount() {
        getPublicBrokers({words:[""]})
            .then((response) => {
                console.log(response);
                this.setState({list:response.map((each) => (

                    {   name: each.name,
                        description:each.description,
                        userFullName:each.userFullName,
                        userId:each.userId,
                        id:each.id}))});
            })
            .catch(() => {
                    this.setState({error: this.props.t("genericError")});
                }
            );
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
