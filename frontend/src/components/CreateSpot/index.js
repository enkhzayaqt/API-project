import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addImageThunk, createSpotThunk } from "../../store/spots";
import "./createSpot.css";

const CreateSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state?.session?.user);
    console.log('user: ', user)

    // const spotsObj = useSelector((state) => state.spot.allSpots);
    // const spots = Object.values(spotsObj);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSpot = {
            ownerId: user.id,
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

        const createdSpot = await dispatch(createSpotThunk(newSpot));

        if (createdSpot && imageUrl) {
            const image = {
                url: imageUrl,
                preview: "true"
            }

            await dispatch(addImageThunk(image, createdSpot.id));
            history.push(`/spot/${createdSpot.id}`)
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
    }, [name, address, city, state, country, price, description]);

    const cancel = (e) => {
        e.preventDefault();
        history.push(`/`);
    };

    return (
        <div>
            <h1>Create Spot</h1>
            <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
            <form onSubmit={handleSubmit}>
                <label> Spot Name:
                    <input className="input"
                        type="text"
                        placeholder="Spot Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label> Spot address:
                    <input className="input"
                        type="text"
                        placeholder="Spot address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <label> City:
                    <input className="input"
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </label>
                <label> State:
                    <input className="input"
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </label>
                <label> Country:
                    <input className="input"
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>
                <label> Price:
                    <input className="input"
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <label> Spot Image:
                    <input className="input"
                        type="url"
                        placeholder="Image"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </label>
                <label> Discription:
                    <input className="input"
                        type="text"
                        placeholder="Discription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <button onClick={(e) => cancel(e)}>Cancel</button>
                <button disabled={errors.length > 0} type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateSpot;
