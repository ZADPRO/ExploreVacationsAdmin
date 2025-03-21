
import React, {  useState } from "react";
// import CryptoJS from "crypto-js";
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Slide } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// type DecryptResult = any;
interface activities {
  refActivitiesName: string;
}

const CarDetails: React.FC = () => {
  // const decrypt = (
  //   encryptedData: string,
  //   iv: string,
  //   key: string
  // ): DecryptResult => {
  //   const cipherParams = CryptoJS.lib.CipherParams.create({
  //     ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
  //   });

  //   const decrypted = CryptoJS.AES.decrypt(
  //     cipherParams,
  //     CryptoJS.enc.Hex.parse(key),
  //     {
  //       iv: CryptoJS.enc.Hex.parse(iv),
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7,
  //     }
  //   );

  //   return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  // };

  const submitLoading = false;
  const [inputs, setInputs]: any = useState({ refActivity: "" });
  const activities = useState<activities[]>([]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

//   const fetchActivities = async () => {
//     try {
//       const response = await axios.get(
//         import.meta.env.VITE_API_URL + "/settingRoutes/listActivities",
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = decrypt(
//         response.data[1],
//         response.data[0],
//         import.meta.env.VITE_ENCRYPTION_KEY
//       );
//       if (data.success) {
//         localStorage.setItem("token", "Bearer " + data.token);
//         console.log(data);

//         localStorage.setItem("activityData", data.token);
//         console.log("data - list api - line 62", data);
//         setActivities(data.result);
//       }
//     } catch (e: any) {
//       console.log("Error fetching activities:", e);
//     }
//   };
//   const Addactivities = async () => {
//     setSubmitLoading(true);

//     try {
//       const response = await axios.post(
//         import.meta.env.VITE_API_URL + "/settingRoutes/addActivities",
//         {
//           refActivity: inputs.refActivity,
//         },
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = decrypt(
//         response.data[1],
//         response.data[0],
//         import.meta.env.VITE_ENCRYPTION_KEY
//       );
//       console.log("data--------->87", data);
//       setSubmitLoading(false);

//       if (data.success) {
//         localStorage.setItem("token", "Bearer " + data.token);
//         console.log(data);
//         // localStorage.setItem("token", newToken);

//         toast.success("Successfully Added", {
//           position: "top-right",
//           autoClose: 2999,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Slide,
//         });

//         setInputs({ refCategory: "" });
//         fetchActivities();
//       }
//     } catch (e: any) {
//       console.log(e);
//       setSubmitLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, []);
  const snoTemplate = (_rowData: activities, options: { rowIndex: number }) => {
    return options.rowIndex + 1;
  };
  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-[#0a5c9c] mb-3">
          Add New Activities
        </h2>
        <div className="mb-3">
          <InputText
            name="refActivity"
            value={inputs.refActivity}
            onChange={handleInput}
            placeholder="Enter Activities"
            className="p-inputtext-sm w-full"
          />
        </div>
        <Button
          label={submitLoading ? "Adding..." : "Add Activities"}
          icon="pi pi-check"
          className="p-button-primary"
        //   onClick={}
          disabled={submitLoading}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Added Destinations</h3>
        <DataTable value={activities} className="p-datatable-sm mt-2">
          <Column
            body={snoTemplate}
            header="S.No"
            style={{ width: "10%", color: "#0a5c9c" }}
          />
          <Column
            field="refActivitiesName"
            style={{ color: "#0a5c9c" }}
            header="Activities Name"
          />
        </DataTable>
      </div>
    </>
  );
};

export default CarDetails;
