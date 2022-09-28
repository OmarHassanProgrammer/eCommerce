import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import {Link, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import useState from "react-usestateref";
import {me} from "../../../helperFiles/auth";
import {Carousel} from "react-responsive-carousel";

export default function SellPage() {
    const authContext = useContext(AuthContext);
    let history = useHistory();

    useEffect(() => {
        if(authContext.authRef.current.isTrader == 2) {
            history.push('sell');
        }
    }, []);

    let handleLink = (route) => {
        history.push(route);
    }

    return (
        <div className="sell-page">
            <div className='sec1'>
                <div className='left'>
                    <div className='text'>
                        <h2 className='title'>Become an eCommerce Seller</h2>
                        {
                            authContext.authRef.current.status?
                                authContext.authRef.current.authType === 'USER'?
                                authContext.authRef.current.isTrader != 2?
                                <div className='btn' onClick={() => {handleLink('account/sell-settings')}}>Setup Selling Settings</div>:"":
                                <div className='btn' onClick={() => {handleLink('register?trader=true')}}>Sign up</div>:
                                <div className='btn' onClick={() => {handleLink('register?trader=true')}}>Sign up</div>
                                

                        }
                    </div>
                </div>
                <div className='right'>
                    <div className='image'>
                        <img src='images/delivery-box.png' />
                    </div>
                </div>
            </div>
            <div className='sec2'>
                <div className='left'>
                    <div className='image'>
                        <img src='images/sales.png' />
                    </div>
                </div>
                <div className='right'>
                    <div className='title'>
                        Advantages of New Sellers
                    </div>
                    <ul className='advantages'>
                        <li className='advantage'>Free selling fees in the first two months!</li>
                        <li className='advantage'>Free shipping in the first two months</li>
                        <li className='advantage'>Increase showing your product to customers in the first month</li>
                        <li className='advantage'>30 days Trial without paying seller subscription</li>

                    </ul>
                </div>
            </div>
            <div className='sec3'>
                <div className='block'>
                    <div className='title'>
                        Make your own brand
                    </div>
                    <div className='content'>
                        Create your own brand and its rights will be preserved for you, only with small clicks
                    </div>
                </div>
                <div className='block'>
                    <div className='title'>
                        Sell more
                    </div>
                    <div className='content'>
                        for every amount of products you sell you will get badges that will increase your products potential to be shown to the customers snd so you will be able to sell more
                    </div>
                </div>
                <div className='block'>
                    <div className='title'>
                        Gain money
                    </div>
                    <div className='content'>
                        In avargae, sellers get 10000 dollars in their first year of active selling 
                    </div>
                </div>
            </div>
            <div className='sec4'>
                <div className='title'>Q&As about buisness in eCommerce</div>
                <div className='blocks'>
                    <div className='block'>
                        <div className='title'>
                            What is eCommerce?
                        </div>
                        <div className='content'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio. Aliquam sed fermentum eros. Suspendisse fermentum rutrum lorem mattis pretium. Praesent tempor mi sit amet nunc lobortis hendrerit. Morbi ac rhoncus erat, ut ullamcorper sem. Quisque at sapien pulvinar, feugiat lacus non, hendrerit lorem. Sed at eros libero.
                        </div>
                    </div>
                    <div className='block'>
                        <div className='title'>
                            How can I start selling?
                        </div>
                        <div className='content'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio. Aliquam sed fermentum eros. Suspendisse fermentum rutrum lorem mattis pretium. Praesent tempor mi sit amet nunc lobortis hendrerit. Morbi ac rhoncus erat, ut ullamcorper sem. Quisque at sapien pulvinar, feugiat lacus non, hendrerit lorem. Sed at eros libero.
                        </div>
                    </div>
                    <div className='block'>
                        <div className='title'>
                            How much I need to pay before selling
                        </div>
                        <div className='content'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio. Aliquam sed fermentum eros. Suspendisse fermentum rutrum lorem mattis pretium. Praesent tempor mi sit amet nunc lobortis hendrerit. Morbi ac rhoncus erat, ut ullamcorper sem. Quisque at sapien pulvinar, feugiat lacus non, hendrerit lorem. Sed at eros libero.
                        </div>
                    </div>
                    <div className='block'>
                        <div className='title'>
                            Is there a limit of products I can sell
                        </div>
                        <div className='content'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio. Aliquam sed fermentum eros. Suspendisse fermentum rutrum lorem mattis pretium. Praesent tempor mi sit amet nunc lobortis hendrerit. Morbi ac rhoncus erat, ut ullamcorper sem. Quisque at sapien pulvinar, feugiat lacus non, hendrerit lorem. Sed at eros libero.
                        </div>
                    </div>
                    <div className='block'>
                        <div className='title'>
                            How much fees on selling products?
                        </div>
                        <div className='content'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio. Aliquam sed fermentum eros. Suspendisse fermentum rutrum lorem mattis pretium. Praesent tempor mi sit amet nunc lobortis hendrerit. Morbi ac rhoncus erat, ut ullamcorper sem. Quisque at sapien pulvinar, feugiat lacus non, hendrerit lorem. Sed at eros libero.
                        </div>
                    </div>
                    <div className='block'>
                        <div className='title'>
                            How can I be sure that I will get my money?
                        </div>
                        <div className='content'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio. Aliquam sed fermentum eros. Suspendisse fermentum rutrum lorem mattis pretium. Praesent tempor mi sit amet nunc lobortis hendrerit. Morbi ac rhoncus erat, ut ullamcorper sem. Quisque at sapien pulvinar, feugiat lacus non, hendrerit lorem. Sed at eros libero.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
