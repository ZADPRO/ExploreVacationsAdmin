import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchDestinations } from "../../services/DestinationService";

type DecryptResult = any;

interface Destination {
  createdAt: string;
  createdBy: string;
  refDestinationId: number;
  refDestinationName: string;

}

const Destination: React.FC = () => {
  const decrypt = (
    encryptedData: string,
    iv: string,
    key: string
  ): DecryptResult => {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
    });

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  const [submitLoading, setSubmitLoading] = useState(false);
  const [inputs, setInputs] = useState({ refDestination: "" });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editDestinationId, setEditdestinationId] = useState<number | null>(null);
  const [editDestinationValue, setEditDestinationValue] = useState({
    refDestinationId: "",
    refDestinationName: "",
  });


  useEffect(() => {
    fetchDestinations().then(result => {
      setDestinations(result);
    })
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const addDestination = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/addDestination",
        { refDestination: inputs.refDestination },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data line 83", data);
      setSubmitLoading(false);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
       
        toast.success("Successfully Added", {
          position: "top-right",
          autoClose: 2999,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        fetchDestinations().then(result => {
          setDestinations(result);
        })
               
      }
    } catch (e: any) {
      console.log("Error adding destination:", e);
      setSubmitLoading(false);
    }
  };


//Update Destination

  // Handle Edit Button Click
  const handleEditIncludeClick = (rowData: any) => {
    setEditdestinationId(rowData.refDestinationId);
    setEditDestinationValue({ ...rowData });
  };

  // Handle Input Change
  const handleDestinationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditDestinationValue((prevData) => ({
      ...prevData,
      refDestinationId: e.target.value,
    }));
  };

  // Update API Call
  const UpdateDestination = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/UpdateDestination",
        editDestinationId,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setEditdestinationId(null);
        fetchDestinations().then(result => {
          setDestinations(result);
        })
      }
    } catch (e) {
      console.error("Error updating include:", e);
      setSubmitLoading(false);
      setEditdestinationId(null);
    }
  };




  //Delete Destination

const deleteDestination = async (refDestinationId: number) => {
 

  setSubmitLoading(true);

  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + "/settingRoutes/DeleteDestination",
      { refDestinationId }, // Send only the required payload
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
    );

    const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY);
    console.log('deleted-->', data)
    setSubmitLoading(false);
    if (data.success) {
     
      localStorage.setItem("token", "Bearer " + data.token);
      fetchDestinations().then(result => {
        setDestinations(result);
      })
    }
  } catch (e) {
    console.error("Error deleting include:", e);
    setSubmitLoading(false);
  }
};

// Action Buttons (Edit / Delete)
const DeleteActionTemplateDelete = (rowData: any) => {
  return (
    <div className="flex gap-2">
      {editDestinationId === rowData.refDestinationId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={UpdateDestination}
        />
      ) : (
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          onClick={() => handleEditIncludeClick(rowData)}
        />
      )}

      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteDestination(rowData.refDestinationId)}
      />
    </div>
  );
};


  const snoTemplate = (
    _rowData: Destination,
    options: { rowIndex: number }
  ) => {
    return options.rowIndex + 1;
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-[#0a5c9c] mb-3">
          Add New Destination
        </h2>
        <div className="mb-3 flex flex-row justify-between">
          <InputText
            name="refDestination"
            value={inputs.refDestination}
            onChange={handleInput}
            placeholder="Enter Destination"
            className="p-inputtext-sm w-[50%]"
          />
          <div>
            <Button
              label={submitLoading ? "Adding..." : "Add Destination"}
              icon="pi pi-check"
              className="p-button-primary"
              onClick={addDestination}
              disabled={submitLoading}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">Added Destinations</h3>
        <DataTable value={destinations} className="p-datatable-sm mt-2">
          <Column
            body={snoTemplate}
            header="S.No"
            style={{ width: "10%", color: "#0a5c9c" }}
          />
          <Column
            field="refDestinationName"
            style={{ color: "#0a5c9c" }}
            header="Destination Name"
            body={(rowData) =>
              editDestinationId === rowData.refDestinationId ? (
                <InputText
                  value={editDestinationValue.refDestinationName}
                  onChange={handleDestinationInputChange}
                />
              ) : (
                rowData.refDestinationName
              )
            }
          />

          <Column body={DeleteActionTemplateDelete} header="Actions" />
        </DataTable>
      </div>
    </>
  );
};

export default Destination;
