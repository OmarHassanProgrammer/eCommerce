import React, { useEffect } from "react";
import useState from 'react-usestateref';
import {isAuthenticated} from "../../helperFiles/auth";

export const AuthContext = React.createContext();


export function AuthProvider(props) {
    const [auth, setAuth, authRef] = useState({});

    function deleteAuth () {
        localStorage.removeItem('_token');
        localStorage.removeItem('email');
        localStorage.removeItem('isTrader');
        localStorage.removeItem('authType');
        setAuth({'status': false});
        console.log("deleted");
    }

    async function isAuthenticated() {
        const _token = localStorage.getItem('_token');
        let isAuthenticated = false;

        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        console.log('1');

        await axios.request({
            url: "auth/user/me",
            baseURL: baseUrl,
            params: {
                'api_password': localStorage.getItem('api_password'),
                'token': _token
            },
            method: "GET"})
        .then(response => {
            console.log(response.data);
            if(response.data.status) {
                localStorage.setItem('name', response.data.auth.name);
                localStorage.setItem('email', response.data.auth.email);
                localStorage.setItem('isTrader', response.data.auth.is_trader);
                localStorage.setItem('authType', 'USER'); 
                isAuthenticated = true;

                setAuth({
                    'name': response.data.auth.name,
                    'email': response.data.auth.email,
                    'isTrader': response.data.auth.is_trader,
                    'number': response.data.auth.number,
                    'postal_code': response.data.auth.postal_code,
                    'email_verified_at': response.data.auth.email_verified_at,
                    'number_verified_at': response.data.auth.number_verified_at,
                    'authType': 'USER',
                    'status': true
                });
                console.log(auth);
                console.log(authRef);
            }
        })
        .catch(error => {
            console.log(error.response);
        });
        
        await axios.request({
            url: "auth/admin/me",
            baseURL: baseUrl,
            params: {
                'api_password': localStorage.getItem('api_password'),
                'token': _token
            },
            method: "GET"
        }).then(response => {
            if(response.data.status) {
                localStorage.setItem('name', response.data.auth.name);
                localStorage.setItem('email', response.data.auth.email);
                localStorage.setItem('authType', 'Admin');
                isAuthenticated = true;

                setAuth({
                    'name': response.data.auth.name,
                    'email': response.data.auth.email,
                    'authType': 'ADMIN',
                    'status': true
                });
            }
        }).catch(error => {
            console.log(error.response);
        });

        if(!isAuthenticated) {
            deleteAuth();
            return false;
        } else {
            return "Nice";
        }
    }

    useEffect(() => {
        
        let checkAuthenticate = () => {
            isAuthenticated().then(r => {
                console.log(r);
                console.log(auth);
                console.log(authRef);
            });
        }
        setInterval(checkAuthenticate, 300000);
        checkAuthenticate();

    }, []);

    return (<AuthContext.Provider value={{auth, setAuth, authRef, deleteAuth, isAuthenticated}}>
        { props.children }
    </AuthContext.Provider>);
}
