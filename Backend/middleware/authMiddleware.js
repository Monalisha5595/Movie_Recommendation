// This file contain all the auth related middleware
// importing all the required modules in the file
const express = require("express");
const jwt = require("jsonwebtoken");

const authController = (req, res, next) => {
  auth_token = req.headers.auth;
  if (req.url === "/create-movie") {
    is_admin = jwt.verify(auth_token, process.env.APPLICATION_SECRET_KEY).isAdmin;
    if (!is_admin) {
      return res.status(403).json({ message: "This Route Require Admin Access" });
    }
  }
  if (!auth_token) {
    return res.status(400).json({ message: "Please Provide Auth token" });
  }
  try {
    isVerified = jwt.verify(auth_token, process.env.APPLICATION_SECRET_KEY);
    req.user_details = isVerified;
    next();
  } catch (JsonWebTokenError) {
    return res.status(403).json({ message: "Invalid Auth token Provided" });
  }
};

module.exports = authController;
