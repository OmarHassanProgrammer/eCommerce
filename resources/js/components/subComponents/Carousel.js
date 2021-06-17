import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function CarouselComponent() {
    return (
        <Carousel
            className="carousel"
            autoPlay="false"
            interval="3000"
            infiniteLoop="true"
            dynamicHeight="true"
            showThumbs={false}>
            <div className="block">
                <img src="images/carousel/1.jpg" className="bg-img"/>
                <h2 className="title">Computer & Gaming Accessories</h2>
            </div>
            <div className="block">
                <img src="images/carousel/2.png" className="bg-img"/>
                <h2 className="title">Hot Sales Up To 50% Off</h2>
            </div>
            <div className="block">
                <img src="images/carousel/3.jpg" className="bg-img"/>
                <h2 className="title">Read Up To 1000 Books</h2>
            </div>
        </Carousel>
    );
}
