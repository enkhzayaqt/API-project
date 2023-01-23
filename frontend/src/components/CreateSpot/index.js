import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addImageThunk, createSpotThunk } from "../../store/spots";
import "./createSpot.css";

const CreateSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state?.session?.user);

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
        if (validate()) {
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
    }

    const validate = () => {
        const errors = [];
        if (name?.length === 0) errors.push("Please enter a name");
        if (address?.length === 0) errors.push("Please enter an address");
        if (city?.length === 0) errors.push("Please enter a city");
        if (state?.length === 0) errors.push("Please enter a state");
        if (country?.length === 0) errors.push("Please enter a country");
        if (price <= 0) errors.push("Please enter a price");
        if (description?.length === 0) errors.push("Please enter a description");
        setErrors(errors);
        if (errors.length > 0) return false;
        else return true;
    };

    const cancel = (e) => {
        e.preventDefault();
        history.push(`/`);
    };

    return (
        <div className="create-spot-container">
            <button className="btn btn-blue" onClick={() => { history.push('/') }}>
                <i className="fa-solid fa-chevron-left"></i><span style={{ marginLeft: 10 }}>Back</span>
            </button>

            <h1>Create Spot</h1>
            <ul className="error-container">{errors.map((error) => <li key={error}>{error}</li>)}</ul>
            <form onSubmit={handleSubmit}>
                <div className="create-spot-content">
                    <div className="column">
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
                        <label> Spot Image:
                            <input className="input"
                                type="url"
                                placeholder="Image"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </label>
                        <label> Description:
                            <input className="input"
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="column">
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
                        <div className="margin-top-10" style={{ float: 'right' }}>
                            <button className="btn btn-blue" style={{ marginRight: 15 }} onClick={(e) => cancel(e)}>Cancel</button>
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateSpot;
