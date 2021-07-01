import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import {Link, useLocation, useHistory, useParams} from "react-router-dom";
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
    const [productsPagination, setProductsPagination, productsPaginationRef] = useState({});
    const [paginationLinks, setPaginationLinks, paginationLinksRef] = useState([]);
    const [parentsFamilyElement, setParentsFamilyElement, parentsFamilyElementRef] = useState([]);
    const [changedCategory, setChangedCategory, changedCategoryRef] = useState(false);
    const [prevLocation, setPrevLocation, prevLocationRef] = useState({});
    const [productsDetails, setProductsDetails, productsDetailsRef] = useState([]);
    const [checkedBrands, setCheckedBrands, checkedBrandsRef] = useState(getQueryParam('brands', ''));
    const [price, setPrice, priceRef] = useState(getQueryParam('price', 'ALL'));
    const [rateRange, setRateRange, rateRangeRef] = useState('ALL')
    let location = useLocation();
    const history = useHistory();

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

    }, [changedCategoryRef.current]);

    useEffect(() => {

        if(!window.isEmpty(prevLocationRef.current)) {
            let paramName = "category_id";
            let paramStart = prevLocationRef.current.search.search(paramName + "=") + paramName.length + 1;
            let paramEnd = 0;
            let paramVal = "";
            if (paramStart !== paramName.length) {
                paramEnd = prevLocationRef.current.search.slice(paramStart).search('&');
                if (paramEnd === -1) {
                    paramVal = prevLocationRef.current.search.slice(paramStart);
                } else {
                    paramVal = prevLocationRef.current.search.slice(paramStart, paramEnd + paramStart);
                }
            }
            if (paramVal !== getQueryParam('category_id')) {
                setChangedCategory(!changedCategoryRef.current);
            }
        } else {
            setChangedCategory(!changedCategoryRef.current);
        }
        setPrevLocation(location);

        async function getProducts() {
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            await axios.request({
                url: `product/getCategoryProducts/${categoryId}/`,
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'checked_brands': checkedBrands === ''?'ALL':checkedBrands,
                    'pagination': 15,
                    'page': getQueryParam('page', 1),
                    'price': priceRef.current,
                    'rate': rateRangeRef.current
                },
                method: "GET"
            })
                .then(response => {
                    console.log('sssssssssssssssss', response);
                    setProductsPagination(response.data.products);
                    setProductsDetails({
                        'brands': response.data.brands,
                        'minPrice': parseInt(response.data.min_price),
                        'maxPrice': parseInt(response.data.max_price)
                    });

                    setPaginationLinks([]);

                    if(productsPaginationRef.current.total > 15) {
                        if(productsPaginationRef.current.current_page > 4) {
                            if(productsPaginationRef.current.last_page > productsPaginationRef.current.current_page + 3) {
                                setPaginationLinks(
                                    prevLinks => ([...prevLinks,
                                        <li className={"page-item " + (productsPaginationRef.current.current_page === 1?'active':"")} key={1}>
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=1`})}>1</Link>
                                        </li>,
                                        <li className={"page-item " + (productsPaginationRef.current.current_page === 2?'active':"")} key="...">
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=2`})}>...</Link>
                                        </li>
                                    ])
                                );
                                for(let i = productsPaginationRef.current.current_page - 2; i <= productsPaginationRef.current.current_page + 2; i++) {
                                    setPaginationLinks(
                                        prevLinks => ([...prevLinks,
                                            <li className={"page-item " + (productsPaginationRef.current.current_page === i?"active":"")} key={i}>
                                                <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${i}`})}>{ i }</Link>
                                            </li>
                                        ])
                                    );
                                }
                                setPaginationLinks(
                                    prevLinks => ([...prevLinks,
                                        <li className="page-item" key="...">
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${productsPaginationRef.current.current_page + 2}`})} >...</Link>
                                        </li>,
                                        <li className="page-item" key={productsPaginationRef.current.last_page}>
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${productsPaginationRef.current.last_page}`})} >{ productsPaginationRef.current.last_page }</Link>
                                        </li>
                                    ])
                                );
                            } else {
                                setPaginationLinks(
                                    prevLinks => ([...prevLinks,
                                        <li className="page-item" key={1}>
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=1`})} >1</Link>
                                        </li>,
                                        <li className="page-item" key="...">
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${productsPaginationRef.current.current_page - 3}`})} >...</Link>
                                        </li>
                                    ])
                                );
                                for(let i = productsPaginationRef.current.current_page - 2; i <= productsPaginationRef.current.last_page; i++) {
                                    setPaginationLinks(
                                        prevLinks => ([...prevLinks,
                                            <li className={"page-item " + (productsPaginationRef.current.current_page === i?"active":"")} key={i}>
                                                <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${i}`})}>{ i }</Link>
                                            </li>
                                        ])
                                    );
                                }
                            }
                        } else {
                            if(productsPaginationRef.current.last_page > productsPaginationRef.current.current_page + 3) {
                                console.log("entered");
                                for(let i = 1; i <= productsPaginationRef.current.current_page + 2; i++) {
                                    setPaginationLinks(
                                        prevLinks => ([...prevLinks,
                                            <li className={"page-item " + (productsPaginationRef.current.current_page === i?"active":"")} key={i}>
                                                <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${i}`})} >{ i }</Link>
                                            </li>
                                        ])
                                    );
                                }
                                setPaginationLinks(
                                    prevLinks => ([...prevLinks,
                                        <li className="page-item" key="...">
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${productsPaginationRef.current.current_page + 2}`})} >...</Link>
                                        </li>,
                                        <li className="page-item" key={productsPaginationRef.current.last_page}>
                                            <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${productsPaginationRef.current.last_page}`})} >{ productsPaginationRef.current.last_page }</Link>
                                        </li>
                                    ])
                                );
                            } else {
                                for(let i = 1; i <= productsPaginationRef.current.last_page; i++) {
                                    setPaginationLinks(
                                        prevLinks => ([...prevLinks,
                                            <li className={"page-item " + (productsPaginationRef.current.current_page === i?"active":"")} key={i}>
                                                <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${i}`})} >{ i }</Link>
                                            </li>
                                        ])
                                    );
                                }
                            }
                        }
                    }
                });
        }
        getProducts();

    }, [location.search]);

    let handleLocationSearch =  (paramName, newVal) => {
        let url = location.search;
        let paramStart = url.search(paramName + "=") + paramName.length + 1;
        let paramEnd = 0;
        let paramVal = "";

        if(paramStart !== paramName.length) {
            paramEnd = url.slice(paramStart).search('&');
            if(paramEnd === -1) {
                paramVal = url.slice(paramStart);
            } else {
                paramVal = url.slice(paramStart, paramEnd + paramStart);
            }

            if(newVal !== '') {
                return url.replace(`${paramName}=${paramVal}`, `${paramName}=${newVal}`);
            } else {
                if(url.search(`&${paramName}=${paramVal}&`) !== -1) {
                    return url.replace(`&${paramName}=${paramVal}&`, ``);
                } else if(url.search(`${paramName}=${paramVal}&`) !== -1) {
                    return url.replace(`${paramName}=${paramVal}&`, ``);
                } else if(url.search(`&${paramName}=${paramVal}`) !== -1) {
                    return url.replace(`&${paramName}=${paramVal}`, ``);
                } else {
                    return url.replace(`&${paramName}=${paramVal}`, ``);
                }
            }
        } else {
            if(newVal !== '') {
                console.log('gg');
                return (url + `&${paramName}=${newVal}`);
            } else {
                return url;
            }
        }
    }

    let handleBrands = () => {
        let checkedBrands = [];
        let checkedBrandsElements = document.querySelectorAll('.brands .brand input[name="checked-brands"]:checked');
        for(let i = 0; i < checkedBrandsElements.length; i++) {
            checkedBrands.push(checkedBrandsElements[i].getAttribute('value'));
        }
        setCheckedBrands(checkedBrands.join(','));
        let checkedBrandsQuery = checkedBrands.join(',');
        let newSearch = handleLocationSearch('brands', checkedBrandsQuery);
        window.history.pushState(null, "", location.pathname + newSearch);
        location.search = newSearch;
    }

    let handlePriceInput = (e) => {
        let minPrice = document.querySelector('.block .custom-price .custom-min-price').value;
        let maxPrice = document.querySelector('.block .custom-price .custom-max-price').value;

        let newPrice = `${minPrice}:${maxPrice}`;
        setPrice(newPrice);
        let newSearch = handleLocationSearch('price', newPrice);
        window.history.pushState(null, "", location.pathname + newSearch);
        location.search = newSearch;
    }

    let handlePrice = (minPrice, maxPrice) => e => {
        console.log(minPrice, maxPrice)

        let newPrice = `${minPrice}:${maxPrice}`;
        setPrice(newPrice);
        let newSearch = handleLocationSearch('price', newPrice);
        window.history.pushState(null, "", location.pathname + newSearch);
        location.search = newSearch;
    }

    let handleRateRange = (rate) => e => {
        if(rateRangeRef.current === rate) {
            setRateRange('ALL');
        } else {
            setRateRange(rate);
        }

        let newSearch = handleLocationSearch('rate', rateRangeRef.current);
        window.history.pushState(null, "", location.pathname + newSearch);
        location.search = newSearch;
    }

    return (
        <div className="category-page">
            <div className="side-bar">
                <div className="block">
                    <h6 className="title">Categories:</h6>
                    <ul className="items">
                        {
                            parentsFamilyElementRef.current.map((category, index) => {
                                return  (
                                    <li className="item prev-item" key={index}>
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
                {
                    (productsDetailsRef.current.brands && productsDetailsRef.current.brands !== [])?
                    <div className="block">
                        <h6 className="title">Brands:</h6>
                        <ul className="items brands">
                            {
                                productsDetailsRef.current.brands.map((brand, index) => (
                                    <li className="item brand" key={index}>
                                        <input type="checkbox" name="checked-brands" value={brand.id} onChange={handleBrands} checked={checkedBrandsRef.current.includes(brand.id.toString())?'checked':false}/>
                                        { brand.name }
                                    </li>
                                ))
                            }

                        </ul>
                    </div>:""
                }
                {
                    (productsDetailsRef.current.minPrice && productsDetailsRef.current.maxPrice)?
                        <div className="block">
                            <h6 className="title">Price:</h6>
                            {
                                (((priceRef.current === "ALL") || (priceRef.current === `0:${productsDetailsRef.current.maxPrice}`)) && (productsDetailsRef.current.minPrice !== productsDetailsRef.current.maxPrice))?
                                    <ul className="items">
                                        <li className="item price" onClick={handlePrice(0, (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice)}>
                                            Under ${ (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice }
                                        </li>
                                        <li className="item price" onClick={handlePrice((productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice, 2 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice)}>
                                            ${ (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice } to ${ 2 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice }
                                        </li>
                                        <li className="item price" onClick={handlePrice(2 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice, 3 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice)}>
                                            ${ 2 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice } to ${ 3 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice }
                                        </li>
                                        <li className="item price"  onClick={handlePrice(3 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice, 4 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice)}>
                                            ${ 3 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice } to ${ 4 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice }
                                        </li>
                                        <li className="item price" onClick={handlePrice(4 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice, productsDetailsRef.current.maxPrice)}>
                                            ${4 * (productsDetailsRef.current.maxPrice - productsDetailsRef.current.minPrice) / 5 + productsDetailsRef.current.minPrice} & Above
                                        </li>
                                    </ul>:
                                    <div className="content">
                                        <span className="item all-prices" onClick={handlePrice(0, productsDetailsRef.current.maxPrice)}>
                                            See All Prices
                                        </span>
                                        <div className="custom-price">
                                            <input type="number" className="custom-min-price" min="0" defaultValue={priceRef.current !== "ALL"?priceRef.current.split(':')[0]:0}/> to <input type="number" className="custom-max-price" min="0" defaultValue={priceRef.current !== "ALL"?priceRef.current.split(':')[1]:productsDetailsRef.current.maxPrice}/> <button className="go btn btn-primary" onClick={handlePriceInput}>Go</button>
                                        </div>
                                    </div>
                            }
                        </div>:""
                }
                <div className="block">
                    <h6 className="title">Rate:</h6>
                    <ul className="items">
                        <li className={"item " + (rateRange === 4?'active':'')} onClick={ handleRateRange(4) }>
                            <div className="stars">
                                <span className="star fill"></span>
                                <span className="star fill"></span>
                                <span className="star fill"></span>
                                <span className="star fill"></span>
                                <span className="star"></span>
                            </div>
                            & Up
                        </li>
                        <li className={"item " + (rateRange === 3 ? 'active' : '')} onClick={handleRateRange(3)}>
                            <div className="stars">
                                <span className="star fill"></span>
                                <span className="star fill"></span>
                                <span className="star fill"></span>
                                <span className="star"></span>
                                <span className="star"></span>
                            </div>
                            & Up
                        </li>
                        <li className={"item " + (rateRange === 2 ? 'active' : '')} onClick={handleRateRange(2)}>
                            <div className="stars">
                                <span className="star fill"></span>
                                <span className="star fill"></span>
                                <span className="star"></span>
                                <span className="star"></span>
                                <span className="star"></span>
                            </div>
                            & Up
                        </li>
                        <li className={"item " + (rateRange === 1 ? 'active' : '')} onClick={handleRateRange(1)}>
                            <div className="stars">
                                <span className="star fill"></span>
                                <span className="star"></span>
                                <span className="star"></span>
                                <span className="star"></span>
                                <span className="star"></span>
                            </div>
                            & Up
                        </li>
                    </ul>
                </div>
            </div>
            <div className="content">
                <div className="products">
                    {
                        (productsPagination.data && productsPagination.data !== {})?
                            Object.values(productsPagination.data).map((product, index) => (
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
                                            {
                                                product.rate == 5?
                                                    <div className="stars">
                                                        <span className="star fill"></span>
                                                        <span className="star fill"></span>
                                                        <span className="star fill"></span>
                                                        <span className="star fill"></span>
                                                        <span className="star fill"></span>
                                                    </div>:
                                                    product.rate >= 4.5?
                                                        <div className="stars">
                                                            <span className="star fill"></span>
                                                            <span className="star fill"></span>
                                                            <span className="star fill"></span>
                                                            <span className="star fill"></span>
                                                            <span className="star half-fill"></span>
                                                        </div>:
                                                        product.rate >= 4?
                                                            <div className="stars">
                                                                <span className="star fill"></span>
                                                                <span className="star fill"></span>
                                                                <span className="star fill"></span>
                                                                <span className="star fill"></span>                                                <span className="star"></span>
                                                                <span className="star"></span>
                                                            </div>:
                                                            product.rate >= 3.5?
                                                                <div className="stars">
                                                                    <span className="star fill"></span>
                                                                    <span className="star fill"></span>
                                                                    <span className="star fill"></span>
                                                                    <span className="star half-fill"></span>
                                                                    <span className="star"></span>
                                                                </div>:
                                                                product.rate >= 3?
                                                                    <div className="stars">
                                                                        <span className="star fill"></span>
                                                                        <span className="star fill"></span>
                                                                        <span className="star fill"></span>
                                                                        <span className="star"></span>
                                                                        <span className="star"></span>
                                                                    </div>:
                                                                    product.rate >= 2.5?
                                                                        <div className="stars">
                                                                            <span className="star fill"></span>
                                                                            <span className="star fill"></span>
                                                                            <span className="star half-fill"></span>
                                                                            <span className="star"></span>
                                                                            <span className="star"></span>
                                                                        </div>:
                                                                        product.rate >= 2?
                                                                            <div className="stars">
                                                                                <span className="star fill"></span>
                                                                                <span className="star fill"></span>
                                                                                <span className="star"></span>
                                                                                <span className="star"></span>
                                                                                <span className="star"></span>
                                                                            </div>:
                                                                            product.rate >= 1.5?
                                                                                <div className="stars">
                                                                                    <span className="star fill"></span>
                                                                                    <span className="star half-fill"></span>
                                                                                    <span className="star"></span>
                                                                                    <span className="star"></span>
                                                                                    <span className="star"></span>
                                                                                </div>:
                                                                                product.rate >= 1?
                                                                                    <div className="stars">
                                                                                        <span className="star fill"></span>
                                                                                        <span className="star"></span>
                                                                                        <span className="star"></span>
                                                                                        <span className="star"></span>
                                                                                        <span className="star"></span>
                                                                                    </div>:
                                                                                    product.rate >= .5?
                                                                                        <div className="stars">
                                                                                            <span className="star half-fill"></span>
                                                                                            <span className="star"></span>
                                                                                            <span className="star"></span>
                                                                                            <span className="star"></span>
                                                                                            <span className="star"></span>
                                                                                        </div>:
                                                                                        <div className="stars">
                                                                                            <span className="star"></span>
                                                                                            <span className="star"></span>
                                                                                            <span className="star"></span>
                                                                                            <span className="star"></span>
                                                                                            <span className="star"></span>
                                                                                        </div>
                                            }

                                            <span className="rates">
                                                <Link to="" >
                                                    { product.rates }
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
                {
                    (productsPagination.total && productsPagination.total > 15)?
                        <ul className="pagination pagination-lg">
                            <li className={"page-item " + (productsPaginationRef.current.current_page === 1?"disabled":"")} >
                                <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${productsPaginationRef.current.current_page - 1}`})} >&laquo;</Link>
                            </li>
                            {
                                paginationLinksRef.current.map((link, index) => (
                                    link
                                ))
                            }
                            <li className={"page-item " + (productsPaginationRef.current.current_page === productsPaginationRef.current.last_page?"disabled":"")}>
                                <Link className="page-link" to={location => ({ ...location, pathname: `/category`, search: `?category_id=${categoryId}&page=${productsPaginationRef.current.current_page + 1}`})} >&raquo;</Link>
                            </li>
                        </ul>
                    :""
                }
            </div>
        </div>
    );
}
