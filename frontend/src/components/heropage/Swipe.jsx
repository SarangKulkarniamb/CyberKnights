import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io";
import { motion } from "framer-motion";
import heroImage from "../../assets/heroimage.png";
const SwipeSection = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <div className="container py-12">
      <h2 className="text-2xl lg:text-3xl text-center font-semibold text-blue-950 mb-8">
        Explore Our Features
      </h2>

      <div className="flex items-center justify-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.8 }}
          className="hidden md:block"
        >
          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="text-5xl text-blue-950"
          >
            <IoMdArrowDropleftCircle />
          </button>
        </motion.div>

        {/* Slider */}
        <div className="w-full lg:w-3/4 shadow-md">
          <Slider ref={sliderRef} {...settings}>
            <div>
              <div className="flex flex-col md:flex-row justify-around gap-6 items-center text-center text-black p-8 rounded-xl">
                <div className="flex flex-col gap-4"> 
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-blue-950 font-semibold">QR Payments</h3>
                    <p className="mt-4 text-md md:text-lg lg:text-xl">Fast and secure transactions with QR codes.</p>
                </div>
                
                <img src={heroImage} className="w-48 h-48" alt="" />
              </div>
            </div>
           
            <div>
              <div className="flex flex-col md:flex-row justify-around items-center text-center text-black p-8 rounded-xl">
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-blue-950 font-semibold">Account Recharge</h3>
                    <p className="mt-4 text-md md:text-lg lg:text-xl">Easily top up your account anytime.</p>
                </div>
                
                <img src={heroImage} className="w-48 h-48" alt="" />
              </div>
            </div>
       
            <div>
              <div className="flex flex-col md:flex-row gap-6 justify-around items-center text-center text-black p-8 rounded-xl">
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-blue-950 font-semibold">Transaction History</h3>
                    <p className="mt-4 text-md md:text-lg lg:text-xl">View your past payments and logs.</p>
                </div>
                
                <img src={heroImage} className="w-48 h-48" alt="" />
              </div>
            </div>

          </Slider>
        </div>

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.8 }}
          className="hidden md:block"
        >
          <button
            onClick={() => sliderRef.current.slickNext()}
            className="text-5xl text-blue-950"
          >
            <IoMdArrowDroprightCircle />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SwipeSection;
