import React, {useContext, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {LoginPage} from "./pages/auth/LoginPage";
import {RegisterPage} from "./pages/auth/RegisterPage";
import {LogoutPage} from "./pages/auth/LogoutPage";
import {MainPage} from "./pages/MainPage";
import {AuthProvider, AuthContext} from "./contexts/AuthContext";
import {CategoriesProvider, CAtegoriesContext} from "./contexts/CategoriesContext";
import Dashboard from "./pages/admin/dashboard";

const options = {
    position: 'top right',
    timeout: 5000,
    transition: transitions.SCALE
}

function Index() {
    const authContext = useContext(AuthContext);

    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <Route path="/login" exact component={LoginPage} />
                    <Route path="/register" exact component={RegisterPage} />
                    <Route path="/logout" exact component={LogoutPage} />
                    <Route path="/admin/dashboard/" component={Dashboard} />
                    <Route path="/" component={MainPage} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

function IndexWithProviders() {
    return (
        <CategoriesProvider>
            <AuthProvider>
                <AlertProvider template={AlertTemplate} {...options}>
                    <Index>
                    </Index>
                </AlertProvider>
            </AuthProvider>
        </CategoriesProvider>
    );
}

export default IndexWithProviders;


if (document.getElementById('root')) {
    ReactDOM.render(<IndexWithProviders />, document.getElementById('root'));
}
