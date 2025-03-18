import React from "react";
import { useLocation } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Profile = () => {
  const location = useLocation();

  return (
    <div className="bg--primary p-6">
      <AuthForm />
    </div>
  );
};
export default Profile;