import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import {useAlert} from "react-alert";
import {Link, useHistory} from "react-router-dom";
import useState from "react-usestateref";
import {me} from "../../../helperFiles/auth";
import {Carousel} from "react-responsive-carousel";

export default function AccountPage() {
    const authContext = useContext(AuthContext);
    let history = useHistory();
    const alert = useAlert();

    /*
    useEffect(() => {
        if(!authContext.authRef.current.status) {
            alert.error(__("notLoggedIn", "messages"));
            history.push('/login');
        }
    }, [authContext.auth.status]);*/

    return (
        <div className="account-page">
            <div className='container'>
                <div className='title'>Your Account</div>
                <div className='blocks'>
                    <Link className='block' to={location => ({ ...location, pathname: `/cart`})}>
                        <div className='image'></div>
                        <div className='content'>
                            <div className='title'>Your Orders</div>
                            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio.</div>
                        </div>
                    </Link>
                    <Link className='block' to={location => ({ ...location, pathname: `/account/data`})}>
                        <div className='image'></div>
                        <div className='content'>
                            <div className='title'>Your data & Security</div>
                            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio.</div>
                        </div>
                    </Link>
                    <Link className='block' to={location => ({ ...location, pathname: `/account/sell-settings`})}>
                        <div className='image'></div>
                        <div className='content'>
                            <div className='title'>Selling Settings</div>
                            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio.</div>
                        </div>
                    </Link>
                    <div className='block'>
                        <div className='image'></div>
                        <div className='content'>
                            <div className='title'>Selling Settings</div>
                            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio.</div>
                        </div>
                    </div>
                    <div className='block'>
                        <div className='image'></div>
                        <div className='content'>
                            <div className='title'>Your messages</div>
                            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio.</div>
                        </div>
                    </div>
                    <div className='block'>
                        <div className='image'></div>
                        <div className='content'>
                            <div className='title'>Buying History</div>
                            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio.</div>
                        </div>
                    </div>
                    <div className='block'>
                        <div className='image'></div>
                        <div className='content'>
                            <div className='title'>Your Payments</div>
                            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum condimentum mi, ut pulvinar purus consectetur et. Integer fringilla mollis odio.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
