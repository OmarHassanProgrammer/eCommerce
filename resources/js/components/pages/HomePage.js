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

    return (<div className="home-page">
            {links}
        </div>);
}
