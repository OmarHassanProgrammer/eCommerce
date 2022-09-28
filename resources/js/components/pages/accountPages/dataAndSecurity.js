import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import {useAlert} from "react-alert";
import {Link, useHistory} from "react-router-dom";
import useState from "react-usestateref";
import {me} from "../../../helperFiles/auth";
import {Carousel} from "react-responsive-carousel";
import Axios from 'axios';

export default function DataAndSecurityPage() {
    const authContext = useContext(AuthContext);
    let history = useHistory();
    const alert = useAlert();

    /*
    useEffect(() => {
        if(!authContext.authRef.current.status) {
            alert.error(__("notLoggedIn", "messages"));
            history.push('/login');
        }
    }, [authContext.auth.status]);*/

    let editStatus = (elem, e) => {
        console.log(e.path[3]);
        e.path[3].classList.add("edit");
    }

    async function saveName(elem, e) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        
        let value = document.querySelector('.name-item .name-input').value;

        if(value.length < 3) {
            alert.error(__("nameMin3", "messages"));
        } else {
            let response = await axios.request({
                url: "auth/user/update",
                baseURL: baseUrl,
                data: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                    'name': value
                },
                method: "POST"
            }).then((response) => {
                if(response.status) {
                    localStorage.setItem('name', response.data.name);
                    localStorage.setItem('email', response.data.email);
                    localStorage.setItem('isTrader', response.data.is_trader);
                    localStorage.setItem('authType', 'USER'); 

                    authContext.setAuth({
                        'name': response.data.name,
                        'email': response.data.email,
                        'isTrader': response.data.is_trader,
                        'number': response.data.number,
                        'postal_code': response.data.postal_code,
                        'email_verified_at': response.data.email_verified_at,
                        'number_verified_at': response.data.number_verified_at,
                        'authType': 'USER',
                        'status': true
                    });
                    document.querySelector('.name-item').classList.remove('edit');

                }
            });
        }
    }

    async function saveEmail(elem, e) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        
        let value = document.querySelector('.email-item .email-input').value;

        if(value.length < 3) {
            alert.error(__("emailNotValid", "messages"));
        } else {
            let response = await axios.request({
                url: "auth/user/update",
                baseURL: baseUrl,
                data: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                    'email': value
                },
                method: "POST"
            }).then((response) => {
                if(response.status) {
                    localStorage.setItem('name', response.data.name);
                    localStorage.setItem('email', response.data.email);
                    localStorage.setItem('isTrader', response.data.is_trader);
                    localStorage.setItem('authType', 'USER'); 

                    authContext.setAuth({
                        'name': response.data.name,
                        'email': response.data.email,
                        'isTrader': response.data.is_trader,
                        'number': response.data.number,
                        'postal_code': response.data.postal_code,
                        'email_verified_at': response.data.email_verified_at,
                        'number_verified_at': response.data.number_verified_at,
                        'authType': 'USER',
                        'status': true
                    });
                    document.querySelector('.email-item').classList.remove('edit');

                }
            });
        }
    }

    async function savePassword(elem, e) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        
        let currentPassword = document.querySelector('.password-item .current-password').value;
        let newPassword = document.querySelector('.password-item .new-password').value;
        let confirmPassword = document.querySelector('.password-item .confirm-password').value;

        if(confirmPassword !== newPassword) {
            alert.error(__("passwordNotMatch", "messages"));
        } else {
            if(newPassword.length < 5) {
                alert.error(__("passwordMin5", "messages"));
            } else {
                let response = await axios.request({
                    url: "auth/user/update",
                    baseURL: baseUrl,
                    data: {
                        'api_password': localStorage.getItem('api_password'),
                        'token': _token,
                        'currentPassword': currentPassword,
                        'newPassword': newPassword
                    },
                    method: "POST"
                }).then((response) => {
                        if(response.data === 'currentPasswordNotCorrect') {
                            alert.error(__("currentPasswordNotCorrect", "messages"));
                        } else {
                            document.querySelector('.email-item').classList.remove('edit');
                        }
                    }
                );
            }
        }

    }

    return (
        <div className="data-and-security">
            <div className='container'>
                <div className='account-route'>
                    <Link to={location => ({ ...location, pathname: `./`})}>Account</Link> / Data & Security
                </div>
                <div className='title'>Data And Security</div>
                <ul className='content'>
                    <li className='item name-item'>
                        <div className='left'>
                            <div className='title'>Name: </div>
                            <div className='non-edit'>
                                <div className='value'>{ authContext.authRef.current.name }</div>
                            </div>
                            <div className='edit'>
                                <input className='name-input' defaultValue={ authContext.authRef.current.name } />
                            </div>
                        </div>
                        <div className='right'>
                            <div className='non-edit'>
                                <div className='btn' onClick={() => { editStatus(this, event) }}>Edit</div>
                            </div>
                            <div className='edit'>
                                <div className='btn' onClick={() => { saveName() }}>Save</div>
                            </div>
                        </div>
                    </li>
                    <li className='item email-item'>
                        <div className='left'>
                            <div className='title'>Email: </div>
                            <div className='non-edit'>
                                <div className='value'>{ authContext.authRef.current.email }</div>
                            </div>
                            <div className='edit'>
                                <input className='email email-input' defaultValue={ authContext.authRef.current.email } onChange={() => {}} />
                            </div>
                        </div>
                        <div className='right'>
                            <div className='non-edit'>
                                <div className='btn' onClick={() => { editStatus(this, event) }}>Edit</div>
                            </div>
                            <div className='edit'>
                                <div className='btn' onClick={() => { saveEmail() }}>Save</div>
                            </div>
                        </div>
                    </li>
                    <li className='item'>
                        <div className='left'>
                            <div className='title'>Number: </div>
                            <div className='non-edit'>
                                <div className='value'>+201021853989</div>
                            </div>
                            <div className='edit'>
                                <input className='prefix' defaultValue='+20'  onChange={() => {}}/>
                                <input defaultValue='1021853989'  onChange={() => {}}/>
                            </div>
                        </div>
                        <div className='right'>
                            <div className='non-edit'>
                                <div className='btn' onClick={() => { editStatus(this, event) }}>Edit</div>
                            </div>
                            <div className='edit'>
                                <div className='btn' onClick={() => {  }}>Save</div>
                            </div>
                        </div>
                    </li>
                    <li className='item password-item'>
                        <div className='left'>
                            <div className='title'>Password: </div>
                            <div className='non-edit'>
                                <div className='value'>**********</div>
                            </div>
                            <div className='edit'>
                                <div className='password-field'>
                                    <span className='input-title'>Current Password: </span><input className='current-password' type='password' onChange={() => {}}/>
                                </div>
                                <div className='password-field'>
                                    <span className='input-title'>New Password: </span><input className='new-password' type='password' onChange={() => {}}/>
                                </div>
                                <div className='password-field'>
                                    <span className='input-title'>Confirm Password: </span><input className='confirm-password' type='password' onChange={() => {}}/>
                                </div>
                            </div>
                        </div>
                        <div className='right'>
                            <div className='non-edit'>
                                <div className='btn' onClick={() => { editStatus(this, event) }}>Edit</div>
                            </div>
                            <div className='edit'>
                                <div className='btn' onClick={() => { savePassword() }}>Save</div>
                            </div>
                        </div>
                    </li>{
                                !authContext.authRef.current.email_verified_at?
                                <li className='item'>
                                    <div className='left'>
                                        <div className='title'>Verify your email </div>
                                        <div className='item_content'>You have to verify your email before buy or sell any product</div>
                                    </div>
                                    <div className='right'><div className='btn'>Verify</div></div>
                                </li>:""
                            }
                            {
                                !authContext.authRef.current.number_verified_at?
                                <li className='item'>
                                    <div className='left'>
                                        <div className='title'>Verify your phone number </div>
                                        <div className='item_content'>You have to verify your email before buy or sell any product</div>
                                    </div>
                                    <div className='right'><div className='btn'>Verify</div></div>
                                </li>:""
                            }
                </ul>
                <Link to={location => ({ ...location, pathname: `./`})} className='done-btn'>Done</Link>
            </div>
        </div>
    );
}
