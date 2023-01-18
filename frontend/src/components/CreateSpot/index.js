import React, { useEffect, useState } from "react";
import { addImageThunk, createSpotThunk } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import "./createSpot.css";
import { useHistory } from "react-router-dom";
import Spot from "../Spot";

const CreateSpot = () => {
    const dispatch = useDispatch();
    // const spotsObj = useSelector((state) => state.spot.allSpots);
    // const spots = Object.values(spotsObj);
    const history = useHistory();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);

    const user = useSelector((state) => state?.session?.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSpot = {
            ownerId: user,
            address,
            city,
            state,
            country,
            lat: 37.7645358,
            lng: -122.4730327,
            name,
            description,
            price,
        };
        const createdSpot = dispatch(createSpotThunk(newSpot));

        if (createdSpot && imageUrl) {
            const image = {
                url: imageUrl,
                preview: true
            }

            await dispatch(addImageThunk(image, createdSpot.id));
            history.push(`/spots/${createdSpot.id}`)
        }
    }

    useEffect(() => {
        const errors = [];
        if (name?.length === 0) errors.push("Please enter a name");
        if (address?.length === 0) errors.push("Please enter an address");
        if (city?.length === 0) errors.push("Please enter a city");
        if (state?.length === 0) errors.push("Please enter a state");
        if (country?.length === 0) errors.push("Please enter a country");
        if (price <= 0) errors.push("Please enter a price");
        if (description?.length === 0) errors.push("Please enter a description");

        setErrors(errors);
    },[name, address, city, state, country, price, description]);


    return (
        <div>
            <h1>Create Spot</h1>
            <ul>{errors.map((error, idx) => <li key={idx}>{error}</li>)}</ul>
            <form onSubmit={handleSubmit}>
                <label> Spot Name:
                    <input
                        type="text"
                        placeholder="Spot Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label> Spot address:
                    <input
                        type="text"
                        placeholder="Spot address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <label> City:
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </label>
                <label> State:
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </label>
                <label> Country:
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>
                <label> Price:
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <label> Spot Image:
                    <input
                        type="url"
                        placeholder="Image"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </label>
                <label> Discription:
                    <input
                        type="text"
                        placeholder="Discription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <button>Submit</button>
            </form>
        </div>
    );
};

export default CreateSpot;
