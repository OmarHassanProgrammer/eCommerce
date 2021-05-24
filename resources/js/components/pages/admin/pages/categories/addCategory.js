import React, {useEffect, useContext} from 'react';
import {Field, Formik, ErrorMessage} from "formik";
import ReactDOM from 'react-dom';
import useState from 'react-usestateref';
import {Link, useHistory, useParams} from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import {useAlert} from "react-alert";
import {me} from "../../../../../helperFiles/auth";
import {AuthContext} from "../../../../contexts/AuthContext";
import { parse } from 'query-string';

function Categories(props) {
    const [categories, setCategories, categoriesRef] = useState([]);
    const [categoriesList, setCategoriesList, categoriesListRef] = useState();
    const [first, setFirst] = useState(true);

    let _listUI;

    function createSorting(list) {
        let content = [];
        let optionActivated = false;

        for (let i = 0; i < list.length; i++) {

            if(props.selectedOptionId === list[i].id) {
                optionActivated = true;
            }

            if (Object.values(list[i].subCategories).length !== 0) {
                content.push(React.createElement('li',
                    {key: i,
                            className: `parent option` + (props.selectedOptionId === list[i].id?" active":""),
                            onClick: props.handleSelectedOption,
                            value: list[i].id,
                            optionname: list[i].name}
                    ,list[i].name));

                let subCategories = createSorting(Object.values(list[i].subCategories));
                if(subCategories[0]) {
                    optionActivated = true;
                }

                content.push(subCategories[1]);
            } else {
                content.push(React.createElement('li',
                    {key: i,
                            className: `option` + (props.selectedOptionId === list[i].id?" active":""),
                            onClick: props.handleSelectedOption,
                            value: list[i].id,
                            optionname: list[i].name},
                    list[i].name));
            }
        }

        let listUI = React.createElement('ul', {className: (optionActivated?"has-active-option":"")}, content);

        return [optionActivated, listUI];
    }
    useEffect(() => {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        async function getCategories(parent_id) {
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
                    let _categories = response.data.data;
                    let newCategories = [];

                    _categories.map((category, index) => {
                        category.subCategories = {};
                    });

                    _categories.map((category, index) => {
                        if(category.parent_group !== 0) {
                            _categories.map((_category) => {
                                if(_category.id === category.parent_group) {
                                    _category['subCategories'][category.id] = category;
                                    return;
                                }
                            });
                        }
                    });

                    _categories.map((category, index) => {
                        if(category.parent_group === 0) {
                            newCategories.push(category);
                        }
                    });
                    setCategories(newCategories);
                    setCategoriesList(createSorting(categoriesRef.current)[1]);
                    setFirst(false);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        getCategories(0);
    }, []);
    useEffect(() => {
        setCategoriesList(createSorting(categoriesRef.current)[1]);
    }, [props.selectedOptionId]);
    return (
        <div className="categories-options">
            { categoriesListRef.current }
        </div>

    );
}

export default function AddCategory(props) {
    const [selectInputStatues, setSelectInputStatues, selectInputStatuesRef] = useState("show");
    const [selectedOption, setSelectedOption] = useState({id: 0,name: "None"});
    const [categories, setCategories, categoriesRef] = useState([]);
    let history = useHistory();
    const alert = useAlert();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        me('ADMIN').then(r => {
            if(!r) {
                history.push('/');
            }
        });

        console.log(props.location.search('parent_group_id'));
    }, [authContext.auth]);

    useEffect(() => {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        const query = parse(location.search);
        const parentGroupId = query.parent_group_id;

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
                    setCategories(response.data.data);
                });
            }
        getCategories();

        console.log(parentGroupId);
    }, []);

    let handleSelectInputStatues = () => {
        if(selectInputStatues === "") {
            setSelectInputStatues("show");
        } else {
            setSelectInputStatues("");
        }
    }

    let handleSelectedOption = (values, setFieldValue) => e => {
        const id = e.target.getAttribute("value");

        setSelectedOption({
            id,
            name: e.target.getAttribute("optionname")
        });
        setFieldValue("parentGroup", id);
    }

    let form = (formProps) => {
        const {
                values,
                handleChange,
                setFieldValue,
                handleSubmit
            } = formProps;


        return <form className="add-category-form" onSubmit={handleSubmit}>
            <h2 className="title">Create Category</h2>
            <div className="name-input-container">
                <Field type="text" name="name" className="name-input" placeholder="Category Name" />
                <span className="error">
                    <ErrorMessage name="name"/>
                </span>
            </div>
            <div className="select">
                <select name="parentGroup" className="parent-group-input" value={values.parentGroup} onChange={handleChange} >
                    <option value="0" label="None" />
                    {
                        categories !== []?
                            categories.map((category, index) => (
                                <option value={category.id} label={category.name} key={index} />
                            )) : ""
                    }
                </select>
                <div className={"parent-group-input-ui " + selectInputStatues} onClick={handleSelectInputStatues}>
                    <div className="selected-option" value={selectedOption.id}>{selectedOption.name}</div>
                    <div className="options">
                        <div className={"option " + (selectedOption.id === 0?"active":"")} value="0" optionname="None" onClick={handleSelectedOption(values, setFieldValue)} >None</div>
                        <Categories selectedOptionId={selectedOption.id} handleSelectedOption={handleSelectedOption(values, setFieldValue)}/>
                    </div>
                </div>
            </div>

            <input className="add-category-btn" type="submit" value="CREATE" />
        </form>;
    }

    let schema = () => {
        return Yup.object().shape({
            name: Yup.string().required().min(3)
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
        <div className="categories-page">
            <div aria-label="breadcrumb" className="breadcrumb-container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard/' onClick={props.handleRerenderEffect} >Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard/categories' onClick={props.handleRerenderEffect} >Categories</Link>
                    </li>
                    <li className="breadcrumb-item active" >Add Category</li>
                </ol>
            </div>
            <div className="add-category">
                <Formik
                    initialValues={{name: "", parentGroup: '0', logo: ""}}
                    onSubmit={onSubmit}
                    render={form}
                    validationSchema={schema()} />
            </div>
        </div>
    );
}
