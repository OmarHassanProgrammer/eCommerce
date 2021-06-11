import React, {useEffect, useContext} from 'react';
import useState from 'react-usestateref';
import {Link} from "react-router-dom";
import {AuthContext} from "../../../../contexts/AuthContext";
import {me} from "../../../../../helperFiles/auth";

export default function CategoriesPage(props) {
    const [categories, setCategories] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        me('ADMIN').then(r => {
            if(!r) {
                history.push('/');
            }
        });

    }, [authContext.auth]);

    useEffect(() => {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        async function getCategories() {
            await axios.request({
                url: "category/getAll",
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'parentGroup': "ALL",
                    'pagination': 0
                },
                method: "GET"
            })
                .then(response => {
                    console.log(response.data);
                    setCategories(response.data);
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
        getCategories();
    }, []);

    return (
        <div className="categories-page">
            <div aria-label="breadcrumb" className="breadcrumb-container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard' onClick={props.handleRerenderEffect} >Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Categories</li>
                </ol>
            </div>
            <div className="categories">
                <div className="category add-category">
                    <Link to="/admin/dashboard/categories/addcategory/">
                            <span className="add-btn">+</span>
                    </Link>
                </div>
                {
                    categories !== []?
                        categories.map((category, index) => (
                            <div className="category" key={index}>
                                <Link to={ "/admin/dashboard/category/" + category.id}>
                                    <div className="image"></div>
                                    <div className="name">
                                        { category.name }
                                    </div>
                                </Link>
                            </div>
                        )) : ""
                }
            </div>
        </div>
    );
}
