// ⭐⭐⭐ COPY THIS ENTIRE CODE TO: src/pages/Signup.jsx ⭐⭐⭐

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/firebase/config";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Regular Email/Password Signup
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        navigate("/verify");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Google Signup Handler
  const handleGoogleSignup = async () => {
    try {
      setSocialLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google User:", user);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/social-login",
        {
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          photoURL: user.photoURL,
          provider: "google",
          uid: user.uid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success("Signed up with Google successfully!");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Signup cancelled");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Please allow popups for this site");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered. Please login.");
      } else {
        toast.error(error.response?.data?.message || "Google signup failed");
      }
    } finally {
      setSocialLoading(false);
    }
  };

  // GitHub Signup Handler
  const handleGithubSignup = async () => {
    try {
      setSocialLoading(true);
      
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      console.log("GitHub User:", user);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/social-login",
        {
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "GitHub",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "User",
          photoURL: user.photoURL,
          provider: "github",
          uid: user.uid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success("Signed up with GitHub successfully!");
      }
    } catch (error) {
      console.error("GitHub signup error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Signup cancelled");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Please allow popups for this site");
      } else if (error.code === "auth/account-exists-with-different-credential") {
        toast.error("Account already exists with different login method");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered. Please login.");
      } else {
        toast.error(error.response?.data?.message || "GitHub signup failed");
      }
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Social Signup Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignup}
              disabled={socialLoading || loading}
              className="w-full"
            >
              {socialLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FaGoogle className="h-4 w-4 mr-2 text-red-500" />
              )}
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGithubSignup}
              disabled={socialLoading || loading}
              className="w-full"
            >
              {socialLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FaGithub className="h-4 w-4 mr-2" />
              )}
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="cursor-pointer w-full mt-6 bg-pink-600 hover:bg-pink-500"
              disabled={loading || socialLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Please Wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <p className="text-gray-700 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="hover:underline cursor-pointer text-pink-800 font-semibold"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;