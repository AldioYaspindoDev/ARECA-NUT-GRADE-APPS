import { api } from "./api";

export interface UserUpdateData {
  username?: string;
  email?: string;
  password?: string;
}

export interface UserResponseData {
  id: string;
  email: string;
  username: string;
  photoProfile: string;
  role: string;
  created_at: string;
}

export const createPhotoProfile = async (imageUri: string): Promise<UserResponseData> => {
  const formData = new FormData();
  const uriParts = imageUri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  formData.append("gambar", {
    uri: imageUri,
    name: `photo_profile.${fileType}`,
    type: `image/${fileType === "png" ? "png" : "jpeg"}`,
  } as any);

  const response = await api.post("/api/user/upload-foto", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response as unknown as UserResponseData;
};

export const updateUser = async (
  userId: string,
  userData: UserUpdateData
): Promise<UserResponseData> => {
  const response = await api.put(`/api/user/${userId}`, userData);
  return response as unknown as UserResponseData;
};

export const updatedPhotoProfile = async (
  userId: string,
  imageUri: string
): Promise<UserResponseData> => {
  const formData = new FormData();
  const uriParts = imageUri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  formData.append("gambar", {
    uri: imageUri,
    name: `photo_profile.${fileType}`,
    type: `image/${fileType === "png" ? "png" : "jpeg"}`,
  } as any);

  const response = await api.put(`/api/user/${userId}/update-foto`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response as unknown as UserResponseData;
};

export const deletePhotoProfile = async (userId: string): Promise<UserResponseData> => {
  const response = await api.delete(`/api/user/${userId}/delete-foto`);
  return response as unknown as UserResponseData;
};

export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/user/${userId}`);
  return response as unknown as { message: string };
};
