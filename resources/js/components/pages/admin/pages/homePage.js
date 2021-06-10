import React, {useEffect, useContext, useState} from 'react';
import {Link} from "react-router-dom";

export default function HomePage(props) {
    const [users, setUsers] = useState([]);
    const [traders, setTraders] = useState([]);
    const [forceUpdateVal, forceUpdate] = useState("");

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
                    'type': "USERS",
                    'pagination': 12
                },
                method: "GET"
            })
                .then(response => {
                    setUsers(response.data.data);
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
        getUsers();

        async function getTraders() {
            await axios.request({
                url: "auth/user/getUsers",
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                    'type': "TRADERS",
                    'pagination': 12
                },
                method: "GET"
            })
                .then(response => {
                    console.log(response);
                    setTraders(response.data.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        getTraders();
    }, []);

    return (
        <div className="home-page">
            <div aria-label="breadcrumb" className="breadcrumb-container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active">Home</li>
                </ol>
            </div>
            <div className="new-users">
                <div className="new-users-header">
                    <h2 className="title">New Users</h2>
                    <Link className="seemore" to="/admin/dashboard/users" onClick={props.handleRerenderEffect}>See More</Link>
                </div>
                <ol className="new-users-list row">
                    {
                        users.map((user, index) => (
                            <div className="new-user col-1" key={index} data-id={user.id}>
                                <div className="image">
                                    <div className="image-content"></div>
                                </div>
                                <div className="name">
                                    { user.name }
                                </div>
                            </div>
                        ))
                    }
                </ol>
            </div>
            <div className="new-traders">
                <div className="new-traders-header">
                    <h2 className="title">New Traders</h2>
                    <Link className="seemore" to="/admin/dashboard/traders" onClick={props.handleRerenderEffect}>See More</Link>
                </div>
                <ol className="new-traders-list row">
                    {
                        traders.map((trader, index) => (
                            <div className="new-trader col-1" key={index} data-id={trader.id}>
                                <div className="image">
                                    <div className="image-content"></div>
                                </div>
                                <div className="name">
                                    { trader.name }
                                </div>
                            </div>
                        ))
                    }
                </ol>
            </div>
        </div>
    );
}
