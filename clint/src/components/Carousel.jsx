// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import img1 from '../assets/carousel1.jpg';
import img2 from '../assets/carousel2.jpg';
import img3 from '../assets/carousel3.jpg';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Slide from './Slide';

export default function Carousel() {
  return (
    <div className="my-10 px-10 mx-auto">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Slide
            image={img1}
            text={'Get to Web Development Projects Done in minutes'}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            image={img2}
            text={'Get Your  Graphics Design Projects Done in minutes'}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            image={img3}
            text={'Get Your Graphics Projects Done in minutes'}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
