import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref';
import {Link, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {AuthContext} from "../../contexts/AuthContext";
import {CategoriesContext} from "../../contexts/CategoriesContext";
import {me} from "../../../helperFiles/auth";
import {Field, Formik, ErrorMessage, yupToFormErrors} from "formik";
import * as Yup from "yup";
import axios from "axios";
import Categories from "../../subComponents/Categories";
import HomePage from "../mainPagePages/HomePage";
import CategoryPage from "../mainPagePages/CategoryPage";
import ProductPage from "../mainPagePages/ProductPage";
import Thumb from '../../subComponents/Thumb';

export default function InfoSellPage() {
    const authContext = useContext(AuthContext);
    const categoriesContext = useContext(CategoriesContext);
    const history = useHistory();
    let location = useLocation();
    const [parentsFamilyElement, setParentsFamilyElement, parentsFamilyElementRef] = useState([]);
    const [category, setCategory, categoryRef] = useState(getQueryParam('category', 0));
    const [selectedOption, setSelectedOption] = useState({
        id: '0',
        name: 'All'
    });
    const [brands, setBrands, brandsRef] = useState([]);
    const [changingCategory, setChangingCategory, changingCategoryRef] = useState(false);
    const [photos, setPhotos, photosRef] = useState([]);
    const [pesudoPhotos, setpesudoPhotos, pesudoPhotosRef] = useState(new Array(13).fill("pesudo"));
    const [changingLocation, setChangingLocation, changingLocationRef] = useState(false);
    const [photosFiles, setPhotosFiles, photosFilesRef] = useState([]);

    useEffect(() => {
        /*if(authContext.authRef.current.isTrader != 2) {
            history.push('sell-info');
        }*/
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');

        async function getPrands()  { 
            await axios.request({
                url: "brand/getAll",
                baseURL: baseUrl,
                params: {
                    'api_password': localStorage.getItem('api_password')
                },
                method: "GET"
            })
            .then(response => {
                setBrands(response.data);
            })
            .catch(error => {
                console.log(error.response);
            });
        }
        getPrands();

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

    let handleFileChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            const promises = files.map(file => {
                return (new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }))
            });

            Promise.all(promises).then(images => {
                setPhotosFiles(images);
            }, error => { console.error(error); });
        }
        if (this.props.onChange !== undefined) {
            this.props.onChange(e);
        }
    }

    useEffect(() => {
        categoryFamilyTreeFunc(categoryRef.current);
    }, [categoryRef.current]);

    let form = (formProps) => {
        const {
            values,
            handleChange,
            setFieldValue,
            handleSubmit
        } = formProps;


        return <form className="sell-form" onSubmit={handleSubmit}>
            <div className='title'>Selling Details</div>
            <ul className='inputs'>
                <li className='input'>
                    <span className='input-label'>Title:</span>
                    <div className='input-right'>
                        <Field className='input-field form-control' type='text' name='title' />
                        <div className='input-info'>
                            <div className='remained-characters'>{80 - values.title.length} character(s) left</div>
                        </div>
                    </div>
                </li>
                <li className='input'>
                    <span className='input-label'>Category:</span>
                    <div className='input-right'>
                        <div className='product-route'>
                            {
                                parentsFamilyElementRef.current.length !== 0?parentsFamilyElementRef.current.map((category, index) => {
                                    return  (
                                            <span key={index} >{ category.name } / </span>  
                                        )
                                }):""
                            }
                            <div className={'change-category ' + (changingCategoryRef.current?'':'open') } onClick={() => {setChangingCategory(true)}}>Change Category</div>
                            <div className={"change-category-form " + (changingCategoryRef.current?'open':'')}>
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
                </li>
                <li className='input'>
                    <span className='input-label'>Brand:</span>
                    <div className='input-right'>
                        <select name="brand" className="brands-input" >
                            {
                                (Object.keys(brandsRef.current).length > 0)?
                                brandsRef.current.map((brand, index) => (
                                        <option value={brand.id} label={brand.name} key={index} />
                                    )) : ""
                            }
                        </select>
                        <div className='input-info'>
                            <div className='remained-characters'></div>
                        </div>
                    </div>
                </li>
                <li className='input'>
                    <span className='input-label'>Photos:</span>
                    <div className='input-right'>
                        <div className='photos'>
                            <div className={'add-photo ' + (photosRef.current.length==13?'disabled':'')}>
                                <Field type='file' name='photos' multiple className='file-field' onChange={(event) => {
                                    setPhotos(photosRef.current.concat(Array.from(event.currentTarget.files)));
                                    setpesudoPhotos(new Array(13-photosRef.current.length).fill('pesudo'));

                                    handleFileChange(event);
                                }} />                                    
                                <span className='symbol'><i className="fa fa-plus" aria-hidden="true"></i></span>
                                <span className='text'>Add Photos</span>
                            </div>
                            {
                                photosRef.current.length == 0?'':
                                    photosRef.current.map((photo, index) => {
                                        return <div className='photo used' key={index}>
                                            <Thumb file={photo} />
                                        </div>
                                    })
                            }
                            {
                                pesudoPhotosRef.current.map((ele, index) => {
                                    return <div className='photo' key={index}></div>
                                })
                            }
                        </div>
                    </div>
                </li>
                <li className='input'>
                    <span className='input-label'>Description:</span>
                    <div className='input-right'>
                    
                        <Field className='input-field form-control' component='textarea' name='description' rows="5"/>
                        <div className='input-info'>
                            <div className='remained-characters'>{500 - values.description.length} character(s) left</div>
                        </div>
                    </div>
                </li>         
                <li className='input'>
                    <span className='input-label'>Price:</span>
                    <div className='input-right'>
                        <Field className='input-field form-control' type='number' name='price' />
                    </div>
                </li> 
                <li className='input'>
                    <span className='input-label'>Quantity:</span>
                    <div className='input-right'>
                        <Field className='input-field form-control' type='number' name='quantity' />
                    </div>
                </li>
                <li className='input'>
                    <span className='input-label'>Item Location:</span>
                    <div className='input-right'>
                        <div className={'current-location ' + (changingLocationRef.current?'hide':'')}>Current Location</div>
                        <span className={'change-location ' + (changingLocationRef.current?'hide':'')} onClick={() => {
                            setChangingLocation(true);
                        }}>Change</span>
                        <div className={'change-location-fields ' + (changingLocationRef.current?'':'hide')}>
                            <label className='field-label'>Country or Region</label>
                            <Field className='input-field form-control' type='text' name='location_country' />
                            <label className='field-label'>City or State</label>
                            <Field className='input-field form-control' type='text' name='location_city' />
                            <label className='field-label'>Area or Street</label>
                            <Field className='input-field form-control' type='text' name='location_street' />
                        </div>
                    </div>
                </li>
            </ul>
            <button type="submit" className='btn btn-primary'>Submit</button>
        </form>;
    }

    let schema = () => {
        return Yup.object().shape({
            title: Yup.string().required(),
            title: Yup.string().min(5),
            brand: Yup.number(),
            price: Yup.number(),
            quantity: Yup.number()
        });
    }

    async function handleSubmit(values) {
        const baseUrl = localStorage.getItem('host') + localStorage.getItem('api_extension');
        const _token = localStorage.getItem('_token');

        const photosArr = [];
        const formData = new FormData();
        photosFilesRef.current.forEach(file=>{
            formData.append('photos[]', file);
        });
        
        
        formData.append('name', values.title);
        formData.append('price', values.price);
        formData.append('quantity', values.quantity);
        formData.append('location',  values.location_country + "," + values.location_city + "," + values.location_street);
        formData.append('description', values.description);
        formData.append('brand', values.brand);
        formData.append('category',  categoryRef.current);
        formData.append('token', _token);
        formData.append('api_password',  localStorage.getItem('api_password'));
        console.log(formData);
        
        await axios.request({
            url: "/product/create",
            baseURL: baseUrl,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: formData,
            method: "POST"
        })
            .then(response => {
            })
            .catch(error => {
                console.log(error.response);
            });
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
        setCategory(id);
        setChangingCategory(false);
    }

    let handleChange = () => {

    }

      return (
        <div className="info-sell-page">
            <div className='container'>

            <Formik
                initialValues={{
                    title: "", 
                    photos: [], 
                    description: "", 
                    brand: '1',
                    price: '', 
                    quantity: '',
                    location_country: '',
                    location_city: '',
                    location_street: '',
                }}
                onSubmit={handleSubmit}
                render={form}
                validationSchema={schema()} />             
                    
            </div>
        </div>);
}
