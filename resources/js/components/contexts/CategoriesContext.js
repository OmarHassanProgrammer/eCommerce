import React, { useEffect } from "react";
import useState from 'react-usestateref';

export const CategoriesContext = React.createContext();


export function CategoriesProvider(props) {
    const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
    let [categories, setCategories, categoriesRef] = useState({});
    let [topCategories, setTopCategories, topCategoriesRef] = useState({});
    
    async function getCategories() {
        await axios.request({
            url: "category/getAll",
            baseURL: baseUrl,
            params: {
                'api_password': localStorage.getItem('api_password'),
                'parentGroup': 'ALL',
                'pagination': 0
            },
            method: "GET"
        })
        .then(response => {
            setCategories(response.data);
        });
    }

    async function getTopCategories() {
        await axios.request({
            url: "category/getTopCategories",
            baseURL: baseUrl,
            params: {
                'api_password': localStorage.getItem('api_password')
            },
            method: "GET"
        })
        .then(response => {
            console.log(response.data);
            setTopCategories(response.data);
        });
    }

    useEffect(() => {
        getCategories();
        getTopCategories();
    }, []);

    return (<CategoriesContext.Provider value={{
        categories, setCategories, categoriesRef,
        topCategories, setTopCategories, topCategoriesRef,
        getCategories, getTopCategories
        }}>
        { props.children }
    </CategoriesContext.Provider>);
}
