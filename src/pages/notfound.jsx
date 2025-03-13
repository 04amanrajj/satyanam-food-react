import React from "react";

const NotFound = () => {
    return (
        <div className="bg-green-500 flex items-center justify-center min-h-screen">
            <img
                alt="Person with legs sticking out of a box"
                className="mr-20"
                height="300"
                src="https://media.momentumiot.com/buyflow/empty-cart.svg"
                width="300"
            />
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="text-white text-9xl mb-20 font-bold">404</div>
                    </div>
                </div>
                <div className="mt-4 text-white text-2xl font-semibold">
                    Something's missing
                </div>
                <div className="mt-2 text-white text-lg">
                    This page is missing or you assembled the link incorrectly.
                </div>
                <div className="mt-4">
                    <a className="text-black flex items-center justify-center" href="/">
                        <i className="fas fa-arrow-left mr-2"></i>
                        Go back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
