import adminApi from "./adminApi";

/*
=========================================================
                GET ALL USERS
=========================================================
*/

export const getUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  verified = "",
  blocked = "",
  sort = "newest",
}) => {
  const params = {
    page,
    limit,
    search,
    role,
    verified,
    blocked,
    sort,
  };

  const res = await adminApi.get("/users", {
    params,
  });

  return res.data;
};

/*
=========================================================
                GET SINGLE USER
=========================================================
*/

export const getUser = async (id) => {
  const res = await adminApi.get(
    `/users/${id}`
  );

  return res.data;
};

/*
=========================================================
                UPDATE USER
=========================================================
*/

export const updateUser = async (
  id,
  data
) => {
  const res = await adminApi.put(
    `/users/${id}`,
    data
  );

  return res.data;
};

/*
=========================================================
                DELETE USER
=========================================================
*/

export const deleteUser = async (
  id
) => {
  const res = await adminApi.delete(
    `/users/${id}`
  );

  return res.data;
};

/*
=========================================================
                CHANGE ROLE
=========================================================
*/

export const changeRole = async (
  id,
  role
) => {
  const res = await adminApi.patch(
    `/users/${id}/role`,
    {
      role,
    }
  );

  return res.data;
};

/*
=========================================================
                BLOCK / UNBLOCK USER
=========================================================
*/

export const changeStatus =
  async (id) => {
    const res =
      await adminApi.patch(
        `/users/${id}/status`
      );

    return res.data;
  };

/*
=========================================================
                USER STATISTICS
=========================================================
*/

export const getUserStats =
  async () => {
    const res =
      await adminApi.get(
        "/users/stats"
      );

    return res.data;
  };