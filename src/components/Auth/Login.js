
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Login-Signup.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "user", // Default role
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:5000/api/login", values);
        const { token, role } = response.data;  // Assuming the response also returns the role of the user
        localStorage.setItem("token", token);

        // Check if the role is admin before navigating to admin dashboard
        if (role === "customer") {
          alert("Login Successful");
          navigate("/Dashboard");
        } else {
          alert("Access denied. You need to be a customer to access this page.");
          // Redirect to a different page for non-admin roles (e.g., home or user dashboard)
          navigate("/");  // Adjust this as per your route
        }
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
      }
    },
  });

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && <p className="error">{formik.errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && <p className="error">{formik.errors.password}</p>}
        </div>
        
        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

