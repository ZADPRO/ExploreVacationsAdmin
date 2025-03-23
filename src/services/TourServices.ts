import axios from "axios";
import { decryptAPIResponse } from "../utils";
export async function addTour(payload: Record<string, any>): Promise<any> {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + "/packageRoutes/addPackage",
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
    console.log("data line------> 83", data);

    if (data.success) {
      localStorage.setItem("token", "Bearer " + data.token);
    }
  } catch (e: any) {
    console.log("Error adding destination:", e);
  }
}

export const fetchTours = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/packageRoutes/listPackage",
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
      console.log('data retuned ---->', data);
      return data.tourDetails;
    } else {
      return [];
    }
  } catch (e) {
    console.error("Error fetching destinations:", e);
    return [];
  }
};

export const editTours = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/packageRoutes/UpdatePackage",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
  
      //   const data = decryptAPIResponse(
      //     response.data[1],
      //     response.data[0],
      //     import.meta.env.VITE_ENCRYPTION_KEY
      //   );
      const data = response.data.text;
      if (data.success) {
        return data.result;
      } else {
        return [];
      }
    } catch (e) {
      console.error("Error fetching destinations:", e);
      return [];
    }
  };
  