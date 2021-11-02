import React from "react";
import {Card} from "react-bootstrap";

class HeaderWithSteps extends React.Component {
    constructor(props) {
        super(props);
    }




    render() {
        const {title,steps,backText,hereText}=this.props;

        function loadItems(){
            return steps.map((item,index) =>{
                console.log(item + "-" + index + " _ " +steps.length);
                    if (index===steps.length-1){
                        return <li className="active" title={hereText}><a href="javascript:void(0);"><b>{index+1}. {item}</b></a></li>
                    }else{
                        return <li className="completed" title={backText}><a href="javascript:void(0);"><b>{index+1}. {item}</b></a></li>
                    }
                }
            )
        }
        return (
            <Card.Header >
                <h5>{title}</h5>

                                            <ul className="breadcrumb">
                            {loadItems()}

                        </ul>


            </Card.Header>
        )
    }


}
export default (HeaderWithSteps);
