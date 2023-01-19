import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/GET_SPOTS";
const GET_SPOTDETAILS = "spots/GET_SPOTDETAILS";
const CREATE_SPOT = 'spots/CREATE_SPOT';
const ADD_IMAGE = 'spots/ADD_IMAGE';
const DELETE_SPOT = "spots/DELETE_SPOT";
const EDIT_SPOT = "spots/EDIT_SPOT";


// Action creators
export const getSpots = (spots) => ({
    type: GET_SPOTS,
    spots
});

export const getSpotDetails = (spot) => ({
    type: GET_SPOTDETAILS,
    spot
});

export const createSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
})

export const addImage = (image) => ({
    type: ADD_IMAGE,
    image
})

export const deleteSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId
})

export const editSpot = (spot) => ({
    type: EDIT_SPOT,
    spot
})

// Thunk
export const getSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);
    if (response.ok) {
        const allspots = await response.json();
        dispatch(getSpots(allspots));
        return allspots;
    }
};

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const spotDetails = await response.json();
        dispatch(getSpotDetails(spotDetails));
        return spotDetails;
    }
};

export const createSpotThunk = (userInput) => async (dispatch) => {
    const response = await csrfFetch('/api/spots/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput)
    });
    if (response.ok) {
        const spot = await response.json();
        dispatch(createSpot(spot));
        return spot;
    }
}

export const addImageThunk = (input, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    })
    if (response.ok) {
        const image = await response.json();
        dispatch(addImage(image));
        return image;
    }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        const spot = await response.json();
        dispatch(deleteSpot(spot));
        return spot;
    }
}

export const editSpotThunk = (input, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    })
    if (response.ok) {
        const editedSpot = await response.json();
        dispatch(editSpot(editedSpot));
        return editedSpot;
    }
}

// Initial State
const initialState = {
    allSpots: {},
    spotDetails: {}
};

// Reducer
export default function spotsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return {
                ...state,
                allSpots: newState
            }
        }
        case CREATE_SPOT:
            return {
                ...state,
                [action.spot.id]: action.spot
            }
        case ADD_IMAGE:
            return {
                ...state,
                [action.image.id]: {
                    ...action.image,
                    previewImage: action.image.url
                }
            }
        case DELETE_SPOT:
            const newState = {
                ...state
            }
            delete newState.allSpots[action.spotId]
            return newState
        case EDIT_SPOT: {
            return {
                ...state,
                [action.spot.id]: action.spot
            }
        }
        case GET_SPOTDETAILS: {
            return {
                ...state,
                spotDetails: action.spot,
            };
        }
        default:
            return state;
    }
}
