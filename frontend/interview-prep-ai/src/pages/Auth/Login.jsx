import React, { useContext } from "react"; // Added useContext import here
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { ValidateEmail } from "../../utils/helper";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_ROUTES } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!ValidateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Welcome Back</h3>
        <p className="text-gray-600 mt-2">
          Please enter your details to log in
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2 text-red-500 text-sm bg-red-50 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
        />

        <Input
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
        />

        <button type="submit" className="btn-primary">
          LOGIN
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setCurrentPage("signup")}
            className="text-orange-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
