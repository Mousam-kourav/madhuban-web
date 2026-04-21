const serverUrl = "https://madhuban-backend-s1l7.onrender.com";

export const getAllBlogs = async (pageCount, limit) => {
  let url = "";
  if (!pageCount && !limit) {
    url = `${serverUrl}/api/blogs/all/madhuban?type=blog&status=Published`;
  } else {
    url = `${serverUrl}/api/blogs/all/madhuban?type=blog&status=Published&page=${pageCount}&limit=${limit}`;
  }
  try {
    const res = await fetch(url, {
      cache: "force-cache",
    }).then((response) => response.json());

    return res;
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return null;
  }
};

export const getBlogById = async (id) => {
  try {
    const res = await fetch(`${serverUrl}/api/blogs/${id}/madhuban`, {
      cache: "force-cache",
    }).then((response) => response.json());
    return res;
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    return null;
  }
};
