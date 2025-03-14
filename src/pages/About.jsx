import React, { useEffect, useState } from "react";
import { getData } from "../services/service";

const About = () => {
  const [restaurant, setRestaurant] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData();
        setRestaurant(response.restaurantDetails);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg--primary text-gray-800">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">DELIVERY</h1>
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Order Methods */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-green-500 mb-4">ORDER METHODS</h2>
              <div className="flex items-start mb-6">
                <i className="fas fa-laptop text-green-500 text-2xl mr-4"></i>
                <div>
                  <h3 className="text-lg font-bold">ON OUR WEBSITE</h3>
                  <p>Select the necessary dishes through the menu and order delivery</p>
                </div>
              </div>
              <div className="flex items-start mb-6">
                <i className="fas fa-phone-alt text-green-500 text-2xl mr-4"></i>
                <div>
                  <h3 className="text-lg font-bold">BY PHONE</h3>
                  <p>Call the number:<br /> {restaurant?.contact?.phone || " "}</p>
                </div>
              </div>
            </div>
            {/* Delivery Methods */}
            <div>
              <h2 className="text-xl font-bold text-green-500 mb-4">DELIVERY METHODS</h2>
              <div className="flex items-start mb-6">
                <i className="fas fa-truck text-green-500 text-2xl mr-4"></i>
                <div>
                  <h3 className="text-lg font-bold">DELIVERY</h3>
                  <p>We will deliver your order in less than 60 minutes or at the desigreen time</p>
                  <p>Working hours: {restaurant?.operatingHours?.mondayToFriday} </p>
                </div>
              </div>
              <div className="flex items-start mb-6">
                <i className="fas fa-store text-green-500 text-2xl mr-4"></i>
                <div>
                  <h3 className="text-lg font-bold">PICKUP</h3>
                  <p>We will tell you the time your order is ready, you will need to pick it up from the point.</p>
                  <p>Working hours:{restaurant?.operatingHours?.mondayToFriday}</p>
                  <p>Address:
                  <li>{restaurant?.address?.line1}</li>
                  <li>{restaurant?.address?.city}</li>
                  <li>{restaurant?.address?.state}</li>
                  <li>{restaurant?.address?.zipcode}</li>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Map Section */}
          <div className="lg:w-1/2 lg:pl-8">
            <h2 className="text-xl font-bold text-green-500 mb-4">WE ARE ON THE MAP</h2>
            <iframe
              className="w-full mb-8"
              height="400"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d904.4130984802746!2d73.824053!3d24.943909!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39680d005b02db7f%3A0xc9cc198672b0269d!2sSrinath%20dham!5e0!3m2!1sen!2sus!4v1734886482424!5m2!1sen!2sus"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              zoom="17"
            ></iframe>

            <iframe
            ></iframe>

            <div className="flex justify-between">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 text-2xl mr-2"></i>
                <p>Free <br /> delivery for orders over 500rs</p>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-green-500 text-2xl mr-2"></i>
                <p>45 minutes <br /> average delivery time to your door</p>
              </div>
              <div className="flex items-center">
                <i className="fas fa-money-bill-wave text-green-500 text-2xl mr-2"></i>
                <p>Order payment <br /> cash or card on the website/courier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
