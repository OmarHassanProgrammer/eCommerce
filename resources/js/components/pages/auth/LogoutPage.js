import {Formik, Field} from "formik";
import React, {useContext, useEffect} from "react";
import {Redirect, useHistory} from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext";
import {useAlert} from "react-alert";
import axios from "axios";
import {isAuthenticated} from "../../../helperFiles/auth";


export function LogoutPage() {
    const authContext = useContext(AuthContext);
    const alert = useAlert();
    const history = useHistory();
    const url = localStorage.getItem('host') + localStorage.getItem('api_extension');

    async function _logout(r) {
        if(r) {
            await authContext.run(localStorage.getItem('_token')).then( async function() {
                await axios.request({
                    url: "/auth/user/logout",
                    baseURL: url,
                    params: {
                        'api_password': localStorage.getItem('api_password'),
                        'token': authContext.authRef.current._token
                    },
                    method: "GET"
                }).then(response => {
                    if (response.status == 200) {
                        authContext.deleteAuth();

                        history.push('/');
                        alert.success(__("successLogout", "messages"));
                    } else {
                        alert.error(__("generalError", "messages"));
                    }
                });
            });

        } else {
            alert.error(__("generalError", "messages"));
            history.push("/");
        }
    }

    function logout() {
        try {
            isAuthenticated('ALL').then(r => {
                _logout(r);
            });
        } catch(error) {
            console.log(error);
            alert.error(__("generalError", "messages"));
        }
    }

    useEffect(() => {
        logout();
    }, []);

    return "";
}
