import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/GET_SPOTS";


// Action creators
export const getSpots = (spots) => ({
    type: GET_SPOTS,
    spots,
});


// Thunk action
export const getSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);
    if (response.ok) {
        const allspots = await response.json();
        dispatch(getSpots(allspots));
        return allspots;
    }
};

//   Reducer
const initialState = {
    allSpots: {},
    singleSpot: {},
};

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
        default:
            return state;
    }
}
