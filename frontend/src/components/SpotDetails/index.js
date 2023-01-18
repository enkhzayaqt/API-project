import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpotDetailsThunk } from "../../store/spots";
import "./SpotDetails.css";

const SpotDetails = () => {
    const routeParams = useParams();
    const spotId = routeParams.id;

    const dispatch = useDispatch();
    const spotDetails = useSelector((state) => state.spot.spotDetails);
    const user = useSelector((state) => state.session.user);

    console.log("spotDetails", spotDetails)
    console.log("user", user)
    const history = useHistory();

    useEffect(() => {
        dispatch(getSpotDetailsThunk(spotId));
    }, []);


    const { avgStarRating, numReviews, city, country, description, Owner, ownerId, name, SpotImages, price, state } = spotDetails;
    return (
        <div className="spot-details-container">
            <button onClick={() => history.push("/")}>
                Back
            </button>
            <div>{name}</div>
            <div>star:{avgStarRating} reviewNum:{numReviews}</div>
            <div>{city} {state} {country}</div>
            <div>
                {SpotImages && SpotImages.length > 0 &&
                    <img src={SpotImages[0].url} />
                }
            </div>
            <div>Hosted by {Owner?.firstName} {Owner?.lastName}</div>
            <div>Description: {description}</div>
            <div>Price: {price}</div>
            {user?.id == ownerId &&
                <div className="btn-delete-edit-container">
                    <button className="button-delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button className="button-edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            }

        </div>
    );
};

export default SpotDetails;
