import { useEffect, useState } from 'react';

const slides = [
  'https://t3.ftcdn.net/jpg/15/23/80/42/360_F_1523804280_BUzzSXmimPEOpCrPDqipI1iUoJJxAkM4.jpg',
  'https://avatars.mds.yandex.net/i?id=fccfd0322f73e1f3da0f36f55c7a177d_l-4382387-images-thumbs&n=13g',
  'https://i.pinimg.com/originals/45/f2/9e/45f29e782e09bc9f2d0e1eb7361d7402.jpg',
  'https://i.pinimg.com/originals/fa/df/5b/fadf5b8e22d317fe6c9f58b2537e86a9.jpg'
];

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
