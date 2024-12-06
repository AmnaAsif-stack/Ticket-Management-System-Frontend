import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Login-Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "customer", // Default role
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string().oneOf(["customer", "bus manager"], "Invalid role").required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:5000/api/signup", values);
        const { token, role } = response.data;

        // Save token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        alert("Signup Successful");
        navigate("/login");
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed");
      }
    },
  });

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Your Account</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && <p className="error">{formik.errors.name}</p>}
        </div>
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

        {/* Radio buttons for Role */}
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="role"
              value="customer"
              checked={formik.values.role === "customer"}
              onChange={formik.handleChange}
            />
            Customer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="bus manager"
              checked={formik.values.role === "bus manager"}
              onChange={formik.handleChange}
            />
            Bus Manager
          </label>
          {formik.errors.role && <p className="error">{formik.errors.role}</p>}
        </div>

        <button type="submit" className="btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
