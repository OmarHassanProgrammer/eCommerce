import React, { Component, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import CarouselComponent from "../../subComponents/Carousel";
import {AuthContext} from "../../contexts/AuthContext";
import {Link} from "react-router-dom";
import useState from "react-usestateref";
import {me} from "../../../helperFiles/auth";
import {Carousel} from "react-responsive-carousel";

export default function HomePage() {
    const authContext = useContext(AuthContext);

    return (
        <div className="home-page">
            <CarouselComponent />
            <div className="wedgets">
                {
                    authContext.authRef.current.status?
                        <div className="wedget col-4">
                            <div className="content">
                                <div className="head">
                                    <h3 className="title">
                                            Hi, { authContext.authRef.current.name }
                                    </h3>
                                </div>
                                <div className="body">
                                        <h4 className="body-title">
                                            Categories Recommended For You:
                                        </h4>
                                    <div className="items">
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                            Electronics
                                        </div>
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                            Clothes</div>
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                            Games</div>
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                            Fashion</div>
                                    </div>
                                </div>
                            </div>
                        </div>:
                        <div className="wedget col-12">
                            <h3 className="title">
                                Hi, Please <Link to="login" key="login">Log in</Link> or <Link to="register" key="register">Register</Link> To Have The Full Experience
                            </h3>
                        </div>
                }
                {
                    authContext.auth._token?
                       <div className="wedget col-4">
                        <div className="content">
                            <div className="body">
                                <h4 className="body-title">
                                    Saved Products:
                                </h4>
                                <div className="items">
                                    <div className="item col-6">
                                        <div className="pseudo-img"></div>
                                        Electronics
                                    </div>
                                    <div className="item col-6">
                                        <div className="pseudo-img"></div>
                                        Clothes</div>
                                    <div className="item col-6">
                                        <div className="pseudo-img"></div>
                                        Games</div>
                                    <div className="item col-6">
                                        <div className="pseudo-img"></div>
                                        Fashion</div>
                                </div>
                                <Link to="/" className="bottom-link">See All</Link>
                            </div>
                        </div>
                    </div>:""
                }
                {
                    authContext.auth._token?
                        <div className="wedget col-4">
                            <div className="content">
                                <div className="body">
                                    <h4 className="body-title">
                                        Products Recommended For You:
                                    </h4>
                                    <div className="items">
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                        </div>
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                        </div>
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                        </div>
                                        <div className="item col-6">
                                            <div className="pseudo-img"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:""
                }
                <div className="wedget col-12">
                    <div className="content">
                        <div className="body">
                            <h4 className="body-title">
                                Wires & Electronics
                            </h4>
                            <Carousel className="items"
                                      centerMode
                                      centerSlidePercentage={100 / 5}
                                      autoPlay="false"
                                      interval="3000"
                                      infiniteLoop="true"
                                      dynamicHeight="true"
                                      showIndicators={false}
                                      showStatus={false}
                                      showThumbs={false}>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="wedget col-12">
                    <div className="content">
                        <div className="body">
                            <h4 className="body-title">
                                Books & Novels
                            </h4>
                            <Carousel className="items"
                                      centerMode
                                      centerSlidePercentage={100 / 5}
                                      autoPlay="false"
                                      interval="3000"
                                      infiniteLoop="true"
                                      dynamicHeight="true"
                                      showIndicators={false}

                                      showStatus={false}
                                      showThumbs={false}>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="wedget col-12">
                    <div className="content">
                        <div className="body">
                            <h4 className="body-title">
                                Games & Softwares
                            </h4>
                            <Carousel className="items"
                                      centerMode
                                      centerSlidePercentage={100 / 5}
                                      autoPlay="false"
                                      interval="3000"
                                      infiniteLoop="true"
                                      dynamicHeight="true"
                                      showIndicators={false}

                                      showStatus={false}
                                      showThumbs={false}>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="wedget col-12">
                    <div className="content">
                        <div className="body">
                            <h4 className="body-title">
                                Our Best Sellers
                            </h4>
                            <Carousel className="items"
                                      centerMode
                                      centerSlidePercentage={100 / 5}
                                      autoPlay="false"
                                      interval="3000"
                                      infiniteLoop="true"
                                      dynamicHeight="true"
                                      showIndicators={false}
                                      showStatus={false}
                                      showThumbs={false}>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="wedget col-12">
                    <div className="content">
                        <div className="body">
                            <h4 className="body-title">
                                Men Fashion
                            </h4>
                            <Carousel className="items"
                                      centerMode
                                      centerSlidePercentage={100 / 5}
                                      autoPlay="false"
                                      interval="3000"
                                      infiniteLoop="true"
                                      dynamicHeight="true"
                                      showIndicators={false}
                                      showStatus={false}
                                      showThumbs={false}>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="wedget col-12">
                    <div className="content">
                        <div className="body">
                            <h4 className="body-title">
                                Women Fashion
                            </h4>
                            <Carousel className="items"
                                      centerMode
                                      centerSlidePercentage={100 / 5}
                                      autoPlay="false"
                                      interval="3000"
                                      infiniteLoop="true"
                                      dynamicHeight="true"
                                      showIndicators={false}
                                      showStatus={false}
                                      showThumbs={false}>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="wedget col-12">
                    <div className="content">
                        <div className="body">
                            <h4 className="body-title">
                                Children Fashion
                            </h4>
                            <Carousel className="items"
                                      centerMode
                                      centerSlidePercentage={100 / 5}
                                      autoPlay="false"
                                      interval="3000"
                                      infiniteLoop="true"
                                      dynamicHeight="true"
                                      showIndicators={false}
                                      showStatus={false}
                                      showThumbs={false}>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                                <div className="item">
                                    <div className="pseudo-img"></div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
