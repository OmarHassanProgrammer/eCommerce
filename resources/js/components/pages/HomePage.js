import React, {useContext, useEffect, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import {isAuthenticated, me} from "../../helperFiles/auth";
import {Field, Formik, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";
import Categories from "../subComponents/Categories";
import {useAlert} from "react-alert";

export function HomePage() {
    const [links, setLinks] = useState([]);
    const authContext = useContext(AuthContext);
    const [selectInputStatues, setSelectInputStatues, selectInputStatuesRef] = useState("");
    const [selectedOption, setSelectedOption] = useState({
        id: '0',
        name: 'All'
    });
    const [categories, setCategories, categoriesRef] = useState([]);
    const history = useHistory();

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
                    'token': _token,
                    'parentGroup': 'ALL',
                    'pagination': 0
                },
                method: "GET"
            })
                .then(response => {
                    setCategories(response.data);
                });
        }

        getCategories();

    }, []);

    let handleSelectInputStatus = () => {
        if(selectInputStatues === "") {
            setSelectInputStatues("show");
        } else {
            setSelectInputStatues("");
        }
    }

    let handleOptionStatus = (e) => {
        e.stopPropagation();
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
            setSelectedOption({
                id,
                name: e.target.getAttribute("optionname")
            });
            setFieldValue("parentGroup", id);
        }

    }

    useEffect(() => {
        let _links = [<Link to="" key="home">Home</Link>];
        if(authContext.auth._token) {
            _links.push(<Link to="logout" key="logout">logout</Link>);
        } else {
            _links.push([
                <Link to="register" key="register">Register</Link>,
                <Link to="login" key="login">Login</Link>
            ]);
        }
        isAuthenticated('ADMIN').then(r => {
            if(r) {
                _links.push(<Link to="admin/dashboard" key="dashboard">Dashboard</Link>);
            }
            setLinks([
                ..._links
            ]);
        });
    }, [authContext.auth._token]);

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
                            categories !== []?
                                categories.map((category, index) => (
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
        <div className="home-page">
            <div className="upper-nav">
                <div className="container">
                    <ul className="left-list nav-list">
                        <li className="item"><i className="fa fa-truck" aria-hidden="true"></i> Free Shipping</li>
                        <li className="item"><i className="fa fa-refresh" aria-hidden="true"></i> Free Returns</li>
                        <li className="item"><i className="fa fa-usd" aria-hidden="true"></i> Cash on Delivery</li>
                        <li className="item"><i className="fa fa-clock-o" aria-hidden="true"></i> 24 Work Hours</li>
                    </ul>
                    <ul className="right-list nav-list">
                        {
                            !authContext.auth._token?<li className="item">
                                <Link to="login" key="login">Log in</Link> or <Link to="register" key="register">Register</Link>
                                                    </li>:""
                        }
                        <li className="item">Daily Offers</li>
                        <li className="item">Buy what you need</li>
                        <li className="item">Sell with us</li>
                        <li className="item">English</li>

                    </ul>
                </div>
            </div>
            <div className="main-nav">
                <div className="container">
                    <div className="logo">

                    </div>
                    <div className="search">
                        <Formik
                            initialValues={{search_text: "", category: ""}}
                            onSubmit={onSubmit}
                            render={form}
                            validationSchema={schema()} />
                    </div>
                    <div className="portfolio-icon">

                    </div>
                    <div className="notifications">

                    </div>
                    <div className="shopping-cart">

                    </div>
                </div>
            </div>
            <div className="content">
                <div className="container">
                    {links}
                </div>
            </div>
        </div>);
}
