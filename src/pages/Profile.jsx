import React from "react";
import { useLocation } from "react-router-dom";
import CreateAccount from "../components/auth/CreateAccount";
import LoginForm from "../components/auth/LoginForm";

const Profile = () => {
  const location = useLocation();

  return (
    <div className="bg--primary p-6">
      {location.pathname === "/login" ? <LoginForm /> : <CreateAccount />}
    </div>
  );
};

export default Profile;