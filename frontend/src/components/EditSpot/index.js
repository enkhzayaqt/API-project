import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { addImageThunk, editSpotThunk } from "../../store/spots";
import './EditSpot.css'

const EditSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const user = useSelector((state) => state?.session?.user);
    const oldSpot = useSelector((state) => state.spot);

    const [name, setName] = useState(oldSpot.spotDetails.name);
    const [address, setAddress] = useState(oldSpot.spotDetails.address);
    const [city, setCity] = useState(oldSpot.spotDetails.city);
    const [state, setState] = useState(oldSpot.spotDetails.state);
    const [country, setCountry] = useState(oldSpot.spotDetails.country);
    const [price, setPrice] = useState(oldSpot.spotDetails.price);
    const [imageUrl, setImageUrl] = useState(oldSpot.spotDetails.imageUrl);
    const [description, setDescription] = useState(oldSpot.spotDetails.description);
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

        const editedSpot = await dispatch(editSpotThunk(newSpot, spotId));

        if (editedSpot) {
            history.push(`/spot/${spotId}`);
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
        history.push(`/spot/${spotId}`);
    };

    return (
        <div>
            <button className="btn btn-blue" onClick={() => { history.push(`/spot/${spotId}`) }}>
                    <i className="fa-solid fa-chevron-left"></i><span style={{ marginLeft: 10 }}>Back</span>
                </button>

            <h1>Edit Spot</h1>
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
                <label> Description:
                    <input className="input"
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <button onClick={(e) => cancel(e)}>Cancel</button>
                <button disabled={errors.length > 0} type="submit">Save Edit</button>
            </form>
        </div>
    );
};

export default EditSpot;
