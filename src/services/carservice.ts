import axios from "axios";
import { decryptAPIResponse } from "../utils";
type KeyType = "benefits" | "includes" | "excludes" | "form";

export async function addItemBaseOnKey(
  payload: Record<string, any>,
  key: KeyType = "benefits"
): Promise<any> {
  let endpoint = import.meta.env.VITE_API_URL;

  switch (key) {
    case "benefits":
      endpoint = import.meta.env.VITE_API_URL + "/carsRoutes/addBenifits";
      break;
    case "includes":
      endpoint = import.meta.env.VITE_API_URL + "/carsRoutes/addInclude";
      break;
    case "excludes":
      endpoint = import.meta.env.VITE_API_URL + "/carsRoutes/addExclude";
      break;
    case "form":
      endpoint = import.meta.env.VITE_API_URL + "/carsRoutes/addFormDetails";
      break;
  }

  const response = await axios.post(endpoint, payload, {
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });
  const data = decryptAPIResponse(
    response.data[1],
    response.data[0],
    import.meta.env.VITE_ENCRYPTION_KEY
  );
  console.log("data line 83", data);

  if (data.success) {
    localStorage.setItem("token", "Bearer " + data.token);
  }
  return data;
}
