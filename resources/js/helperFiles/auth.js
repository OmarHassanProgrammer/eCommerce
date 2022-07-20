import React, {useContext} from 'react';
import axios from "axios";
import useState from "react-usestateref";

const authTypes = [
    'USER',
    'ADMIN',
    'ALL'
];

export async function me(authType = 'ALL') {
    const _token = localStorage.getItem('_token');
    
    if(_token) {
        if ((authType === "ALL" || authType === "USER") && (localStorage.getItem('authType') === "USER")) {
            return {
                'name': localStorage.getItem('name'),
                'email': localStorage.getItem('email'),
                'isTrader': localStorage.getItem('isTrader'),
                'authType': "USER"
            }
        }
        else if ((authType === "ALL" || authType === "ADMIN") && (localStorage.getItem('authType') === "ADMIN")) {
            return {
                'name': localStorage.getItem('name'),
                'email': localStorage.getItem('email'),
                'authType': "ADMIN"
            }
        }
    }

}
