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
import Switch from "react-switch";

export default function SellSettingsPage() {
    const authContext = useContext(AuthContext);
    let history = useHistory();
    const alert = useAlert();
    let [sellerChecked, setSellerChecked, sellerCheckedRef] = useState(false);


    
    useEffect(() => {
        /*if(!authContext.authRef.current.status) {
            alert.error(__("notLoggedIn", "messages"));
            history.push('/login');
        }*/
        if (authContext.authRef.current.status) {
            setSellerChecked((authContext.authRef.current.isTrader === 1));
        } else {
            setSellerChecked(false);
        }
    }, [authContext.auth.status]);

    let editStatus = (elem, e) => {
        console.log(e.path[3]);
        e.path[3].classList.add("edit");
    }

    async function savePostalCode(elem, e) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        
        let value = document.querySelector('.postal-code-item .postal-code-input').value;

        if(value.length < 5) {
            alert.error(__("postalCode5", "messages"));
        } else {
            let response = await axios.request({
                url: "auth/user/update",
                baseURL: baseUrl,
                data: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                    'postal_code': value
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
                    document.querySelector('.postal-code-item').classList.remove('edit');

                }
            });
        }
    }

    async function handleSeller() {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        
        setSellerChecked(!sellerCheckedRef.current);

        let response = await axios.request({
            url: "auth/user/update",
            baseURL: baseUrl,
            data: {
                'api_password': localStorage.getItem('api_password'),
                'token': _token,
                'isTrader': sellerCheckedRef.current?'yes':'no'
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
                    'authType': 'USER',
                    'status': true
                });
                document.querySelector('.email-item').classList.remove('edit');

            }
        });
    }

    return (
        <div className="data-and-security">
            <div className='container'>
                <div className='account-route'>
                    <Link to={location => ({ ...location, pathname: `./`})}>Account</Link> / Selling Settings
                </div>
                <div className='title'>Data And Security</div>
                <ul className='content'>
                    <li className='item be-seller-item'>
                        <div className='left'>
                            <div className='title'>Be a Seller</div>
                        </div>
                        <div className='right'>
                            <Switch onChange={handleSeller} checked={sellerCheckedRef.current} />
                        </div>
                    </li> 
                    { 
                    sellerCheckedRef.current?
                        <div>
                            <li className={!authContext.authRef.current.postal_code?'item postal-code-item edit':'item postal-code-item'}>
                                <div className='left'>
                                    <div className='title'>Nearest Postal Code: </div>
                                    <div className='non-edit'>
                                        <div className='value'>{ authContext.authRef.current.postal_code }</div>
                                    </div>
                                    <div className='edit'>
                                        <input className='postal-code postal-code-input' defaultValue={ authContext.authRef.current.postal_code?authContext.authRef.current.postal_code:"" } onChange={() => {}} />
                                    </div>
                                </div>
                                <div className='right'>
                                    <div className='non-edit'>
                                        <div className='btn' onClick={() => { editStatus(this, event) }}>Edit</div>
                                    </div>
                                    <div className='edit'>
                                        <div className='btn' onClick={() => { savePostalCode() }}>Save</div>
                                    </div>
                                </div>
                            </li>
                            {
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
                        </div>:""
                        }
                    
                </ul>
                <Link to={location => ({ ...location, pathname: `./`})} className='done-btn'>Done</Link>
            </div>
        </div>
    );
}
