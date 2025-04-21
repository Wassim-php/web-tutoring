import React, { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const TutorsListing = ({ topics }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  let description = topics.description;
  if (!showFullDescription) {
    description = description.substring(0, 90) + '...';
  }

  return (
    <div className="content-container">
      <h3>{topics.name}</h3>
      <p>{topics.category}</p>
      <p>
        {description}
        <button
          onClick={() => setShowFullDescription((prevState) => !prevState)}
          className="more-button"
        >
          {showFullDescription ? 'Less' : 'More'}
        </button>
      </p>
      <div className="read-more-container">
        <Link
          to={`/tutors/${topics.id}`}
          className="read-more-link"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default TutorsListing;