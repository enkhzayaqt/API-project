import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteSpotThunk, getSpotDetailsThunk } from "../../store/spots";
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

    const deleteSpot = (e) => {
        e.preventDefault();
        dispatch(deleteSpotThunk(spotId));
        history.push(`/`);
    };

    const editSpot = (e) => {
        e.preventDefault();
          history.push(`/spot/${spotId}/edit`);
    };

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
            <div>Price: ${price} night</div>
            {user?.id == ownerId &&
                <div className="btn-delete-edit-container">
                    <button className="button-delete" onClick={(e) => deleteSpot(e)}>
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button className="button-edit" onClick={(e) => editSpot(e)}>
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            }

        </div>
    );
};

export default SpotDetails;
