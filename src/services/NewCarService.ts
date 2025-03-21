import axios from "axios";
import { decryptAPIResponse } from "../utils";
export async function addNewcarpackage(payload: Record<string, any>): Promise<any> {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + "/carsRoutes/addCars",
      payload,
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
    console.log("data line car details 21------------->>>>>>>>>", data);

    if (data.success) {
      localStorage.setItem("token", "Bearer " + data.token);
    }
  } catch (e: any) {
    console.log("Error adding car details:", e);
  }
}

