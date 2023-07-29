import React from "react";
import { useSelector } from "react-redux";

const Spot = (props) => {
    const user = useSelector((state) => state.session.user);
    const { id, avgRating, city, description, image, price, state } = props.data;
    const intRating = !isNaN(avgRating) ? Math.floor(avgRating) : 0;
    const ratingDom = [];
    for (let i = 0; i < intRating; i++) {
        ratingDom.push(<i className="fas fa-star rating-color"></i>);
    }
    return (
        <div className="spot-container">
            <a href={`/spot/${id}`} className="spot-thumb-link">
                <div className="thumb-img-container">
                    {image !== 'no image yet' ?
                        <img src={image} className="thumb-img" alt="Spot Image" />
                        :
                        <div className="no-image-container"><span>No Image</span></div>
                    }
                </div>
                <div className="address-review-container">
                    <div className="title">{city}, {state}</div>
                    <div className="home-reviews">
                        {intRating > 0 &&
                            <h4>
                                {ratingDom} {avgRating.toFixed(1)}
                            </h4>
                        }
                        {intRating == 0 &&
                            <h4>
                                0.0
                            </h4>
                        }
                    </div>
                </div>

                <div className="desc">{description}</div>
                <div className="price">${price} night</div>
            </a>

        </div>

    );
};

export default Spot;
