import axios from "axios";
import { decryptAPIResponse } from "../utils";

export const fetchDestinations = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/settingRoutes/listDestination",
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
    );

    const data = decryptAPIResponse(
      response.data[1],
      response.data[0],
      import.meta.env.VITE_ENCRYPTION_KEY
    );
    if (data.success) {
      localStorage.setItem("token", "Bearer " + data.token);
      return data.destinationList;
    } else {
      return [];
    }
  } catch (e) {
    console.error("Error fetching destinations:", e);
    return [];
  }
};
