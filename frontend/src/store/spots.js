import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/GET_SPOTS";
const GET_SPOTDETAILS = "spots/GET_SPOTDETAILS";
const CREATE_SPOT = 'spots/CREATE_SPOT';
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
    const { address, city, state, country, lat, lng, name, description, price, image } = userInput;

    const formData = new FormData();
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("lat", lat);
    formData.append("lng", lng);
    if (image) formData.append("image", image);

    const response = await csrfFetch('/api/spots/', {
        method: 'POST',
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
    });

    // const data = await response.json();
    // dispatch(createSpot(data));

    if (response.ok) {
        const data = await response.json();
        dispatch(createSpot(data));
        return data;
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
    const { address, city, state, country, lat, lng, name, description, price, image } = input;

    const formData = new FormData();
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("lat", lat);
    formData.append("lng", lng);
    if (image) formData.append("image", image);



    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { "Content-Type": "multipart/form-data" },
        body: formData
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
        case GET_SPOTDETAILS: {
            return {
                ...state,
                spotDetails: action.spot,
            };
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
        default:
            return state;
    }
}
