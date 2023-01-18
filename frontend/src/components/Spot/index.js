import React from "react";
import "./spot.css";

const Spot = (props) => {

    const { id, address, avgRating, city, country, description, name, ownerId, previewImage, price, state } = props.data;
    return (
        <div className="spot-container">
            <a href={`/spot/${id}`} className="spot-thumb-link">
                <div className="thumb-img-container">
                    {previewImage !== 'no image yet' ?
                        <img src={previewImage} className="thumb-img" />
                        :
                        <div className="no-image-container"><span>No Image</span></div>
                    }
                </div>
                <div className="title">{city}, {state}</div>
                <div className="desc">{description}</div>
                <div className="price">${price} night</div>
            </a>
        </div>

    );
};

export default Spot;
