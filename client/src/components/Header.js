import PropTypes from "prop-types";
import Button from "./Button";
import { useState, useEffect } from "react";

const Header = ({ title, profileLink, onAdd, showAdd, buttonTitle }) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <header className="header w-full">
      <div className="container mx-auto max-w-6xl">
        <div className="text-xl font-bold text-purple-800 flex justify-between items-center py-4">
          <h1 className="text-center">{title}</h1>
          <div className="text-base font-normal text-purple-800 relative">
            <button
              className="align-end rounded-full focus:shadow-outline-purple focus:outline-none"
              aria-label="Account"
              aria-haspopup="true"
              onClick={toggleHamburger}
            >
              <img
                className="object-cover w-8 h-8 rounded-full"
                src=""
                alt=""
                aria-hidden="true"
              />
            </button>
            {hamburgerOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md p-4 space-y-2">
                <a
                  href="raceMates/linkStrava"
                  className="block text-purple-600 hover:text-purple-800 text-center"
                >
                  Link your Strava Account!
                </a>
                <a
                  href="/logout"
                  className="block text-purple-600 hover:text-purple-800 text-center"
                >
                  Logout
                </a>
                <Button
                  color={
                    showAdd
                      ? "bg-gray-300 text-purple-700 rounded-md"
                      : "bg-purple-300 text-gray-700 rounded-md "
                  }
                  text={<a href={profileLink}>{buttonTitle}</a>}
                  onClick={onAdd}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
