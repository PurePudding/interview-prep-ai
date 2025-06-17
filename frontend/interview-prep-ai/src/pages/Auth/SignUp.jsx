import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { ValidateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_ROUTES } from "../../utils/apiPaths";
import uploadImage from "../../utils/UploadImage";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [fullname, setFullname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    // Validation
    if (!fullname.trim()) {
      setError("Full name is required");
      setIsLoading(false);
      return;
    }

    if (!ValidateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
        profileImageUrl,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800">Create an Account</h3>
      <p className="text-gray-600 mt-2 mb-6">
        Join us today by entering your details below
      </p>

      {error && (
        <div className="mb-4 p-2 text-red-500 text-sm bg-red-50 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <ProfilePhotoSelector
          image={profilePic}
          setImage={setProfilePic}
          preview={preview}
          setPreview={setPreview}
        />

        <div className="space-y-4">
          <Input
            value={fullname}
            onChange={({ target: { value } }) => setFullname(value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
            required
          />
          <Input
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            required
          />
          <Input
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary mt-4 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "SIGN UP"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setCurrentPage("login")}
            className="text-orange-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
