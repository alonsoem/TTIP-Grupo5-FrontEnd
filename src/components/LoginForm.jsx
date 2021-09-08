import React, { Component } from 'react';
import {Form, Button, FormGroup, Row, Col, Alert, Image} from "react-bootstrap";
import i18n from "../i18n";
import { withTranslation } from 'react-i18next';

import { MDBInput, MDBCard, MDBCardBody } from 'mdbreact';
import * as md5 from "md5";
import App18 from "../App18";
import "./otros.css";
import {postLogin} from "../api/api";


class LoginForm extends Component {


  constructor(props){
    super(props);
    this.state = {
        email: '',
        password: '',
        error: '',
        errorVisible:false,
  };




  this.handleChangeEmail = this.handleChangeEmail.bind(this);
  this.handleChangePassword = this.handleChangePassword.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);

}


    handleChangeEmail = event => {
        this.setState({ email: event.target.value });
    }

    handleChangePassword = event => {
        const encPwd = md5(event.target.value);
        this.setState({ password: encPwd });
    }

     showAlert() {

        this.setState({errorVisible:true});
        setTimeout(
            () => this.setState({errorVisible:false})
            , 3000);

    }

    handleSubmit = event => {
        event.preventDefault();
        postLogin({"username": this.state.email, "password": this.state.password })
            .then((response) => {
                localStorage.setItem('token',response.jwt)
                this.props.history.push('/taxes')
            })
            .catch((responseError) =>{
                this.setState({error: responseError.response.data.message})
                this.showAlert()
            })

    }
    componentDidMount(){
        console.log("AMBIENTE: " + process.env.NODE_ENV );
        console.log("REACT ENDPOINT:" + process.env.REACT_APP_API_ENDPOINT);
    }

    render() {

        const { t } = this.props;
        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng);
        };
        return(
            <div className="container-fluid bg " >
            <div className="container" >

                <Row className="justify-content-center padding-5">
                    <Col className="col-1 col-sm-2 col-md-3 col-lg-3 col-xl-4"></Col>
                    <Col className="col-10 col-sm-8 col-md-6 col-lg-6 col-xl-4" >

                            <MDBCard>
                            <MDBCardBody>

                                <Form onSubmit={this.handleSubmit}>
                                    <p className="h5 text-center sm-4">{t("loginTitle")}</p>

                                    <Row className="justify-content-center justify-content-sm-center justify-content-lg-center justify-content-md-center justify-content-xl-center vertical">

                                        <Col className="col-6 ">
                                            <Image src={process.env.PUBLIC_URL + '/logo.png'} width="100%" height="100%"  />
                                        </Col>

                                    </Row>
                                    <br/>
                                    <Alert  className="alert alert-dismissible" variant='primary' show={this.state.errorVisible}>
                                        {this.state.error}
                                    </Alert>
                                    <FormGroup controlId="formBasicEmail">
                                        <MDBInput type="text" label={t('email')}  icon="envelope" placeholder={t('email_help')} onChange={this.handleChangeEmail} />
                                    </FormGroup>

                                    <FormGroup controlId="formBasicPassword">
                                        <MDBInput type="password" label={t('password')}  icon="lock" placeholder={t('password_help')} onChange={this.handleChangePassword} />
                                    </FormGroup>

                                    <Row className="justify-content-center" >
                                        <Col className="justify-content-middle text-center" >
                                            <Button variant="primary" type="submit" className="align-content-center"  >
                                                {t("send")}
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Row>&nbsp;</Row>

                                    <Row className="justify-content-center">
                                        <Col className="col-sm-5 align-content-md-center "  >
                                            <a align="right" href="register" className="link-secondary">{t("register")}</a>
                                        </Col>

                                        <Col className="col-sm-5 text-right" >< App18/></Col>
                                    </Row>


                                </Form>
                            </MDBCardBody>
                            </MDBCard>

                    </Col>
                    <Col className="col-1 col-sm-2 col-md-3 col-lg-3 col-xl-4"></Col>

                </Row>

            </div>
            </div>


        );
    }

}
export default withTranslation() (LoginForm);


