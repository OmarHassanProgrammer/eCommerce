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
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    let location = useLocation();

    useEffect(() => {
        me('ALL').then(r => {
            if(r) {
                setUser(r);
            }
        });

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
                url: `product/getCategoryProducts/${categoryId}`,
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password')
                },
                method: "GET"
            })
                .then(response => {
                    console.log(response);
                    setProducts(response.data);
                });
        }
        getProducts();

    }, [location.search]);

    return (
        <div className="category-page">
            <div className="side-bar">
                <div className="block">
                    <h6 className="title">Categories:</h6>
                    <ul className="items">
                        {
                            subCategories.map((category, index) => {
                                return <li className="item" key={index}>
                                    <Link to={location => ({ ...location, pathname: `/category`, search: `?category_id=${category.id}`})}>
                                        {category.name}
                                    </Link>
                                </li>
                            })
                        }
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
        </div>
    );
}
