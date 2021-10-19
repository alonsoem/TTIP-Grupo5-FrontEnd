import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";

function DinamicInput(props) {
    const [inputList, setInputList] = useState(props.elements);


    return (
        <div className="DinamicInput">
            {inputList.map((x, i) => {
                return (
                    <div className="box">
                        <Form.Group className="mb-3" controlId="whenValue">
                            <Form.Label>when</Form.Label>
                            <Form.Control value={x}/>
                        </Form.Group>
                        <div className="btn-box">
                            {inputList.length !== 1 && <Button className="mr10">Remove</Button>}
                            {inputList.length - 1 === i && <Button>Add</Button>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DinamicInput;