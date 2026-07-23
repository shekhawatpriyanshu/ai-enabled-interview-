import API from "../api/axios";

export const getProfile = async () => {
  const res = await API.get("/users/profile");
  return res.data;
};

export const createProfile = async (
  profileData
) => {
  const res = await API.post(
    "/users/profile",
    profileData,
    {
      headers:{
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};

export const updateProfile = async (
  profileData
) => {
  const res = await API.put(
    "/users/profile",
    profileData,
    {
      headers:{
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};

export const deleteProfile = async () => {
  const res = await API.delete(
    "/users/profile"
  );

  return res.data;
};