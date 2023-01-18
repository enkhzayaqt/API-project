import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/GET_SPOTS";
const CREATE_SPOT = 'spots/CREATE_SPOT';
const ADD_IMAGE = 'spots/ADD_IMAGE';


// Action creators
export const getSpots = (spots) => ({
    type: GET_SPOTS,
    spots
});

export const createSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
})

export const addImage = (image) => ({
    type: ADD_IMAGE,
    image
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

export const createSpotThunk = (userInput) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
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

export const addImageThunk = (image, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image)
    })
    if (response.ok) {
        const image = await response.json();
        dispatch(addImage(image));
        return image;
    }
}

// Initial State
const initialState = {
    allSpots: {},
    singleSpot: {},
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
        case CREATE_SPOT: {
            return {
                ...state,
                [action.spot.id]: action.spot
            }
        }
        case ADD_IMAGE:
            return {
              ...state,
              [action.image.id]: {
                ...action.image,
                previewImage: action.image.url
              }
            }
        default:
            return state;
    }
}
