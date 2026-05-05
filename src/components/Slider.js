import { useEffect, useState } from 'react';
import image06 from '@/pages/images/image06.jpg';
import image10 from '@/pages/images/image10.webp';
import image11 from '@/pages/images/image11.jpg';
import image12 from '@/pages/images/image12.webp';

const slides = [image06.src, image10.src, image11.src, image12.src];

export default function Slider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="slider">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, slideIndex) => (
          <img key={src} src={src} alt={`Слайд ${slideIndex + 1}`} />
        ))}
      </div>
      <div className="slider-controls">
        <button className="icon-button" onClick={prev} aria-label="Назад">
          ‹
        </button>
        <button className="icon-button" onClick={next} aria-label="Вперёд">
          ›
        </button>
      </div>
    </div>
  );
}
