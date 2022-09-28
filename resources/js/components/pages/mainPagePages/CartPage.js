import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import {Link} from "react-router-dom";
import useState from "react-usestateref";
import {me} from "../../../helperFiles/auth";
import {Carousel} from "react-responsive-carousel";
import { set } from 'lodash';

export default function CartPage() {
    const authContext = useContext(AuthContext);
    const [products, setProducts, productsRef] = useState([]);
    const [qtys, setQtys, qtysRef] = useState([]);
    const [checked, setChecked, checkedRef] = useState([]);
    const [allNonChecked, setAllNonChecked, allNonCheckedRef] = useState(false);
    const [totalPrice, setTotalPrice, totalPriceRef] = useState(9999.99);
    const [totalItems, setTotalItems, totalItemsRef] = useState(999);

    useEffect(() => {
        getCart();
        
    }, []);

    async function getCart() {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        let cart = [];

        await axios.request({
            url: "auth/user/getCart" ,
            baseURL: baseUrl,
            params: {
                    'token': _token,
                    'api_password': localStorage.getItem('api_password')
            },
            method: "GET"
        })
            .then(response => {
                cart = response.data.split(',').slice(1);
                console.log(cart);
                setTotalItems(0);
                setTotalPrice(0);
                cart.forEach((id, index) => {
                    var product_qty = id;
                    console.log(product_qty);
                    getProduct(product_qty.split(':')[0], product_qty.split(':')[1]);

                    setQtys({ 
                        ...qtysRef.current,
                        [product_qty.split(':')[0]] : product_qty.split(':')[1] }
                    );
                    setChecked({ 
                        ...checkedRef.current,
                        [product_qty.split(':')[0]] : true }
                    );

                });
                console.log(productsRef.current);
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    async function getProduct(id, qty = 0) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        await axios.request({
            url: `product/get/${id}`,
            baseURL: baseUrl,
            params: {
                'api_password': localStorage.getItem('api_password')
            },
            method: "GET"
        })
            .then(response => {
                setProducts([
                    ...productsRef.current, 
                    response.data.product
                ]);
                setTotalPrice(parseFloat(totalPriceRef.current) + parseFloat(response.data.product.price * qty));
                setTotalItems(parseInt(totalItemsRef.current) + parseInt(qty));
            });
    }

    let changeQty= (e) => {
        let qtyElement = e.target;
        let id = qtyElement.id.slice(4);
        let newValue = qtyElement.value;
        let previousValue = qtysRef.current[id];
        qtysRef.current[id] = newValue;

        if(checkedRef.current[id]) {
            productsRef.current.map(product => {
                if(product.id == id) {
                    setTotalPrice(parseFloat(totalPriceRef.current) + (newValue - previousValue) * product.price );
                }
            });
    
            setTotalItems(parseInt(totalItemsRef.current) - parseInt(previousValue) + parseInt(newValue));    
        }
        _changeQty(id, newValue);

        async function _changeQty (id, newVAlue) {    
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            const _token = localStorage.getItem('_token');

            await axios.request({
                url: "auth/user/updateQty",
                baseURL: baseUrl,
                params: {
                        'token': _token,
                        'api_password': localStorage.getItem('api_password'),
                        'product': id,
                        'newValue': newVAlue
                },
                method: "POST"
            })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
    }

    async function deleteFromCart(id) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        await axios.request({
            url: "auth/user/deleteFromCart",
            baseURL: baseUrl,
            params: {
                    'token': _token,
                    'api_password': localStorage.getItem('api_password'),
                    'product': id
            },
            method: "POST"
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error.response);
        });

        setProducts([]);
        getCart();
    }

    function handleCheck(id) {
        console.log(checkedRef.current[id]);
        checkedRef.current[id] = !checkedRef.current[id];

        let _allNonChecked = true;
        let _totalPrice = 0;
        
        setTotalItems(0);
        for(const key in checkedRef.current) {
            if(checkedRef.current[key]) {
                _allNonChecked = false;
                
                productsRef.current.map(product => {
                    if(product.id == key) {
                        _totalPrice += qtysRef.current[key] * product.price;
                    }
                });
                setTotalItems(parseInt(totalItemsRef.current) + parseInt(qtysRef.current[key]));
            }
        }

        setTotalPrice(_totalPrice);
        setAllNonChecked(_allNonChecked);
    }

    function selectAll() {
        for(const key in checkedRef.current) {
            checkedRef.current[key] = true;
            document.querySelector('.products .product .check #check-' + key).checked = true;
        }
        setAllNonChecked(false);
        setTotalItems(0);
        productsRef.current.map(product => {
            setTotalPrice(totalPriceRef.current + qtysRef.current[product.id] * product.price);
            setTotalItems(parseInt(totalItemsRef.current) + parseInt(qtysRef.current[product.id]));
        });
    }
    function deSelectAll() {
        for(const key in checkedRef.current) {
            checkedRef.current[key] = false;
            document.querySelector('.products .product .check #check-' + key).checked = false;
        }
        setAllNonChecked(true);
        setTotalPrice(0.00);
        setTotalItems(0);
    }

    return (
        <div className="cart-page">
            <div className='cart-products'>
                <div className='left'>
                    <h2 className='title'>Shopping Cart</h2>
                    <div className='below-title'>
                        {
                            allNonCheckedRef.current?
                                <div className='select' onClick={selectAll}>Select All</div>:
                                <div className='select' onClick={deSelectAll}>Deselect All</div>
                        } 
                        <div className='price-coloumn'>Price</div>                                            
                    </div>
                    <ul className='products'>
                        {
                            productsRef.current.map((product) => (
                                <li className='product' key={product.id}>
                                    <div className='check'>
                                        <input type='checkbox' onChange={() => {handleCheck(product.id)}} defaultChecked={checkedRef.current[product.id]} id={'check-' + product.id}/>
                                    </div>
                                    <div className='product-logo'></div>
                                    <div className='info'>
                                        <div className='title'>{product.name}</div>
                                        <div className='seller'>By {product.trader.name}</div>
                                        <div className='buy-quantity'>
                                            Buy: 
                                            <input type='number' className='select-qty' id={'qty-' + product.id} onChange={changeQty} defaultValue={qtysRef.current[product.id]} min='1' max={ product.quantity}/>
                                            <span className='number'>{ product.quantity }</span> Available
                                        </div>
                                        <div className='link'onClick={() => {deleteFromCart(product.id)}}>Delete</div>
                                        <div className='link'>Add to favourite</div>
                                    </div>
                                    <div className='price'>
                                        <span className='dollar-sign'>$</span><span className='dollars'>{ product.price.toString().split('.')[0] }</span><span className='cents'>{ product.price.toString().split('.')[1]?product.price.toString().split('.')[1].slice(0,2):"00" }</span>                               
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    <div className='total'>
                        subTotal({totalItemsRef.current} {totalItemsRef.current === 1?'item':'items'}): 
                                    <div className='price'>
                                        <span className='dollar-sign'>$</span><span className='dollars'>{ totalPriceRef.current.toString().split('.')[0] }</span><span className='cents'>{ totalPriceRef.current.toString().split('.')[1]?totalPriceRef.current.toString().split('.')[1].slice(0,2):"00" }</span>                               
                                    </div>
                    </div>
                </div>
                <div className='right'>
                    <div className='total'>
                        subTotal({totalItemsRef.current} {totalItemsRef.current === 1?'item':'items'}): 
                        <div className='price'>
                            <span className='dollar-sign'>$</span><span className='dollars'>{ totalPriceRef.current.toString().split('.')[0] }</span><span className='cents'>{ totalPriceRef.current.toString().split('.')[1]?totalPriceRef.current.toString().split('.')[1].slice(0,2):"00" }</span>                               
                        </div>
                    </div>
                    <div className='buy-btn'>Proceed to Checkout</div>
                </div>
            </div>
            <div className='recommendations'>

            </div>
        </div>
    );
}
