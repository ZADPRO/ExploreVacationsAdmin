import axios from "axios"
import { decryptAPIResponse } from "../utils";
type KeyType = "specialfeature"

export async function addSpecialFeature(payload: Record<string, any>, key: KeyType = "specialfeature"): Promise<any> {
  let endpoint = import.meta.env.VITE_API_URL

  switch (key) {
   
    case "specialfeature":
      endpoint = import.meta.env.VITE_API_URL + "/carParkingRoutes/addServiceFeatures"
     
  }
  

  const response = await axios.post(
    
    endpoint,
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
  console.log("Add Special Feature------->", data);

  if (data.success) {
    localStorage.setItem("token", "Bearer " + data.token);
  }
  return (data)
}



