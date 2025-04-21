import React from 'react'
import TutorsListings from '../components/TutorsListings'

const TutorsPage = ({topics}) => {

  return (
    <>
    <TutorsListings topics={topics} />
    </>
  )
}

export default TutorsPage