import React, {useEffect, useContext} from 'react';
import {Field, Formik, ErrorMessage} from "formik";
import ReactDOM from 'react-dom';
import useState from 'react-usestateref';
import {Link, useHistory} from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import {useAlert} from "react-alert";
import {me} from "../../../../../helperFiles/auth";
import {AuthContext} from "../../../../contexts/AuthContext";

export default function AddCategory(props) {
    const [selectInputStatues, setSelectInputStatues, selectInputStatuesRef] = useState("show");
    const [selectedOption, setSelectedOption] = useState({id: 0,name: "None"});
    let history = useHistory();
    const alert = useAlert();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        me('ADMIN').then(r => {
            if(!r) {
                history.push('/');
            }
        });

    }, [authContext.auth]);

    function Categories() {
        const [categories, setCategories, categoriesRef] = useState([]);
        const [categoriesList, setCategoriesList, categoriesListRef] = useState();

        let _listUI;

        function createSorting(list) {
            let content = [];

            console.log(":", list.length);

            for (let i = 0; i < list.length; i++) {
                content.push(React.createElement('li', {key: i}, list[i].name));
                console.log(i, list[i].name);
                if (Object.values(list[i].subCategories).length !== 0) {
                    console.log("yes");
                    content.push(createSorting(Object.values(list[i].subCategories)));
                }
            }

            let listUI = React.createElement('ul', {}, content);

            console.log(listUI);

            return listUI;
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
                        setCategoriesList(createSorting(categoriesRef.current));
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            getCategories(0);
        }, []);

        return (
            <div>
                { categoriesListRef.current }
            </div>
            
        );
    }


    let handleSelectInputStatues = () => {
        if(selectInputStatues === "") {
            setSelectInputStatues("show");
        } else {
            setSelectInputStatues("");
        }
    }

    let handleSelectedOption = (e) => {
        setSelectedOption({
            id: e.target.getAttribute("value"),
            name: e.target.getAttribute("optionname")
        });
        console.log(e.target.getAttribute("value"));
    }

    let form = (props) => {
        const {
                values,
                handleChange
            } = props;


        return <form className="add-category-form" onSubmit={props.handleSubmit}>
            <h2 className="title">Create Category</h2>
            <div className="name-input-container">
                <Field type="text" name="name" className="name-input" placeholder="Category Name" />
                <span className="error">
                    <ErrorMessage name="name"/>
                </span>
            </div>
            <div className="select">
                <select name="parentGroup" className="parent-group-input" value={values.parentGroup} onChange={handleChange}>
                    <option value="0" label="None" />
                    {
                        // categories !== []?
                        //     categories.map((category, index) => (
                        //         <option value={category.id} label={category.name} key={index} />
                        //     )) : ""
                    }
                </select>
                <div className={"parent-group-input-ui " + selectInputStatues} onClick={handleSelectInputStatues}>
                    <div className="selected-option" value={selectedOption.id}>{selectedOption.name}</div>
                    <div className="options">
                        <div className={"option " + (selectedOption.id == 0?"active":"")} value="0" optionname="None" onClick={handleSelectedOption} >None</div>
                        <Categories />
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
                    initialValues={{name: "", parentGroup: "0", logo: ""}}
                    onSubmit={onSubmit}
                    render={form}
                    validationSchema={schema()} />
            </div>
        </div>
    );
}
