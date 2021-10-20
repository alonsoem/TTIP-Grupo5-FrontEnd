import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import {withTranslation} from "react-i18next";


class DinamicInput extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            lista:[1,2,3,4],
        };
    };






    render() {

            return (

                this.state.lista.map((x,i) => {

                    <div className="box">
                        <Form.Group className="mb-3" controlId="whenValue">
                            <Form.Label>when</Form.Label>
                            <Form.Control value={x}/>
                        </Form.Group>

                        <div className="btn-box">
                            {this.state.lista.length !== 1 && <Button className="mr10">Remove</Button>}
                            {this.state.lista.length - 1 === i && <Button>Add</Button>}
                        </div>
                    </div>

                })
            );


    };
}
export default withTranslation()(DinamicInput);

