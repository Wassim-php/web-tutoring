import React from 'react'
import '../App.css';
import TutorsListing from '../components/TutorsListing';
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom';
const TutorsListings = ({topics, isHome = false}) => {
    const slicedTutors = isHome ? topics.slice(0, 3) : topics;

  return (
    <>
    <div className="homepage-container">
        {!isHome ? 
        <div className="object-left ">
            <Link to="/"><FaArrowLeft  /> Back</Link>
        </div>    
            
 : ''}
        <div className= {isHome ?'content-grid' : 'all-content-grid'}>
      {/* Content Containers Section */}
      {slicedTutors.map((topics,index) => (
             <TutorsListing key={index} topics={topics} />
          ))}
          </div>
    </div>
    </>
  )
}

export default TutorsListings