import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteReviewThunk, getReviewsThunk } from "../../store/review";
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
        ratingDom.push(<i class="fas fa-star rating-color"></i>);
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

            <div>{name}</div>
            <div>{city} {state} {country}</div>
            <div>
                {SpotImages && SpotImages.length > 0 &&
                    <img src={SpotImages[0].url} />
                }
            </div>
            <div>Hosted by {Owner?.firstName} {Owner?.lastName}</div>
            <div>Description: {description}</div>
            <div>Price: ${price} night</div>

            {/* Review section */}
            <div>
                <div className="review-container">
                    <div className="review-header">
                        {intRating > 0 &&
                            <h4>
                                {ratingDom} {avgStarRating.toFixed(1)}
                            </h4>
                        }
                        <h4> - {numReviews} Reviews</h4>

                        <div className="write-review-modal">
                            {user &&
                                <OpenModalMenuItem
                                    itemText="Write a review"
                                    onItemClick={openNewReviewModal}
                                    modalComponent={<ReviewFormModal spotId={spotId} callbackClose={() => OnModalClose()} />}
                                />
                            }
                        </div>
                    </div>
                    <div className="review-body">
                        {
                            spotReviews?.map((review, idx) => {
                                const reviewDate = new Date(review.createdAt);
                                return (
                                    <div key={idx}>

                                        <div>
                                            Stars: {review.stars}
                                        </div>
                                        <div>User: {review.User.firstName} {review.User.lastName}</div>
                                        <div>
                                            Review: {review.review}
                                        </div>
                                        <div>Created at: {reviewDate.toDateString()}</div>
                                        <div>
                                            {user?.id == review.userId &&
                                                <div className="edit-delete-review-btn-container">
                                                    <button>
                                                        <OpenModalMenuItem
                                                            itemText="Edit review"
                                                            onItemClick={openNewReviewModal}
                                                            modalComponent={<EditReviewModal reviewId={review.id} review={review.review} stars={review.stars} callbackClose={() => OnModalClose()} />}
                                                        />
                                                    </button>

                                                    <div className="btn-delete-edit-container">
                                                        <button className="button-delete" onClick={() => deleteReview(review.id)}>
                                                            Delete review
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <br />
                                    </div>
                                )

                            })
                        }

                    </div>
                </div>
            </div>


        </div>
    );
};

export default SpotDetails;
