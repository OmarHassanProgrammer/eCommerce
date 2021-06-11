import useState from "react-usestateref";
import React, {useEffect} from "react";
import axios from "axios";

export default function Categories(props) {
    const [categories, setCategories, categoriesRef] = useState([]);
    const [categoriesList, setCategoriesList, categoriesListRef] = useState();
    const [first, setFirst] = useState(true);

    let _listUI;

    function createSorting(list) {
        let content = [];
        let optionActivated = false;

        for (let i = 0; i < list.length; i++) {

            if(props.selectedOptionId == list[i].id) {
                optionActivated = true;
            }

            if (Object.values(list[i].subCategories).length !== 0) {
                let subCategories = createSorting(Object.values(list[i].subCategories));
                content.push(React.createElement('li',
                    {key: i,
                        className: `parent option` + (props.selectedOptionId == list[i].id?" active open":"") + (subCategories[0]?' open':''),
                        onClick: props.handleSelectedOption,
                        value: list[i].id,
                        optionname: list[i].name}
                    ,[
                        React.createElement('span', {key: 1, className: 'change-status', onClick: props.handleOptionStatus}, ''),
                        list[i].name]));

                if(subCategories[0]) {
                    optionActivated = true;
                }

                content.push(subCategories[1]);
            } else {
                content.push(React.createElement('li',
                    {key: i,
                        className: `option` + (props.selectedOptionId == list[i].id?" active open":""),
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
                    'parentGroup': 'ALL',
                    'pagination': 0
                },
                method: "GET"
            })
                .then(response => {
                    let _categories = response.data;
                    let newCategories = [];

                    console.log(response.data)
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
        console.log('ss');
    }, [props.selectedOptionId]);
    return (
        <div className="categories-options">
            { categoriesListRef.current }
        </div>

    );
}
