import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/GET_REVIEWS";
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
const EDIT_REVIEW = "reviews/EDIT_REVIEW";

// Action creators
export const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
});

export const addReview = (review) => ({
    type: ADD_REVIEW,
    review
});

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

export const editReview = (reviewId) => ({
    type: EDIT_REVIEW,
    reviewId
})


// Thunk
export const getReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const reviews = await response.json();
        dispatch(getReviews(reviews));
        return reviews;
    }
};

export const addReviewThunk = (data, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        const newReview = await response.json();
        dispatch(addReview(newReview));
        return newReview;
    }
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        dispatch(deleteReview(reviewId));
    }
}

export const editReviewThunk = (input, reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    })
    if (response.ok) {
        const editedReview = await response.json();
        dispatch(editReview(editedReview));
        return editedReview;
    }
}

// Initial State
const initialState = {
    spotReviews: {}
};

// Reducer
export default function reviewReducer(state = initialState, action) {
    switch (action.type) {
        case GET_REVIEWS: {
            return {
                ...state,
                spotReviews: action.reviews,
            };
        }
        case ADD_REVIEW:
            return {
                ...state,
                [action.review.id]: action.review,
            }
        case DELETE_REVIEW:
            const newState = {
                ...state,
            }
            delete newState.spotReviews[action.reviewId];
            return newState;
        case EDIT_REVIEW: {
            return {
                ...state,
                [action.review.id]: action.review
            }
        }
        default:
            return state;
    }
}
