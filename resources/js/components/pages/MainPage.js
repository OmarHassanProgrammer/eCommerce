import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref';
import {Link, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import {CategoriesContext} from "../contexts/CategoriesContext";
import {me} from "../../helperFiles/auth";
import {Field, Formik, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";
import Categories from "../subComponents/Categories";
import HomePage from "./mainPagePages/HomePage";
import CategoryPage from "./mainPagePages/categoryPage";

export function MainPage() {
    const authContext = useContext(AuthContext);
    const categoriesContext = useContext(CategoriesContext);
    const [sidebarStatus, setSidebarStatus, sidebarStatusRef] = useState("");
    const [selectInputStatues, setSelectInputStatues, selectInputStatuesRef] = useState("");
    const [portfolioDropBoxStatus, setPortfolioDropBoxStatus, portfolioDropBoxStatusRef] = useState("");
    const [selectedOption, setSelectedOption] = useState({
        id: '0',
        name: 'All'
    });
    const [user, setUser, userRef] = useState({});
    const history = useHistory();
    let { path, url } = useRouteMatch();
    let location = useLocation();

    useEffect(() => {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        console.log(categoriesContext.categories);

        document.addEventListener('click', (e) => {
            if (selectInputStatuesRef.current === "show2") {
                setSelectInputStatues("show");
            } else if (selectInputStatuesRef.current === "show") {
                setSelectInputStatues("");
            }

            if (portfolioDropBoxStatusRef.current === "show2") {
                setPortfolioDropBoxStatus("show");
            } else if (portfolioDropBoxStatusRef.current === "show") {
                setPortfolioDropBoxStatus("");
            }
        });
    }, []);

    let handleSidebarStatus = () => {
        if(sidebarStatus === "") {
            setSidebarStatus("show");
        } else {
            setSidebarStatus("");
        }
    }

    let closeSidebar = () => {
        if(sidebarStatus === "show2") {
            setSidebarStatus("show");
        } else {
            setSidebarStatus("");
        }
    }

    let handleSelectInputStatus = (e) => {
        e.stopPropagation();
        if(selectInputStatues === "") {
            setSelectInputStatues("show2");
        } else {
            setSelectInputStatues("");
        }
    }

    let handlePortfolioDropBoxStatus = e => {
        e.stopPropagation();
        if(portfolioDropBoxStatus === "") {
            setPortfolioDropBoxStatus("show2");
        } else {
            setPortfolioDropBoxStatus("");
        }
    }

    let fixPortfolioDropBoxStatus = () => {
        setPortfolioDropBoxStatus('show2');
    }

    let fixSidebarStatus = (e) => {
        e.stopPropagation();
    }

    let handleOptionStatus = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectInputStatues('show2');
        console.log("HH");
        if(e.target.parentElement.getAttribute('class').search('open') == -1) {
            e.target.parentElement.setAttribute('class', e.target.parentElement.getAttribute('class') + ' open');
        } else  {
            e.target.parentElement.setAttribute('class', e.target.parentElement.getAttribute('class').replace('open', ''));
        }
    }

    let handleSelectedOption = (values, setFieldValue) => e => {
        const id = e.target.getAttribute("value");

        if(selectedOption.id !== id) {
            e.stopPropagation();
            setSelectInputStatues('show2');
            setSelectedOption({
                id,
                name: e.target.getAttribute("optionname")
            });
            setFieldValue("parentGroup", id);
        }

    }

    let form = (formProps) => {
        const {
            values,
            handleChange,
            setFieldValue,
            handleSubmit
        } = formProps;


        return <form className="search-form" onSubmit={handleSubmit}>
            <div className="category" onClick={handleSelectInputStatus}>
                <div className="select">
                    <select name="parentGroup" className="parent-group-input" value={values.category} onChange={handleChange} >
                        <option value="0" label="None" />
                        {
                            categoriesContext.categoriesRef.current !== []?
                            categoriesContext.categoriesRef.current.map((category, index) => (
                                    <option value={category.id} label={category.name} key={index} />
                                )) : ""
                        }
                    </select>
                    <div className={"parent-group-input-ui " + selectInputStatues} >
                        <div className="selected-option" value={selectedOption.id}>{selectedOption.name}</div>
                        <div className="options">
                            <div className={"option " + (selectedOption.id == 0?"active":"")} value="0" optionname="All" onClick={handleSelectedOption(values, setFieldValue)} >All</div>
                            <Categories selectedOptionId={selectedOption.id} handleSelectedOption={handleSelectedOption(values, setFieldValue)} handleOptionStatus={handleOptionStatus}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="input">
                <Field type="text" name="search_text" placeholder="What are you looking for?" />
            </div>
            <div className="search-btn">
                <input type="submit" value=" "/>
            </div>
        </form>;
    }

    let schema = () => {
        return Yup.object().shape({
            seacrh_text: Yup.string().required(),
            category: Yup.number()
        });
    }

    async function onSubmit(values) {
        try {
            const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
            const _token = localStorage.getItem('_token');

            console.log(values);

            let response = await axios.request({
                url: "category/add",
                baseURL: baseUrl,
                data: {
                    'api_password': localStorage.getItem('api_password'),
                    'token': _token,
                    'name': values.name,
                    'parentGroup': values.parentGroup
                },
                method: "POST"
            }).then((response) => {
                if(response.status == 200) {
                    if(response.data.status) {

                        alert.success(__('categorySuccessCreated', 'messages'));
                        history.push('/admin/dashboard/categories');
                        return true;
                    } else {
                        if(response.data.errNum == "E001") {
                            alert.error(__('generalError', 'messages'));
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    alert.error(__('generalError', 'messages'));
                    return true;
                }
            });

        } catch (error) {
            console.log(error);
            alert.error(__('generalError', 'messages'));
            return true;
        }
    }

    return (
        <div className="main-page">
            <div className={"sidebar " + sidebarStatusRef.current} onClick={closeSidebar}>
                <div className="sidebar-content" onClick={fixSidebarStatus}>
                    <div className="head">
                        <div className="image"></div>
                        <div className="name">
                            {
                                (authContext.authRef.current.status)?authContext.authRef.current.name:
                                    <div className="login-signup">
                                        Please <Link to="login" key="login">Log in</Link> or <Link to="register" key="register">Register</Link>
                                    </div>
                            }
                        </div>
                    </div>
                    <ul className="content">
                        <li className="part">
                            <div className="part-title">For You:</div>
                            <ul className="items">
                                <li className="item">Today's Deals</li>
                                <li className="item">Hot Deals</li>
                                <li className="item">Best Sellers</li>
                                <li className="item">Best Products</li>
                                <li className="item">New Products</li>
                            </ul>
                        </li>
                        <li className="part">
                            <div className="part-title">Shop By Category:</div>
                            <ul className="items">
                                {
                                   categoriesContext.topCategoriesRef.current !== []?
                                   categoriesContext.topCategoriesRef.current.map((category, index) => (
                                            <li className="item" key={index}>
                                                <Link to={location => ({ ...location, pathname: `/category`, search: `?category_id=${category.id}`})} onClick={handleSidebarStatus}>
                                                    {category.name}
                                                </Link>
                                            </li>
                                        )):"There is some problem"
                                }
                            </ul>
                        </li>
                        <li className="part">
                            <div className="part-title">Help & Settings</div>
                            <ul className="items">
                                <li className="item">Your account</li>
                                <li className="item">Settings</li>
                                {
                                    !authContext.authRef.current?<li className="item">
                                        <Link to="login" key="login">Log in</Link>
                                    </li>:<li className="item">
                                            <Link className="link" to="logout" key="logout">logout</Link>
                                        </li>
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="upper-nav">
                <div className="container-fluid">
                    <ul className="left-list nav-list">
                        <li className="item"><i className="fa fa-truck" aria-hidden="true"></i> Free Shipping</li>
                        <li className="item"><i className="fa fa-refresh" aria-hidden="true"></i> Free Returns</li>
                        <li className="item"><i className="fa fa-usd" aria-hidden="true"></i> Cash on Delivery</li>
                        <li className="item"><i className="fa fa-clock-o" aria-hidden="true"></i> 24 Work Hours</li>
                    </ul>
                    <ul className="right-list nav-list">
                        {
                            !authContext.authRef.current.status?<li className="item">
                                <Link to={location => ({ ...location, pathname: "/login" })} key="login">Log in</Link> or <Link  to={location => ({ ...location, pathname: "/register" })} key="register">Register</Link>
                                                    </li>:""
                        }
                        {
                            (authContext.authRef.current.authType === "ADMIN")?<li className="item"><Link  to={location => ({ ...location, pathname: "/admin/dashboard" })} key="dashboard">Dashboard</Link></li>:""
                        }
                        <li className="item"><a href="/">Daily Offers</a></li>
                        <li className="item"><a href="/">Buy what you need</a></li>
                        <li className="item"><a href="/">Sell with us</a></li>
                        <li className="item"><a href="/">English</a></li>

                    </ul>
                </div>
            </div>
            <div className="container-fluid">
                <div className="main-nav">
                    <div className="main-nav-container">
                        <span className="sidebar-icon" onClick={handleSidebarStatus}>
                            <i className="fa fa-bars"></i>
                        </span>
                        <Link to={location => ({ ...location, pathname: `/`, search: `?`})}><img src="./../images/logo.png" className="website-logo"/></Link>
                        <div className="search">
                            <Formik
                                initialValues={{search_text: "", category: ""}}
                                onSubmit={onSubmit}
                                render={form}
                                validationSchema={schema()} />
                        </div>
                        <div className={"portfolio-icon " + (authContext.auth._token?"show":"")}>
                            <div className="content">
                                Hi{!authContext.authRef.current.status?
                                (<div className="login-signup">
                                    <Link to={location => ({ ...location, pathname: "/login" })} key="login">Log in</Link> or <Link  to={location => ({ ...location, pathname: "/register" })} key="register">Register</Link>
                                </div>):
                                (<div className="portfolio-data">
                                    <span className="name" onClick={handlePortfolioDropBoxStatus}>{". " + authContext.authRef.current.name}</span>
                                    <div className={"drop-box " + portfolioDropBoxStatus} onClick={fixPortfolioDropBoxStatus}>
                                        <div className="head">
                                            <div className="user-logo"></div>
                                            <div className="name">{ authContext.authRef.current.name }</div>
                                        </div>
                                        <div className="body">
                                            <Link className="link" to={location => ({ ...location, pathname: "logout"})} key="logout">logout</Link>
                                        </div>
                                    </div>
                                </div>)
                            }
                            </div>
                        </div>
                        <div className="shopping-cart">
                            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div className="lower-nav">
                        <ul className="items">
                            <li className="item"><i className="fa fa-heart" aria-hidden="true"></i> favourite</li>
                            {
                                categoriesContext.topCategoriesRef.current !== []?
                                categoriesContext.topCategoriesRef.current.map((category, index) => (
                                        <li className="item" key={index}>
                                            <Link to={location => ({ ...location, pathname: `/category`, search: `?category_id=${category.id}`})}>
                                                {category.name}
                                            </Link>
                                        </li>
                                    )):"There is some problem"
                            }
                        </ul>
                </div>
                <div className="content">

                        <Route path={'/'} exact
                               render={() => (
                                   <HomePage />
                               )} />
                        <Route path={`/category`}
                               render={() => (
                                   <CategoryPage />
                               )} />
                </div>
            </div>    
        </div>);
}
