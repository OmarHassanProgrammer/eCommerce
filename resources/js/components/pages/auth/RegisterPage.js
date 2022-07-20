import {Field, Formik, ErrorMessage} from "formik";
import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory} from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext";
import {useAlert} from "react-alert";
import axios from "axios";
import * as Yup from 'yup';


export function RegisterPage() {
    const authContext = useContext(AuthContext);
    const alert = useAlert();
    let history = useHistory();


    useEffect(() => {
        if(authContext.authRef.current.status) {
            alert.error(__("generalError", "messages"));
            history.push('/');
        }
    }, [authContext.authRef.current.status]);

    let form = (props) => {
        return (<form onSubmit={props.handleSubmit}>
            <div className="fields">
                <div className="field">
                    <Field type="text" name="name" className="name-input" placeholder="Your Name" />
                    <span className="error">
                        <ErrorMessage name="name"/>
                    </span>
                </div>
                <div className="field">
                    <Field type="email" name="email" className="email-input" placeholder="Email Address" />
                    <span className="error">
                        <ErrorMessage name="email"/>
                    </span>
                </div>
            </div>
            <Field type="password" name="password" className="password-input" placeholder="Password" />
            <Field type="password" name="cPassword" className="cpassword-input" placeholder="Confirm Password" />
            <span className="error">
                <ErrorMessage name="password"/>
            </span>
            <div className="">
                <Field type="checkbox" name="trader" className="" />
                <label className="checkbox-label">I want to be a trader too</label>
            </div>
            <div className="">
                <Field type="checkbox" name="privacy" className="" />
                <label className="checkbox-label">
                    I agree to <span className="fake-link">Conditions of Use</span> and <span className="fake-link">Privacy Notice</span>?
                </label>
            </div>

            <div className="buttons">
                <input className={"register-btn " + (props.values.privacy?"":"disabled")} disabled={!props.values.privacy} type="submit" value="REGISTER" />
                <Link className="login-btn" to={"/login"}>HAVE ACCOUNT?</Link>
            </div>
        </form>);
    }

    let schema = () => {
        return Yup.object().shape({
            name: Yup.string().required().min(3),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(5),
            cPassword: Yup.string().required().min(5)
        });
    }

    function validateResponse(response) {
        if(response.status == 200) {
            if(response.data.status) {
                let _token = response.data.auth._token;
                let email = response.data.auth.email;
                let name = response.data.auth.name;
                let isTrader = response.data.auth.is_trader;
                localStorage.setItem('_token', _token);
                localStorage.setItem('email', email);
                localStorage.setItem('name', name);
                localStorage.setItem('isTrader', isTrader);
                history.push('/');
                authContext.setAuth({
                    'name': name,
                    'email': email,
                    'isTrader': isTrader,
                    'authType': 'USER',
                    'status': true,
                });
                alert.success(__('successLogin', 'messages'));
                return true;
            } else {
                if(response.data.errNum == "E001") {
                    alert.error(__('generalError', 'messages'));
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            alert.error(__('generalError', 'messages'));
            return true;
        }
    }
    async function onSubmit(values) {
        try {
            try {
                const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');

                if(values.password !== values.cPassword) {
                    alert.error("password");
                    values.password = "";
                    values.cPassword = "";
                    return true;
                }

                console.log(values.trader);

                let response = await axios.request({
                    url: "auth/user/register",
                    baseURL: baseUrl,
                    data: {
                        'api_password': localStorage.getItem('api_password'),
                        'name': values.name,
                        'email': values.email,
                        'password': values.password,
                        'isTrader': values.trader
                    },
                    method: "POST"
                });
                if (!validateResponse(response)) {
                    let response = await axios.request({
                        url: "auth/admin/login",
                        baseURL: baseUrl,
                        data: {
                            'api_password': localStorage.getItem('api_password'),
                            'email': values.email,
                            'password': values.password
                        },
                        method: "POST"
                    });
                    if (!validateResponse(response)) {
                        alert.error(__("errorEmailOrPassword", "messages"));
                    }
                }
            } catch(error) {
                alert.error(__('generalError', 'messages'));
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <div className="register-page">
        <div className="register-form">
            <h2 className="title">Register</h2>
            <Formik
                initialValues={{name: "", email: "", password: "", cPassword: "", trader: ""}}
                onSubmit={onSubmit}
                render={form}
                validationSchema={schema()} />
            <div className="line"></div>
            <button className="login-google">LOG IN WITH GOOGLE</button>
            <button className="login-facebook">LOG IN WITH FACEBOOK</button>
        </div>
    </div>
}

