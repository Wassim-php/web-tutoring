import React, { useState } from 'react';
import '../App.css';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const HomeBox = () => {
    // Track current slide position
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Array of available tutoring subjects
    const slides = ['Math Tutoring', 'Science Help', 'Coding Lessons', 'Language Arts'];

    /**
     * Advances to the next slide, loops to first slide if at end
     */
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    /**
     * Returns to the previous slide, loops to last slide if at start
     */
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <div className="carousel-container">
            <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="carousel-slide">
                        <h2>{slide}</h2>
                        <p>Click to learn more about our {slide.toLowerCase()}</p>
                    </div>
                ))}
            </div>
            
            <button className="carousel-btn left" onClick={prevSlide}>
                <FaArrowLeft className='text-white'/>
            </button>
            <button className="carousel-btn right" onClick={nextSlide}>
                <FaArrowRight className='text-white'/>
            </button>
        </div>
    );
};

export default HomeBox;