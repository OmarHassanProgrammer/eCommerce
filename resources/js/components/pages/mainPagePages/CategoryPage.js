import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import {Link, useLocation, useParams} from "react-router-dom";
import useState from "react-usestateref";
import {me} from "../../../helperFiles/auth";
import {Carousel} from "react-responsive-carousel";
import axios from "axios";

export default function CategoryPage() {
    const authContext = useContext(AuthContext);
    const [user, setUser, userRef] = useState({});
    const categoryId = getQueryParam('category_id', 0);
    const [category, setCategory, categoryRef] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts, productsRef] = useState([]);
    const [parentsFamilyElement, setParentsFamilyElement, parentsFamilyElementRef] = useState([]);
    let location = useLocation();

    useEffect(() => {
        me('ALL').then(r => {
            if(r) {
                setUser(r);
            }
        });
        async function getCategory() {
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            await axios.request({
                url: `category/get/${categoryId}`,
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password')
                },
                method: "GET"
            })
                .then(response => {
                    setCategory(response.data.category);
                    categoryFamilyTreeFunc(response.data.category.parent_group);
                });
        }
        getCategory();

        async function getSubCategories() {
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            await axios.request({
                url: `category/getSubCategories/${categoryId}`,
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password')
                },
                method: "GET"
            })
                .then(response => {
                    console.log(response);
                    setSubCategories(response.data);
                });
        }
        getSubCategories();

        async function getProducts() {
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            await axios.request({
                url: `product/getCategoryProducts/${categoryId}/17`,
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password')
                },
                method: "GET"
            })
                .then(response => {
                    console.log("produuuuuu", response);
                    setProducts(response.data[0]);
                });
        }
        getProducts();

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
                            'api_password': localStorage.getItem('api_password')
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
                            setTimeout(_categoryFamilyTreeFunc, 100);
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

    }, [location.search]);

    return (
        <div className="category-page">
            <div className="side-bar">
                <div className="block">
                    <h6 className="title">Categories:</h6>
                    <ul className="items">
                        {
                            parentsFamilyElementRef.current.map(category => {
                                return  (
                                    <li className="item prev-item" key={category.id}>
                                        <Link to={location => ({ ...location, pathname: `/category`, search: `?category_id=${category.id}`})} >{ category.name }</Link>
                                    </li>)
                            })
                        }
                        {
                            <li className="item active" key={category.id}>
                                <Link to={location => ({ ...location, pathname: `/category`, search: `?category_id=${category.id}`})} >{ category.name }</Link>
                            </li>
                        }
                            <li className="item">
                                <ul>
                                    {
                                        subCategories.map((category, index) => {
                                            return <li className="item" key={category.id}>
                                                <Link to={location => ({ ...location, pathname: `/category`, search: `?category_id=${category.id}`})}>
                                                    {category.name}
                                                </Link>
                                            </li>
                                        })
                                    }
                                </ul>
                            </li>
                    </ul>
                </div>
                <div className="block">
                    <h6 className="title">Brands:</h6>
                    <ul className="items">
                        <li className="item">
                            Stabraq
                        </li>
                        <li className="item">
                            Nike
                        </li>
                        <li className="item">
                            Alien Beard
                        </li>
                        <li className="item">
                            Fox
                        </li>
                    </ul>
                </div>
                <div className="block">
                    <h6 className="title">Price:</h6>
                    <ul className="items">
                        <li className="item">
                            All
                        </li>
                        <li className="item">
                            More Than 500$
                        </li>
                        <li className="item">
                            Between 300$ and 500$
                        </li>
                        <li className="item">
                            Between 100$ and 300$
                        </li>
                        <li className="item">
                            Less Than 100$
                        </li>
                    </ul>
                </div>
            </div>
            <div className="content">
                <div className="products">
                    {
                        products !== []?
                            productsRef.current.map((product, index) => (
                                <div className="product" key={index}>
                                    <div className="image">
                                        <img src={ product.logo } />
                                    </div>

                                    <div className="middle">
                                        <div className="name">
                                            { product.name }
                                        </div>
                                        <span className="trader">
                                        by { product.trader_name }
                                        </span>
                                    </div>
                                    <div className="bottom">

                                        <div className="rate">
                                            <div className="stars">
                                                <span className="star fill">
                                                </span>
                                                <span className="star fill">
                                                </span>
                                                <span className="star fill">
                                                </span>
                                                <span className="star 1-fill">
                                                </span>
                                                <span className="star ">
                                                </span>
                                            </div>
                                            <span className="rates">
                                                <Link to="" >
                                                    125524
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="price">
                                        <span className="dollar-sign">$</span>{product.price}
                                    </div>

                                </div>
                            )):""
                    }
                </div>
            </div>
        </div>
    );
}
