import React, {useEffect, useContext} from 'react';
import {Field, Formik, ErrorMessage} from "formik";
import useState from 'react-usestateref';
import {Link, useHistory} from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import {useAlert} from "react-alert";
import {me} from "../../../../../helperFiles/auth";
import {AuthContext} from "../../../../contexts/AuthContext";
import Categories from "../../../../subComponents/Categories";

export default function AddCategory(props) {
    const [selectInputStatues, setSelectInputStatues, selectInputStatuesRef] = useState("show");
    const [selectedOption, setSelectedOption] = useState({
        id: getQueryParam('group-parent-id', 0),
        name: getQueryParam('group-parent-name', 'None')
    });
    const [categories, setCategories, categoriesRef] = useState([]);
    let history = useHistory();
    const alert = useAlert();
    const [parentsFamilyElement, setParentsFamilyElement, parentsFamilyElementRef] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if(authContext.authRef.current.authType !== 'ADMIN') {
            history.push('/');
        }

    }, [authContext.auth]);

    useEffect(() => {
        categoryFamilyTreeFunc(getQueryParam('group-parent-id', 0));
    }, []);

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
                        'api_password': localStorage.getItem('api_password'),
                        'token': _token,
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
                        _categoryFamilyTreeFunc();
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

    useEffect(() => {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');
        setSelectedOption({
            id: getQueryParam('group-parent-id', 0),
            name: getQueryParam('group-parent-name', 'None')
        });

        async function getCategories() {
            await axios.request({
                url: "category/getAll",
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password'),
                    'parentGroup': "ALL",
                    'pagination': 0
                },
                method: "GET"
            })
                .then(response => {
                    console.log("fefgef", response);
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
            <div className="select" onClick={handleSelectInputStatus}>
                <select name="parentGroup" className="parent-group-input" value={values.parentGroup} onChange={handleChange} >
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
                        <div className={"option " + (selectedOption.id == 0?"active":"")} value="0" optionname="None" onClick={handleSelectedOption(values, setFieldValue)} >None</div>
                        <Categories selectedOptionId={selectedOption.id} handleSelectedOption={handleSelectedOption(values, setFieldValue)} handleOptionStatus={handleOptionStatus}/>
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
                        <Link to='/admin/dashboard' onClick={props.handleRerenderEffect} >Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to='/admin/dashboard/categories' onClick={props.handleRerenderEffect} >Categories</Link>
                    </li>
                    <li className="breadcrumb-item active" >Add Category</li>
                </ol>
            </div>
            <div className="add-category">
                <Formik
                    initialValues={{name: "", parentGroup: parseInt(getQueryParam('group-parent-id', 0)), logo: ""}}
                    onSubmit={onSubmit}
                    render={form}
                    validationSchema={schema()} />
            </div>
        </div>
    );
}
