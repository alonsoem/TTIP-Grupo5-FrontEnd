import React from "react";
import {Card} from "react-bootstrap";

class HeaderWithSteps extends React.Component {

    render() {
        const {title,steps,stepRefs,leftSteps,hereText,stepIndex,pastText}=this.props;

        function loadItems(){
            return steps.map((item,index) =>{
                    if (index<stepIndex){
                        return (<li className="completed" title={pastText}>
                                    <a href={stepRefs[index]}><b>{index+1}. {item}</b></a>
                                </li>
                                )
                    }else if (index==stepIndex){
                        return (<li className="active" title={hereText}>
                            <a href={stepRefs[index]}><b>{index+1}. {item}</b></a>
                        </li>)
                    }else{
                        return (<li className="incompleted" title={leftSteps}>
                                    <a href={stepRefs[index]}><b>{index+1}. {item}</b></a>
                                </li>)
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
