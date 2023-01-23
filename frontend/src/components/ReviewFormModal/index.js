import React, { useEffect, useState } from "react";
import * as reviewActions from "../../store/review";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./ReviewModal.css"

function ReviewFormModal({ spotId, callbackClose }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleStarChange = (checkboxId) => {
    setStars(checkboxId)
    setChecked1(false);
    setChecked2(false);
    setChecked3(false);
    setChecked4(false);
    setChecked5(false);
    switch (checkboxId) {
      case 5:
        setChecked5(true);
      case 4:
        setChecked4(true);
      case 3:
        setChecked3(true);
      case 2:
        setChecked2(true);
      case 1:
        setChecked1(true);
        break;
    }
  }

  useEffect(() => {
    const errors = [];
    if (review === "") errors.push("Please enter your review");
    if (stars === 0) errors.push("Please select your rating");
    setErrors(errors);
  }, [review, stars]);

  const handleSubmit = (e) => {
    e.preventDefault();
    return dispatch(reviewActions.addReviewThunk({ review, stars }, spotId))
      .then(() => {
        callbackClose();
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        const { message } = data;
        setErrors([message]);
      });
  };

  return (
    <div className="new-review-container">
      <h1 className="title">Write your review</h1>
      <form onSubmit={handleSubmit}>
        <ul className="error-container">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Review
          <textarea
            className="textarea"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <div className="margin-top-10">
          <div>Select rating</div>
          <div className="rating-container margin-top-10">
            <label className="star-container">
              <input type="checkbox" checked={checked1}
                onChange={() => handleStarChange(1)} />
              <span className="checkmark"></span>
            </label>
            <label className="star-container">
              <input type="checkbox" checked={checked2}
                onChange={() => handleStarChange(2)} />
              <span className="checkmark"></span>
            </label>
            <label className="star-container">
              <input type="checkbox" checked={checked3}
                onChange={() => handleStarChange(3)} />
              <span className="checkmark"></span>
            </label>
            <label className="star-container">
              <input type="checkbox" checked={checked4}
                onChange={() => handleStarChange(4)} />
              <span className="checkmark"></span>
            </label>
            <label className="star-container">
              <input type="checkbox" checked={checked5}
                onChange={() => handleStarChange(5)} />
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="rating-number-container">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary margin-top-10">Submit</button>
      </form >
    </div >
  );
}

export default ReviewFormModal;
