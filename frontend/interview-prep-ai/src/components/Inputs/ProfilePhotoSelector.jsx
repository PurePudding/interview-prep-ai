import React, { useRef } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    fileInputRef.current.value = null;
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-slate-800 mb-1 block">
        Profile Photo
      </label>

      {preview && (
        <div className="mb-2 flex items-center space-x-3">
          <img
            src={preview}
            alt="Preview"
            className="w-14 h-14 rounded-full object-cover border"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-xs text-red-600 hover:underline flex items-center"
          >
            <FaTrash className="mr-1" /> Remove
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
        id="upload-button"
      />
      <label
        htmlFor="upload-button"
        className="inline-flex items-center bg-orange-500 text-white px-3 py-1.5 text-sm rounded cursor-pointer hover:bg-orange-600 transition"
      >
        <FaUpload className="mr-2" />
        Upload
      </label>
    </div>
  );
};

export default ProfilePhotoSelector;
