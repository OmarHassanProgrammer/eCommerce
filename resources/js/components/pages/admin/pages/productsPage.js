import React, {useEffect, useContext, useState} from 'react';
import {Link} from "react-router-dom";

export default function ProductsPage(props) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');

        async function getProducts() {
            await axios.request({
                url: "product/getAll",
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'order': 'Desc',
                    'trader': 'ALL',
                    'category': 'ALL',
                    'pagination': 0
                },
                method: "GET"
            })
                .then(response => {
                    console.log(response.data.data);
                    setProducts(response.data.data);
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
        getProducts();
    }, []);

    return (
        <div className="products-page">
            <div aria-label="breadcrumb" className="breadcrumb-container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard' onClick={props.handleRerenderEffect} >Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Products</li>
                </ol>
            </div>
            <div className="products">
                {
                    products !== []?
                        products.map((product, index) => (
                            <div className="product" key={index}>
                                <img className="image" src={ product.logo }>

                                </img>
                                <div className="middle">
                                    <div className="name">
                                        { product.name }
                                    </div>
                                    <div className="quantity">
                                        {product.quantity}
                                    </div>
                                </div>
                                <div className="price">
                                    {product.price}$
                                </div>
                            </div>
                        )):""
                }
            </div>
        </div>
    );
}
