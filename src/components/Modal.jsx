import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

const App = () => {
    return (
        <Modal show={true}>
            <ModalHeader>
                <ModalTitle>Hi</ModalTitle>
            </ModalHeader>
            <ModalBody>asdfasdf</ModalBody>
            <ModalFooter>This is the footer</ModalFooter>
        </Modal>
    );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);