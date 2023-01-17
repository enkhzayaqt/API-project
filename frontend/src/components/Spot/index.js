import React, { useEffect } from "react";
import { getSpotsThunk } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import "./spot.css";
import { useHistory } from "react-router-dom";

const Spot = (props) => {

    const { id, address, avgRating, city, country, discription, name, ownerId, previewImage, price, state } = props.data;
    return (
        <div>
            <div>Spot Id: {id}</div>
            <div>{name}</div>
            <div>Address: {address}, {city}, {state}, { country}</div>
            <div>Owner Id: {ownerId}</div>
            <div>Rating: {avgRating}</div>
            <div>Discription: {discription}</div>
            <div>{previewImage}</div>
            <div>Price: {price}</div>
        </div>
    );
};

export default Spot;
