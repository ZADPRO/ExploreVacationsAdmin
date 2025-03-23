import axios from "axios"
import { decryptAPIResponse } from "../utils";
type KeyType = "includes" | "excludes"

export async function addTourBaseOnKey(payload: Record<string, any>, key: KeyType = "includes"): Promise<any> {
  let endpoint = import.meta.env.VITE_API_URL

  switch (key) {
   
    case "includes":
      endpoint = import.meta.env.VITE_API_URL + "/packageRoutes/addTravalInclude"
      break;
    case "excludes":
      endpoint = import.meta.env.VITE_API_URL + "/packageRoutes/addTravalExclude"
      break;
   
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
  console.log("data line----------->i/e", data);

  if (data.success) {
    localStorage.setItem("token", "Bearer " + data.token);
  }
  return (data)
}
