import React, {useEffect, useContext, useState} from 'react';
import {Link} from "react-router-dom";

export default function TradersPage(props) {
    const [traders, setTraders] = useState([]);
    const [forceUpdateVal, forceUpdate] = useState("");

    // useEffect(() => {
    //     forceUpdate(window.location.href);
    //     console.log(window.location.href);
    // }, [window.location.href]);

    useEffect(() => {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        async function getUsers() {
            await axios.request({
                url: "auth/user/getUsers",
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                    'type': "TRADERS",
                    'pagination': 0
                },
                method: "GET"
            })
                .then(response => {
                    console.log(response.data);
                    setTraders(response.data);
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
        getUsers();
    }, []);

    return (
        <div className="traders-page">
            <div aria-label="breadcrumb" className="breadcrumb-container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard/' onClick={props.handleRerenderEffect} >Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Traders</li>
                </ol>
            </div>
            <div className="traders">
                {
                    traders.map((trader, index) => (
                        <div className="trader" key={index}>
                            <div className="image"></div>
                            <div className="name">
                                { trader.name }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
