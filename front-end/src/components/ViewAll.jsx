import React from 'react'
import { Link } from 'react-router-dom';
const ViewAll = () => {
  return (
    <>
    <section bg="dark" variant="dark" expand="lg" fixed="bottom"  >
        <button className="block view-all-button border-black border-2   text-center py-3">
        <Link className='text-white'
        to="/tutors"
         >  View All</Link>
       
        </button>
    </section>
    </>
  )
}

export default ViewAll