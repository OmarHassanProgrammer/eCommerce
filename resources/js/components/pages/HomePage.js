import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import {isAuthenticated, me} from "../../helperFiles/auth";

export function HomePage() {
    const [links, setLinks] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        let _links = [<Link to="" key="home">Home</Link>];
        if(authContext.auth._token) {
            _links.push(<Link to="logout" key="logout">logout</Link>);
        } else {
            _links.push([
                <Link to="register" key="register">Register</Link>,
                <Link to="login" key="login">Login</Link>
            ]);
        }
        isAuthenticated('ADMIN').then(r => {
            if(r) {
                _links.push(<Link to="admin/dashboard" key="dashboard">Dashboard</Link>);
            }
            setLinks([
                ..._links
            ]);
        });
    }, [authContext.auth._token]);

    return (
        <div className="home-page">
            <div className="upper-nav">
                <div className="container">
                    <ul className="left-list nav-list">
                        <li className="item"><i className="fa fa-truck" aria-hidden="true"></i> Free Shipping</li>
                        <li className="item"><i className="fa fa-refresh" aria-hidden="true"></i> Free Returns</li>
                        <li className="item"><i className="fa fa-usd" aria-hidden="true"></i> Cash on Delivery</li>
                        <li className="item"><i className="fa fa-clock-o" aria-hidden="true"></i> 24 Work Hours</li>
                    </ul>
                    <ul className="right-list nav-list">
                        {
                            !authContext.auth._token?<li className="item">
                                <Link to="login" key="login">Log in</Link> or <Link to="register" key="register">Register</Link>
                                                    </li>:""
                        }
                        <li className="item">Daily Offers</li>
                        <li className="item">Buy what you need</li>
                        <li className="item">Sell with us</li>
                        <li className="item">English</li>

                    </ul>
                </div>
            </div>
            <div className="main-nav"></div>
            <div className="content">
                <div className="container">
                    {links}
                </div>
            </div>
        </div>);
}
