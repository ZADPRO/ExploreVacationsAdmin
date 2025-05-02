import React, { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// import { Slide } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchDestinations } from "../../services/DestinationService";
import { Toast } from "primereact/toast";
type DecryptResult = any;

interface Destination {
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
  const [editDestinationId, setEditdestinationId] = useState<number | null>(
    null
  );
  const [editDestinationValue, setEditDestinationValue] = useState("");
  const toast = useRef<Toast>(null);
  useEffect(() => {
    fetchDestinations().then((result) => {
      setDestinations(result);
    });
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const addDestination = async () => {
    setSubmitLoading(true);
    if (!inputs.refDestination.trim()) {
      return; // Optionally show a toast or alert here
    }

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

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });

        fetchDestinations().then((result) => {
          setDestinations(result);
        });
        setInputs((prevInputs) => ({
          ...prevInputs,
          refDestination: "",
        }));
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Destination",
          life: 3000,
        });
      }
    } catch (e: any) {
      console.log("Error adding destination:", e);
      setSubmitLoading(false);

      const errorMessage = e?.response?.data?.error;

      if (e?.response?.data?.token) {
        localStorage.setItem("token", "Bearer " + e.response.data.token);
      }

      if (errorMessage?.toLowerCase().includes("duplicate")) {
        toast.current?.show({
          severity: "error",
          summary: "Duplicate Entry",
          detail: "This destination already exists. Please enter a new one.",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong. Please try again.",
          life: 3000,
        });
      }
    }
  };

  //Update Destination

  // Handle Edit Button Click
  const handleEditIncludeClick = (rowData: Destination) => {
    setEditdestinationId(rowData.refDestinationId);
    setEditDestinationValue(rowData.refDestinationName);
  };

  // Handle Input Change

  const handleDestinationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditDestinationValue(e.target.value);
  };

  // Update API Call
  const UpdateDestination = async () => {
    if (!editDestinationId || !editDestinationValue.trim()) return;

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/UpdateDestination",
        {
          refDestinationId: editDestinationId,
          refDestinationName: editDestinationValue, // Send updated name
        },
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
        setEditDestinationValue("");

        // Fetch updated destinations
        fetchDestinations().then(setDestinations);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating Destination",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating destination:", e);
      setSubmitLoading(false);
      setEditdestinationId(null);
    }
  };

  //Delete Destination

  const deleteDestination = async (refDestinationId: any) => {
    console.log("refDestinationId", refDestinationId);
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/DeleteDestination",
        { refDestinationId: refDestinationId.refDestinationId }, // Send only the required payload
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
      console.log("deleted-->", data);
      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchDestinations().then((result) => {
          setDestinations(result);
        });
        setDestinations(
          destinations.filter(
            (activity) => activity.refDestinationId !== refDestinationId
          )
        );
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
          onClick={() => deleteDestination(rowData)}
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
      <Toast ref={toast} />

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
              disabled={submitLoading || !inputs.refDestination.trim()}
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
                  value={editDestinationValue}
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
