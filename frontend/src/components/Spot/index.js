import React, { useEffect } from "react";
import { getSpotsThunk } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import "./spot.css";
import { useHistory } from "react-router-dom";

const Spot = (props) => {

    const { id, address, avgRating, city, country, discription, name, ownerId, previewImage, price, state } = props.data;
    return (
        <div className="spot-container">
            <div>Spot Id: {id}</div>
            <div>{name}</div>
            <div>
                {previewImage !== 'no image yet' &&
                    <img src={previewImage} width='200' />
                }
            </div>
            <div>Address: {address}, {city}, {state}, { country}</div>
            <div>Owner Id: {ownerId}</div>
            <div>Rating: {avgRating}</div>
            <div>Description: {discription}</div>
            <div>Price: {price}</div>
        </div>
    );
};

export default Spot;
