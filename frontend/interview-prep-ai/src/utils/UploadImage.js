import { API_ROUTES } from "./apiPaths";
import { axiosInstance } from "./axiosInstance";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axiosInstance.post(
      API_ROUTES.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Add this
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error; // Re-throw for handling in SignUp
  }
};

export default uploadImage;
