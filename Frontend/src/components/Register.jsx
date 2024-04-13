import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import Cookie from "js-cookie";

export function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [loginPage, setLoginPage] = useState(false);
  const storedData = JSON.parse(localStorage.getItem("CurrentUser"));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (values) => {
    if (!loginPage) {
      axios
        .post(`${BASE_URL}/register`, values)
        .then((res) => {
          const userData = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            id: res.data.user._id,
          };
          localStorage.setItem("CurrentUser", JSON.stringify(userData));
          Cookie.set("jwt", res.data.token, { expires: 1 });
          navigate("/userPage");
          toast({
            status: "success",
            description: res.data.message,
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            status: "error",
            description: err.response.data.error,
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      axios
        .post(
          `${BASE_URL}/login`,
          {
            email: values.email,
            password: values.password,
          }
        )
        .then((res) => {
          console.log(res.data)
          const userData = {
            email: values.email,
            id: res.data.user._id,
          };
          localStorage.setItem("CurrentUser", JSON.stringify(userData));
          Cookie.set("jwt", res.data.token, { expires: 1 });
          navigate("/userPage");
          toast({
            status: "success",
            description: res.data.message,
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err.response.data);
          toast({
            status: "error",
            description: err.response.data.error,
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {loginPage ? "Login" : "Signup"}
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="card p-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              {!loginPage && (
                <>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control mb-2"
                    placeholder="Enter First Name"
                    {...register("firstName", {
                      required: "Please enter your first name!",
                    })}
                  />
                  {errors.firstName && (
                    <div className="alert alert-danger">
                      {errors.firstName.message}
                    </div>
                  )}

                  <input
                    type="text"
                    name="lastName"
                    className="form-control mb-2"
                    placeholder="Enter Last Name"
                    {...register("lastName", {
                      required: "Please enter your Last name!",
                    })}
                  />
                  {errors.lastName && (
                    <div className="alert alert-danger">
                      {errors.lastName.message}
                    </div>
                  )}
                </>
              )}
            </div>

            <input
              type="text"
              name="email"
              className="form-control mb-2"
              placeholder="Enter Email"
              {...register("email", {
                required: "Please enter your Email!",
                pattern: {
                  value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <div className="alert alert-danger">{errors.email.message}</div>
            )}

            <input
              type="password"
              name="password"
              className="form-control mb-2"
              placeholder="Enter your Password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 4,
                  message: "password must be more than 4 characters",
                },
                maxLength: {
                  value: 20,
                  message: "password must be less than 20 characters",
                },
              })}
            />
            {errors.password && (
              <div className="alert alert-danger">
                {errors.password.message}
              </div>
            )}
            <button
              className="btn btn-success text-white"
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isHovered ? (loginPage ? "Login" : "Register") : "Hover me"}
            </button>
          </form>
          <p>
            {loginPage ? "Don't have an account" : "Already have an account"}{" "}
            <span onClick={() => setLoginPage(!loginPage)}>click here</span>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Register;
