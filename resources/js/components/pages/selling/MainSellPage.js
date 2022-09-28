import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref';
import {Link, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {AuthContext} from "../../contexts/AuthContext";
import {CategoriesContext} from "../../contexts/CategoriesContext";
import {me} from "../../../helperFiles/auth";
import {Field, Formik, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";
import Categories from "../../subComponents/Categories";
import HomePage from "../mainPagePages/HomePage";
import CategoryPage from "../mainPagePages/CategoryPage";
import ProductPage from "../mainPagePages/ProductPage";

export default function MainSellPage() {
    const authContext = useContext(AuthContext);
    const categoriesContext = useContext(CategoriesContext);
    const history = useHistory();
    let location = useLocation();
    const [selectedOption, setSelectedOption] = useState({
        id: '0',
        name: 'All'
    });

    useEffect(() => {
        /*if(authContext.authRef.current.isTrader != 2) {
            history.push('sell-info');
        }*/
    }, []);

    let form = (formProps) => {
        const {
            values,
            handleChange,
            setFieldValue,
            handleSubmit
        } = formProps;


        return <form className="search-form" onSubmit={handleSubmit}>
            <div className="input">
                <Field type="text" name="search_text" placeholder="Write the name of the category, the name of the prouct, or part of it" />
            </div>
            <div className="search-btn">
                <input type="submit" value=" "/>
            </div>
        </form>;
    }

    let schema = () => {
        return Yup.object().shape({
            seacrh_text: Yup.string().required()
        });
    }

    async function onSubmit(values) {
        
    }

    let handleOptionStatus = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("HH");
        if(e.target.parentElement.getAttribute('class').search('open') == -1) {
            e.target.parentElement.setAttribute('class', e.target.parentElement.getAttribute('class') + ' open');
        } else  {
            e.target.parentElement.setAttribute('class', e.target.parentElement.getAttribute('class').replace('open', ''));
        }
    }

    let handleSelectedOption = (values) => e => {
        const id = e.target.getAttribute("value");

        if(selectedOption.id !== id) {
            e.stopPropagation();
            setSelectedOption({
                id,
                name: e.target.getAttribute("optionname")
            });
        }

        history.push('/info-sell-page?category=' + id);
    }

    let handleChange = () => {
    }

    return (
        <div className="main-sell-page">
            <div className='container'>
                <div className='add-to-previous'>
                    <div className='title'>Search if someone sells your product</div>
                    <div className="search">
                        <Formik
                            initialValues={{search_text: ""}}
                            onSubmit={onSubmit}
                            render={form}
                            validationSchema={schema()} />
                    </div>
                </div>
                <div className='add-to-category'>
                    <div className='title'>Add to category</div>
                    <div className="select">
                        <select name="parentGroup" className="parent-group-input" value={selectedOption.id} onChange={handleChange} >
                            {
                                (Object.keys(categoriesContext.categoriesRef.current).length > 0)?
                                categoriesContext.categoriesRef.current.map((category, index) => (
                                        <option value={category.id} label={category.name} key={index} />
                                    )) : ""
                            }
                        </select>
                        <div className={"parent-group-input-ui show"} >
                            <div className="options">
                                <Categories selectedOptionId={selectedOption.id} handleSelectedOption={handleSelectedOption(selectedOption.id)} handleOptionStatus={handleOptionStatus}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
