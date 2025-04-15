import React, { useState, useEffect } from 'react';
import faceImage from '../Assets/face.jpg';
import m02 from '../Assets/m02.jpg';
import tool from '../Assets/tool.jpg';

const slides = [
  {
    id: 1,
    image: faceImage,
    title: 'Your Trusted Industrial Partner',
    description:
      'A factory is an industrial site, usually consisting of buildings and machinery where workers manufacture goods.',
    buttonText: 'Our Projects',
    buttonLink: '#projects',
  },
  {
    id: 2,
    image: m02,
    title: 'Built on Quality. Driven by Innovation.',
    description:
      'Processing one product into another to ensure seamless operations and output.',
    buttonText: 'Get a Free Quote',
    buttonLink: '#quote',
  },
  {
    id: 3,
    image: tool,
    title: 'TRUSTED PARTNER',
    description:
      'We provide high-quality services with a focus on customer satisfaction.',
    buttonText: 'Learn More',
    buttonLink: '#learn',
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div
      className="relative w-full min-h-[550px] sm:min-h-[650px] flex items-center justify-center bg-center bg-cover duration-1000 transition-all"
      style={{
        backgroundImage: `url(${slide.image})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">{slide.title}</h1>
        <p className="text-base sm:text-lg mb-6">{slide.description}</p>
        <a
          href={slide.buttonLink}
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition duration-300"
        >
          {slide.buttonText}
        </a>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
