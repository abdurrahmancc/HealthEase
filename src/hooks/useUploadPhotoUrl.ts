import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const useUploadPhotoUrl = (
  setRefreshGetLoginUser: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUploadPhotoUrl = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;


    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    //  Check max size 500KB
    const maxSize = 500 * 1024; // 500KB in bytes
    if (file.size > maxSize) {
      toast.error("Image size must be less than 500KB");
      return;
    }

    setUploadLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/UpdatePhotoUrl`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success("Photo uploaded successfully");
      setRefreshGetLoginUser(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.error("Upload failed: Unknown error");
      }

    } finally {
      setUploadLoading(false);
    }
  };

  return { uploadLoading, handleUploadPhotoUrl };
};
