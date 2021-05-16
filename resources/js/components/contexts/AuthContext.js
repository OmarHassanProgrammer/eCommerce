import React, { useEffect } from "react";
import useState from 'react-usestateref';
import {isAuthenticated} from "../../helperFiles/auth";

export const AuthContext = React.createContext();


export function AuthProvider(props) {
    const [auth, setAuth, authRef] = useState({});

    function deleteAuth () {
        localStorage.removeItem('_token');
        localStorage.removeItem('email');
        setAuth({});
        console.log("deleted");
    }

    async function run(_token) {
        if(_token) {
            await isAuthenticated('ALL').then(r => {
                if(r) {
                    setAuth({
                        '_token': _token
                    });
                } else {
                    deleteAuth();
                    console.log("clear auth");
                }
            });
        } else {
        }
    }

    useEffect(() => {
        const _token = localStorage.getItem('_token');
        const email = localStorage.getItem('email');

        run(_token);

    },[]);

    return (<AuthContext.Provider value={{auth, setAuth, authRef, deleteAuth, run}}>
        { props.children }
    </AuthContext.Provider>);
}
