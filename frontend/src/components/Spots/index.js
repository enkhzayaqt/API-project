import React, { useEffect } from "react";
import { getSpotsThunk } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import Spot from "../Spot";

const Spots = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector((state) => state.spot.allSpots);
    const spots = Object.values(spotsObj);

    useEffect(() => {
        dispatch(getSpotsThunk());
    }, []);


    return (
        <div className="spot-container-root">
            {
                spots.map((spot, idx) => {
                    return <Spot data={spot} key={idx} />
                })
            }
        </div>
    );
};

export default Spots;
