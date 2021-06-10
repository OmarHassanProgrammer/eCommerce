import React, {useEffect, useContext} from 'react';
import {Link, useParams} from "react-router-dom";
import useState from 'react-usestateref';
import {AuthContext} from "../../../../contexts/AuthContext";
import {me} from "../../../../../helperFiles/auth";

export default function CategoryPage(props) {
    const [categories, setCategories] = useState([]);
    const [parentsFamilyElement, setParentsFamilyElement, parentsFamilyElementRef] = useState([]);
    const [category, setCategory] = useState({});
    const authContext = useContext(AuthContext);
    let {categoryID} = useParams();

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

        async function getCategory() {
            await axios.request({
                url: "category/get/" + categoryID,
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                },
                method: "GET"
            })
                .then(response => {
                    setCategory(response.data.category);

                })
                .catch(error => {
                    console.log(error.response);
                });
        }
        getCategory();

        async function getCategories() {
            await axios.request({
                url: "category/getAll",
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                    'parentGroup': categoryID,
                    'pagination': 0
                },
                method: "GET"
            })
                .then(response => {
                    console.log(response.data);
                    setCategories(response.data.data);
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
        getCategories();
    }, [categoryID]);

    async function categoryFamilyTreeFunc(parent_id) {
        let parentID = parent_id;
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        setParentsFamilyElement([]);

        async function _categoryFamilyTreeFunc() {
            console.log(parentID);
            if(parentID !== 0) {
                await axios.request({
                    url: "category/get/" + parentID,
                    baseURL: baseUrl,
                    params: {
                        'api_password': localStorage.getItem('api_password'),
                        'token': _token,
                    },
                    method: "GET"
                })
                    .then(response => {
                        console.log(response);
                        setParentsFamilyElement([
                            response.data.category,
                            ...parentsFamilyElementRef.current
                        ]);
                        parentID = response.data.category.parent_group;
                        _categoryFamilyTreeFunc();
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
            } else {
                console.log("tree", parentsFamilyElementRef.current);
            }
        }
        _categoryFamilyTreeFunc();
    }

    useEffect(() => {
        if(category.parent_group !== undefined) {
            categoryFamilyTreeFunc(category.parent_group);
        }
    }, [category]);

    return (
        <div className="category-page">
            <div aria-label="breadcrumb" className="breadcrumb-container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard' onClick={props.handleRerenderEffect} >Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard/categories' onClick={props.handleRerenderEffect} >Categories</Link>
                    </li>
                    {
                        parentsFamilyElementRef.current.map(element => {
                            return  (
                                <li className="breadcrumb-item" key={element.id}>
                                    <Link to={'/admin/dashboard/category/' + element.id} onClick={props.handleRerenderEffect} >{ element.name }</Link>
                                </li>)
                        })
                    }
                    <li className="breadcrumb-item active" aria-current="page">{ category.name }</li>
                </ol>
            </div>
            <div className="categories">
                <div className="category add-category">
                    <Link to={"/admin/dashboard/categories/addcategory?group-parent-id=" + categoryID + "&group-parent-name=" + category.name }>
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
