import {Field, Formik, ErrorMessage} from "formik";
import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory} from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext";
import {useAlert} from "react-alert";
import axios from "axios";
import * as Yup from 'yup';


export function LoginPage() {
    const authContext = useContext(AuthContext);
    const alert = useAlert();
    const [loggedin, setLoggedin] = useState(false);
    let history = useHistory();

    useEffect(() => {
        console.log(authContext.authRef.current.status);
        if(authContext.authRef.current.status) {
            alert.error(__("alreadyLoggedIn", "messages"));
            history.push('/');
        }
    }, [authContext.auth.status]);

    let form = (props) => {
        return <form onSubmit={props.handleSubmit}>

                    <Field type="email" name="email" className="email-input" placeholder="Email Address" />
                    <span className="error">
                        <ErrorMessage name="email"/>
                    </span>
                    <Field type="password" name="password" className="password-input" placeholder="Password" />
                    <span className="error">
                        <ErrorMessage name="password"/>
                    </span>
                    <div className="buttons">
                        <input className="login-btn" type="submit" value="LOG IN" />
                        <Link className="register-btn" to={"/register"}>CREATE AN ACCOUNT</Link>
                    </div>
                    <button className="reset-password">RESET PASSWORD</button>
                </form>;
    }

    let schema = () => {
        return Yup.object().shape({
            email: Yup.string().required().email(),
            password: Yup.string().required().min(5)
        });
    }

    function validateResponse(response, authType) {
        if(response.status == 200) {
            if(response.data.status) {
                setLoggedin(true);

                let _token = response.data.auth._token;
                let email = response.data.auth.email;
                let name = response.data.auth.name;
                localStorage.setItem('_token', _token);
                localStorage.setItem('email', email);
                localStorage.setItem('name', name);

                history.push('/');
                if(authType === "USER") {
                    let isTrader = response.data.auth.is_trader;
                    localStorage.setItem('isTrader', isTrader);
                    authContext.setAuth({
                        'name': name,
                        'email': email,
                        'isTrader': isTrader,
                        'authType': 'USER',
                        'status': true,
                    });
                } else if (authType === "ADMIN") {
                    authContext.setAuth({
                        'name': name,
                        'email': email,
                        'authType': 'ADMIN',
                        'status': true,
                    });
                }

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

                let response = await axios.request({
                    url: "auth/user/login",
                    baseURL: baseUrl,
                    data: {
                        'api_password': localStorage.getItem('api_password'),
                        'email': values.email,
                        'password': values.password
                    },
                    method: "POST"
                });
                if (!validateResponse(response, 'USER')) {
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
                    if (!validateResponse(response, 'ADMIN')) {
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

    return <div className="login-page">
        <div className="login-form">
            <h2 className="title">Log In</h2>
            <Formik
                initialValues={{email: "", password: ""}}
                onSubmit={onSubmit}
                render={form}
                validationSchema={schema()} />
            <div className="line"></div>
            <button className="login-google">LOG IN WITH GOOGLE</button>
            <button className="login-facebook">LOG IN WITH FACEBOOK</button>
        </div>
    </div>
}
