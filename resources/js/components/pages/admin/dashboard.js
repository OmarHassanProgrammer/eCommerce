import React, {useEffect, useContext, useState} from 'react';
import {isAuthenticated, me} from "../../../helperFiles/auth";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";
import {AuthContext} from "../../contexts/AuthContext";
import {BrowserRouter, Route, useRouteMatch, Switch} from "react-router-dom";
import HomePage from "./pages/homePage";
import UsersPage from "./pages/usersPage";
import TradersPage from "./pages/tradersPage";
import CategoriesPage from "./pages/categories/categoriesPage";
import AddCategory from "./pages/categories/addCategory";
import CategoryPage from "./pages/categories/categoryPage";

export default function Dashboard() {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const [admin, setAdmin] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('HOME');
    const [rerenderHref, setRerenderHref] = useState(true);
    let { path, url } = useRouteMatch();

    const handleRerenderEffect = () => {
        setRerenderHref(!rerenderHref);
    }

    useEffect(() => {
        switch(window.location.pathname) {
            case "/admin/dashboard":
                setActivePage('HOME');
                break;
            case "/admin/dashboard/users":
                setActivePage('USERS');
                break;
            case "/admin/dashboard/traders":
                setActivePage('TRADERS');
                break;
            case "/admin/dashboard/categories":
                setActivePage('CATEGORIES');
                break;
        }
    }, [rerenderHref]);

    useEffect(() => {
        me('ADMIN').then(r => {
            if(!r) {
                history.push('/');
            } else {
                setAdmin(r);
            }
        });

    }, [authContext.auth]);

    function toggleMenu() {
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <div className="dashboard-page">
            <div className={ "sidebar " + (sidebarOpen? "unclosed":"closed") }>
                <div className="sidebar-content">
                    <div className="head">
                    <h2 className="title">Dashboard</h2>
                    </div>
                    <ul className="links">
                       <li className={ "link " + (activePage === 'HOME'? 'active':'') } >
                           <Link to={`${url}`} onClick={handleRerenderEffect}>
                               <i className="fa fa-home"></i> <label>Home</label>
                           </Link>
                       </li>
                        <li className={"link " + (activePage === 'USERS'? 'active':'') }>
                            <Link to={`${url}/users`} onClick={handleRerenderEffect}>
                                <i className="fa fa-users"></i> <label>Users</label>
                            </Link>
                        </li>
                        <li className={"link " + (activePage === 'TRADERS'? 'active':'') }>
                            <Link to={`${url}/traders`} onClick={handleRerenderEffect}>
                                <i className="fa fa-money"></i> <label>Traders</label>
                            </Link>
                        </li>
                        <li className={"link " + (activePage === 'CATEGORIES'? 'active':'') }>
                            <Link to={`${url}/categories`} onClick={handleRerenderEffect}>
                                <i className="fa fa-drivers-license-o"></i> <label>Categories</label>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="content">
                <div className="my-container">
                    <div className="header">
                        <div className="header-content">
                            <span className={"toggle-menu " + (sidebarOpen? "":"closed")} onClick={() => toggleMenu()}>
                                <i className="fa fa-chevron-left fa-fixed"></i>
                            </span>
                            <div className="right">
                                <span className="bell">
                                    <i className="fa fa-bell"></i>
                                </span>
                                <span className="sign-out">
                                    <Link to="/logout" onClick={handleRerenderEffect}>
                                        <i className="fa fa-sign-out"></i>
                                    </Link>
                                </span>
                                <div className="admin">
                                    <span className="logo"></span>
                                    <span className="name">{ admin.name }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        <Switch>
                            <Route path={`${path}`} exact
                                   render={() => (
                                       <HomePage handleRerenderEffect={handleRerenderEffect} />
                                   )} />
                            <Route
                                path={`/admin/dashboard/users`} exact
                                render={() => (
                                    <UsersPage handleRerenderEffect={handleRerenderEffect} />
                                )} />
                            <Route
                                path={`/admin/dashboard/traders`} exact
                                render={() => (
                                    <TradersPage handleRerenderEffect={handleRerenderEffect} />
                                )} />
                            <Route
                                path={`/admin/dashboard/categories`} exact
                                render={() => (
                                    <CategoriesPage handleRerenderEffect={handleRerenderEffect} />
                                )} />
                            <Route
                                path={`/admin/dashboard/category/:categoryID`} exact
                                render={() => (
                                    <CategoryPage handleRerenderEffect={handleRerenderEffect} />
                                )} />
                            <Route
                                path={`/admin/dashboard/categories/addcategory`} exact
                                render={() => (
                                    <AddCategory handleRerenderEffect={handleRerenderEffect} />
                                )} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    );
}
