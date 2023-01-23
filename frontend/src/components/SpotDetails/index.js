import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteReviewThunk, editReviewThunk, getReviewsThunk } from "../../store/review";
import { deleteSpotThunk, getSpotDetailsThunk, getSpotsThunk } from "../../store/spots";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ReviewFormModal from "../ReviewFormModal";
import EditReviewModal from '../EditReviewModal';
import "./SpotDetails.css";

const SpotDetails = () => {
    const routeParams = useParams();
    const spotId = routeParams.id;

    const dispatch = useDispatch();
    const spotDetails = useSelector((state) => state.spot.spotDetails);
    const spotReviews = useSelector((state) => state.review.spotReviews.Reviews);

    const user = useSelector((state) => state.session.user);
    const history = useHistory();

    const { avgStarRating, numReviews, city, country, description, Owner, ownerId, name, SpotImages, price, state } = spotDetails;
    const intRating = !isNaN(avgStarRating) ? Math.floor(avgStarRating) : 0;

    const ratingDom = [];
    for (let i = 0; i < intRating; i++) {
        ratingDom.push(<i className="fas fa-star rating-color"></i>);
    }

    const deleteSpot = () => {
        dispatch(deleteSpotThunk(spotId));
        //refresh
        dispatch(getSpotsThunk());
        history.push(`/`);
    };

    const editSpot = (e) => {
        e.preventDefault();
        history.push(`/spot/${spotId}/edit`);
        //refresh
        dispatch(getSpotDetailsThunk(spotId));
        dispatch(getReviewsThunk(spotId));
    };

    const deleteReview = (reviewId) => {
        dispatch(deleteReviewThunk(reviewId));
        //refresh
        dispatch(getSpotDetailsThunk(spotId));
        dispatch(getReviewsThunk(spotId));
    };

    const editReview = (e) => {
        e.preventDefault();
        history.push(`/spot/${spotId}/edit`);
    };
    // const addReview = (e) => {
    //     e.preventDefault();
    //     history.push()
    // }
    useEffect(() => {
        dispatch(getSpotDetailsThunk(spotId));
        dispatch(getReviewsThunk(spotId));
    }, []);

    const openNewReviewModal = () => {
    };

    const OnModalClose = () => {
        dispatch(getSpotDetailsThunk(spotId));
        dispatch(getReviewsThunk(spotId));
    }

    return (
        <div className="spot-details-container">
            <div className="back-edit-delete-btn-container">
                <button className="btn btn-blue" onClick={() => history.push("/")}>
                    <i className="fa-solid fa-chevron-left"></i><span style={{ marginLeft: 10 }}>Back</span>
                </button>
                {user && user?.id === ownerId &&
                    <div className="btn-delete-edit-container">
                        <button className="btn btn-blue" style={{ marginRight: 8 }} onClick={(e) => editSpot(e)}>
                            <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button className="btn btn-primary" onClick={(e) => deleteSpot(e)}>
                            <i className="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                }
            </div>
            <h2>{name}</h2>
            <div className="spot-details-header margin-top-10">
                <div className="review-header">
                    {intRating > 0 &&
                        <h4>
                            {ratingDom} {avgStarRating.toFixed(1)}
                        </h4>
                    }
                    <h4>{numReviews > 0 ?
                        <>
                            - {numReviews} {numReviews === 1 ? "review" : "reviews"}
                        </>
                        :
                        "0 review"
                    }
                    </h4>
                </div>
                <div><i className="fa-solid fa-location-dot"></i> {city} {state} {country}</div>
            </div>
            <div className="spot-image-container">
                {SpotImages && SpotImages.length > 0 &&
                    <img className="spot-image" src={SpotImages[0].url} alt="Spot Image" />
                }
            </div>
            <div className="spot-description-container">
                <div className="spot-description">
                    <h2>
                        Hosted by {Owner?.firstName} {Owner?.lastName}
                    </h2>
                    <div className="margin-top-10">Description: {description}</div>
                </div>
                <div className="spot-price">
                    <div><h2>${price}</h2> night</div>
                </div>
            </div>

            {/* Review section */}
            <div>
                <div className="review-container">
                    <div className="review-header">
                        {intRating > 0 &&
                            <h2>
                                {ratingDom} {avgStarRating.toFixed(1)}
                            </h2>
                        }
                        <h4>{numReviews > 0 ?
                            <>- {numReviews} {numReviews === 1 ? "review" : "reviews"}</>
                            : "0 review"
                        }
                        </h4>
                        <div className="write-review-modal">
                            {user &&
                                <button className="btn-openmodal btn-white">
                                    <OpenModalMenuItem
                                        itemText="Write a review"
                                        onItemClick={openNewReviewModal}
                                        modalComponent={<ReviewFormModal spotId={spotId} callbackClose={() => OnModalClose()} />}
                                    />
                                </button>
                            }
                        </div>
                    </div>
                    <div className="review-body">
                        {
                            spotReviews?.map((review, idx) => {
                                const reviewDate = new Date(review.createdAt);
                                const reviewStarDom = [];
                                for (let i = 0; i < review.stars; i++) {
                                    reviewStarDom.push(<i className="fas fa-star rating-color"></i>);
                                }
                                return (
                                    <div className="review-item" key={idx}>
                                        <div className="review-item-header">
                                            <div className="title">
                                                <div className="avatar">
                                                    <i className="far fa-user" />
                                                </div>
                                                <div className="titlebody">
                                                    <div className="name">{review.User.firstName} {review.User.lastName}</div>
                                                    <div className="date">{reviewDate.toDateString()}</div>
                                                    <div>{reviewStarDom}</div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="review-item-desc">{review.review}</div>
                                        <div className="buttons">
                                                {user?.id == review.userId &&
                                                    <div className="edit-delete-review-btn-container">
                                                        <button className="btn-openmodal btn-blue" style={{
                                                            marginRight: 5
                                                        }}>
                                                            <OpenModalMenuItem
                                                                itemText="Edit"
                                                                onItemClick={openNewReviewModal}
                                                                modalComponent={<EditReviewModal reviewId={review.id} review={review.review} stars={review.stars} callbackClose={() => OnModalClose()} />}
                                                            />
                                                        </button>
                                                        <div className="btn-delete-edit-container">
                                                            <button className="btn btn-primary" onClick={() => deleteReview(review.id)}>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                    </div>
                                )

                            })
                        }

                    </div>
                </div>
            </div>


        </div >
    );
};

export default SpotDetails;
