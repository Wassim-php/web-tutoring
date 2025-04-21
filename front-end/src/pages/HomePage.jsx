
import '../App.css';
import ViewAll from '../components/ViewAll';
import TutorsListings from '../components/TutorsListings';
import HomeBox from '../components/HomeBox';

const HomePage = ({topics}) => {
  
  return (
    <>
    <div className="homepage-container">
      <HomeBox />
      <TutorsListings topics={topics} isHome={true} />
    </div>
    
    <div className='flex justify-center'>
    <ViewAll />
    </div>
    </>
  );
};

export default HomePage;