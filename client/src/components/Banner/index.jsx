import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Banner1 from "../../assets/image/banner1.jpg"
import Banner2 from "../../assets/image/banner2.webp"
import Banner3 from "../../assets/image/banner3.jpg"

const slideImages = [
  {
    url: Banner1,
  },
  {
    url: Banner2,
  },
  {
    url: Banner3,
  },
];

const Slideshow = () => {
  return (
    <div className="slide-container relative">
      <Slide
        indicators={true}
        arrows={false}
        infinite={true}
        autoplay={true}
      >
        {slideImages.map((slideImage, index) => (
          <div key={index} className="relative">
            <img
              src={slideImage.url}
              alt={`Banner ${index + 1}`}
              className="w-full h-96 object-cover"
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default Slideshow;
