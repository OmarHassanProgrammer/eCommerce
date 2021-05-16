import React, {useContext} from 'react';
import axios from "axios";
import useState from "react-usestateref";

const authTypes = [
    'USER',
    'ADMIN',
    'ALL'
];

export async function isAuthenticated(authType) {
    const _token = localStorage.getItem('_token');
    let result = false;

    if(authTypes.includes(authType)) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        console.log('1');

        switch(authType) {
            case 'USER':
            case 'ALL' :
                await axios.request({
                    url: "auth/user/me",
                    baseURL: baseUrl,
                    params: {
                        'api_password': localStorage.getItem('api_password'),
                        'token': _token
                    },
                    method: "GET"})
                .then(response => {
                    result = response.data.status? true:result;
                })
                .catch(error => {
                    console.log(error.response);
                });
            case 'ADMIN':
            case 'ALL' :
                await axios.request({
                    url: "auth/admin/me",
                    baseURL: baseUrl,
                    params: {
                        'api_password': localStorage.getItem('api_password'),
                        'token': _token
                    },
                    method: "GET"
                }).then(response => {
                    result = response.data.status? true:result;
                }).catch(error => {
                    console.log(error.response);
                });
            default:
                break;
        }
    }
    return result;
}

export async function me(authType = 'ALL') {
    const _token = localStorage.getItem('_token');
    const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
    let r;

    if((authType === 'USER' || authType === 'ALL') && await isAuthenticated('USER')) {
        await axios.request({
            url: "auth/user/me",
            baseURL: baseUrl,
            params: {
                'api_password': localStorage.getItem('api_password'),
                'token': _token
            },
            method: "GET"})
            .then(response => {
                r = response.data.auth;
            })
    } else if((authType === 'ADMIN' || authType === 'ALL') && await isAuthenticated('ADMIN')) {
        await axios.request({
            url: "auth/admin/me",
            baseURL: baseUrl,
            params: {
                'api_password': localStorage.getItem('api_password'),
                'token': _token
            },
            method: "GET"})
            .then(response => {
                r = response.data.auth;
            })
    } else {
        r = false;
    }

    return r;
}
