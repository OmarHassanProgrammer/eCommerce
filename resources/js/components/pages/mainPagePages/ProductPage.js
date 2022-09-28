import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import {Link, useLocation, useHistory, useParams} from "react-router-dom";
import useState from "react-usestateref";
import {me} from "../../../helperFiles/auth";
import {Carousel} from "react-responsive-carousel";
import axios from "axios";

export default function ProductPage(){
    const productId = getQueryParam('product_id', 0);
    const [product, setProduct, productRef] = useState({'status': false});
    const [quantity, setQuantity, quantityRef] = useState(1);
    const [parentsFamilyElement, setParentsFamilyElement, parentsFamilyElementRef] = useState([]);
    const [totalPrice, setTotalPrice, totalPriceRef] = useState(1);
    const [inCart, setInCart, inCartRef] = useState(false);
    let history = useHistory();

    useEffect(() => {
        async function getProduct() {
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            await axios.request({
                url: `product/get/${productId}`,
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password')
                },
                method: "GET"
            })
                .then(response => {
                    setProduct({...response.data.product, 'status': true});

                    console.log({...response.data.product, 'status': true});

                    setTotalPrice(productRef.current.price);
                    categoryFamilyTreeFunc(productRef.current.category.id);

                });
        }
        getProduct();

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

        async function isInCart() {
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            const _token = localStorage.getItem('_token');
    
            await axios.request({
                url: "auth/user/isInCart" ,
                baseURL: baseUrl,
                params: {
                        'token': _token,
                        'api_password': localStorage.getItem('api_password'),
                        'product': productId
                },
                method: "POST"
            })
                .then(response => {
                    console.log(response);
                    setInCart(response.data.isInCart);
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
        isInCart();

    }, []);

    let changeQty = (e) => {
        let value = document.querySelector('.product .buy .buy-quantity .select-qty').value;
        setQuantity(value);
        setTotalPrice(value * productRef.current.price);
    }

    async function addToCart() {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        await axios.request({
            url: "auth/user/addToCart",
            baseURL: baseUrl,
            params: {
                    'token': _token,
                    'api_password': localStorage.getItem('api_password'),
                    'product': productRef.current.id,
                    'qty': quantityRef.current
            },
            method: "POST"
        })
            .then(response => {
                console.log(response);
                setInCart(true);
                history.push('/cart');
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    async function deleteFromCart() {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        await axios.request({
            url: "auth/user/deleteFromCart",
            baseURL: baseUrl,
            params: {
                    'token': _token,
                    'api_password': localStorage.getItem('api_password'),
                    'product': productRef.current.id
            },
            method: "POST"
        })
            .then(response => {
                console.log(response);
                setInCart(false);
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    return (
        <div className='product-page'>
            <div className='product-route'>
                {
                    parentsFamilyElementRef.current.length !== 0?parentsFamilyElementRef.current.map((category, index) => {
                        return  (
                                <Link key={index} to={location => ({ ...location, pathname: `/category`, search: `?category_id=${category.id}`})} >{ category.name } / </Link>  
                            )
                    }):""
                }
            </div>
            <div className='product'>
                <div className='images'>
                    <div className='main-image'>

                    </div>
                    <ul className='all-images'>
                        <li className='image'></li>
                        <li className='image'></li>
                        <li className='image'></li>
                        <li className='image'></li>
                        <li className='image'></li>
                        <li className='image'></li>
                        <li className='image'></li>
                        <li className='image'></li>
                    </ul>
                </div>
                <div className='information'>
                    <h2 className='product-title'>
                        { productRef.current.status?productRef.current.name:"" }
                    </h2>
                    <span className='trader'><Link to=''>By { productRef.current.status?productRef.current.trader.name:"" }</Link></span>
                    <div className='brand'>
                        <Link to=''>Brand: { productRef.current.status?productRef.current.brand.name:"" }</Link>
                    </div>
                    <div className='price'>
                        <span className='dollar-sign'>$</span><span className='dollars'>{ productRef.current.status?productRef.current.price.toString().split('.')[0]:"" }</span><span className='cents'>{ productRef.current.status?productRef.current.price.toString().split('.')[1]?productRef.current.price.toString().split('.')[1].slice(0,2):"00":"" }</span>
                    </div>
                    <div className='description'>
                        { productRef.current.status?productRef.current.description:"" }
                    </div>
                </div>
                <div className='buy'>
                    <div className='price'>
                        <span className='dollar-sign'>$</span><span className='dollars'>{ productRef.current.status?productRef.current.price.toString().split('.')[0]:"" }</span><span className='cents'>{ productRef.current.status?productRef.current.price.toString().split('.')[1]?productRef.current.price.toString().split('.')[1].slice(0,2):"00":"" }</span> <Link to=''>By Ahmed</Link>
                    </div>
                    <div className='delivery-date'>
                        Delivery <span className='value'>Tuesday, August 16</span>
                    </div>
                    <div className='delivary-location'>
                        <Link to="">Deliver to Egypt</Link>
                    </div>
                    <div className='buy-quantity'>
                        Buy: 
                         <input type='number' className='select-qty' onChange={changeQty} defaultValue='1' min='1' max={ productRef.current.status?productRef.current.quantity:100}/>
                        <span className='number'>{ productRef.current.status?productRef.current.quantity:"" }</span> Available
                    </div>
                    <div className='total-price'>Price: <span className='number'>{ quantityRef.current }</span> * 
                        <span className='dollar-sign'>$</span><span className='dollars'>{ productRef.current.status?productRef.current.price.toString().toString().split('.')[0]:"" }</span><span className='cents'>{ productRef.current.status?productRef.current.price.toString().split('.')[1]?productRef.current.price.toString().split('.')[1].slice(0,2):"00":"" }</span> = 
                        <span className='dollar-sign'>$</span><span className='dollars'>{ totalPriceRef.current.toString().toString().split('.')[0] }</span><span className='cents'>{ totalPriceRef.current.toString().split('.')[1]?totalPriceRef.current.toString().split('.')[1].slice(0,2):"00" }</span>
                    </div>
                    { 
                        inCartRef.current?
                            <div className='remove-from-cart' onClick={() => { deleteFromCart() }}>Remove From Cart</div>
                            :<div className='add-to-cart' onClick={() => { addToCart() }}>Add to cart</div>
                    }
                    
                    <div className='buy-now'>Buy Now</div>
                    <div className='add-to-favourite'>Add to Favourites</div>
                </div>
            </div>

        </div>
    );  
}
