import * as md5 from "md5";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow } from 'mdbreact';
import React, { Component } from 'react';
import { Alert, Button, Col, Form, FormGroup, Image, Row } from "react-bootstrap";
import { withTranslation } from 'react-i18next';
import { IntlProvider } from 'react-intl';
import { postRegister } from "../api/api";
import App18 from "../App18";
import i18n from '../i18n.js';
import "./test.css";

class RegisterForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            plat:'',
            error: '',
            fecha: new Date(),
            number: 106.34,
            errors: [],
            errorVisible:false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    showAlert() {
        this.setState({errorVisible:true});
        setTimeout(() => this.setState({errorVisible:false}), 3000);
    }


    handleInputChange = event => {
        const key = event.target.name;
        const value = event.target.value;
        const obj = {};
        obj[key] = value;
        this.setState(obj);
    }

    handleSubmit = event => {
        event.preventDefault();

        var errors = [];

        // Check name of user
        if (this.state.name=== "") {
            errors.push("name");
        }

        // Check email address
        const expression = /\S+@\S+/;
        var validEmail = expression.test(String(this.state.email).toLowerCase());

        if (!validEmail) {
            errors.push("email");
        }

        // Check password length
        if (this.state.password.length<4) {
            errors.push("password");
        }

        this.setState({
            errors: errors
        });

        if (errors.length > 0) {
            return false;
        } else {
            postRegister({"name": this.state.name, "email": this.state.email,
                "password": md5(this.state.password)})
                .then(response =>  this.props.history.push('/login'))
                .catch((responseError) => {
                        this.setState({error: responseError.response.data.message})
                        this.showAlert()
                    }
                );
        }
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    render() {
        const { t } = this.props;
        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng);
        };

        const formats = {
            number: {
                ARP: {
                    style: 'currency',
                    currency: '$'
                },
                USD: {
                    style: 'currency',
                    currency: 'USD'
                }
            }
        };

        return(
            <div className="container-fluid bg">
                <br/>
                <br/>
                <MDBContainer>
                    <Row class="row">
                        <Col className="col-12 col-sm-4 col-lg-6 col-xl-6 pb-4">
                                <MDBCard>
                                    <Image className="card-img-top" src={process.env.PUBLIC_URL + '/signup.jpg'} alt="Sign Up image" />
                                    <MDBCardBody>
                                        <IntlProvider locale={i18n.language} formats={formats}
                                                      defaultFormats={formats}>
                                            <p class="list-group-item list-group-item-action list-group-item-primary text-dark">
                                                <b>{t("priceLegend")}</b>
                                            </p>
                                        </IntlProvider>
                                    </MDBCardBody>
                                </MDBCard>
                        </Col>
                        <Col className="col-12 col-sm-8 col-lg-6 col-xl-6">
                            <MDBRow class="row-sm d-flex justify-content-center">
                                <MDBCol class="col-sm-4">
                                    <MDBCard>
                                        <MDBCardBody>
                                            <Form onSubmit={this.handleSubmit} >
                                                <p className="h5 text-center mb-4 card-header">{t("registerTitle")}</p>
                                                <br/>
                                                <Alert  className="alert alert-dismissible" variant='primary' onClose={this.clearShowError} show={this.state.errorVisible}>
                                                    {this.state.error}
                                                </Alert>

                                                <FormGroup controlId="formUser " >
                                                    <label htmlFor="name" className="form-label">{t('name')}</label>
                                                    <input name="name" type="text" className={
                                                        this.hasError("name")
                                                            ? "form-control is-invalid"
                                                            : "form-control"
                                                    } icon="user" id="name"  onChange={this.handleInputChange} />
                                                    <div className={this.hasError("name") ? "invalid-feedback" : "visually-hidden"} >
                                                        {t("userInvalidFeedback")}
                                                    </div>
                                                </FormGroup>

                                                <FormGroup controlId="formBasicEmail" class="form" >
                                                    <label htmlFor="email" className="form-label">{t('email')}</label>
                                                    <input name="email" className={
                                                        this.hasError("email")
                                                            ? "form-control is-invalid"
                                                            : "form-control"
                                                    } type="email" icon="envelope" onChange={this.handleInputChange} size="sm"/>
                                                    <div className={this.hasError("email") ? "invalid-feedback" : "visually-hidden"} >
                                                        {t("emailInvalidFeedback")}
                                                    </div>
                                                </FormGroup>

                                                <FormGroup controlId="formBasicPassword">
                                                    <label htmlFor="password" className="form-label">{t('password')}</label>
                                                    <input name="password" className={
                                                        this.hasError("password")
                                                            ? "form-control is-invalid"
                                                            : "form-control"
                                                    } id="password" type="password" icon="lock"  onChange={this.handleInputChange} size="sm"/>
                                                    <div className={this.hasError("password") ? "invalid-feedback" : "visually-hidden"} >
                                                        {t("passwordInvalidFeedback")}
                                                    </div>
                                                </FormGroup>

                                                <Row>&nbsp;</Row>
                                                <MDBRow>
                                                    <MDBCol>
                                                        <Button variant="primary" type="submit"  > {t("send")} </Button>
                                                    </MDBCol>
                                                    <Col className="col-sm-5 text-right" >< App18/></Col>
                                                </MDBRow>
                                            </Form>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            </MDBRow>
                        </Col>
                    </Row>
                </MDBContainer>
            </div>
        );
    }
}

export default withTranslation() (RegisterForm);
