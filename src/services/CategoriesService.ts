import axios from "axios";
import { decryptAPIResponse } from "../utils";

export const fetchCategories = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/settingRoutes/listCategories",
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
        console.log("data - list api - line 53", data);
        return(data.result);
      }else {
        return [];
      }
    } catch (e: any) {
      console.log("Error fetching categories:", e);
      return [];
    }
  };