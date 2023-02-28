const BASE_URL = "http://localhost:3000/";

export const getUser = async () => {
  const response = await fetch(`${BASE_URL}api/users`);
  const json = await response.json();
  return json;
};

export async function addUser(formData) {
  try {
    const Options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };
    const response = await fetch(`${BASE_URL}api/users`,Options);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}
