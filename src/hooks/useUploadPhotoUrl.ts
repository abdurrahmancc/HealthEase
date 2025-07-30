import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const useUploadPhotoUrl = (
  setRefreshGetLoginUser: React.Dispatch<React.SetStateAction<boolean>>,
  userId: string | undefined
) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUploadPhotoUrl = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploadLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/v1/api/Files/PhotoUrl?userId=${userId}`,
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
