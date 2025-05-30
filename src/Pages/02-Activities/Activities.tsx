import React, { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Toast } from "primereact/toast";
import "react-toastify/dist/ReactToastify.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

type DecryptResult = any;
interface Activities {
  refActivitiesId: number;
  refActivitiesName: string;
}

const Activities: React.FC = () => {
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

  const toast = useRef<Toast>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [inputs, setInputs] = useState({ refActivity: "" });
  const [activities, setActivities] = useState<Activities[]>([]);
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/settingRoutes/listActivities",
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
      console.log("Fetched activities:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setActivities(data.result);
      }
    } catch (e: any) {
      console.error("Error fetching activities:", e);
    }
  };

  const addActivity = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/addActivities",
        { refActivity: inputs.refActivity },
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
      console.log("Add activity response:", data);

      setSubmitLoading(false);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setActivities([
          ...activities,
          {
            refActivitiesName: inputs.refActivity,
            refActivitiesId: data.insertedId,
          },
        ]);

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });

        setInputs({ refActivity: "" });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Activities",
          life: 3000,
        });
      }
    } catch (e: any) {
      console.error("Error adding activity:", e);
      setSubmitLoading(false);
    }
  };

  const handleEditActivityClick = (rowData: Activities) => {
    setEditActivityId(rowData.refActivitiesId); // Ensure correct ID is used
    setEditActivityValue(rowData.refActivitiesName);
  };

  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditActivityValue(e.target.value);
  };

  const updateActivity = async () => {
    if (!editActivityValue.trim()) {
      toast.current?.show({
        severity: "error",
        detail: "Activity name cannot be empty!",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/updateActivities",
        {
          refActivitiesId: editActivityId, // Ensure correct ID is sent
          refActivitiesName: editActivityValue, // Ensure correct field name
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
      console.log("Update activity response:", data);

      setSubmitLoading(false);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        // Update activity list without re-fetching
        setActivities(
          activities.map((activity) =>
            activity.refActivitiesId === editActivityId
              ? { ...activity, refActivitiesName: editActivityValue }
              : activity
          )
        );

        // Reset edit state
        setEditActivityId(null);
        setEditActivityValue("");
        fetchActivities();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Updated",
          life: 3000,
        });
      }
      else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating activity",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating activity:", e);
      setSubmitLoading(false);
      setEditActivityId(null);
    }
  };

  const deleteActivity = async (refActivitiesId: number) => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/deleteActivities",
        { refActivitiesId },
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
      console.log("Delete activity response:", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
         toast.current?.show({
          severity: "error",
          summary: "Deleted",
          detail: " deleted successfully",
          life: 3000,
        });
        setActivities(
          activities.filter(
            (activity) => activity.refActivitiesId !== refActivitiesId
          )
        );
      }
    } catch (e) {
      console.error("Error deleting activity:", e);
      setSubmitLoading(false);
    }
  };

  const actionTemplate = (rowData: Activities) => (
    <div className="flex gap-2">
      {editActivityId === rowData.refActivitiesId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={updateActivity}
        />
      ) : (
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          onClick={() => handleEditActivityClick(rowData)}
        />
      )}
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteActivity(rowData.refActivitiesId)}
      />
    </div>
  );

  const snoTemplate = (_rowData: Activities, options: { rowIndex: number }) =>
    options.rowIndex + 1;

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
       <Toast ref={toast} />
      <h2 className="font-bold mb-3">Add New Activities</h2>

      <p className="text-sm text-[#f60000] mt-3 mb-3">
          Please fill in the details below in English. *
        </p>

      <div className="flex flex-row gap-5">
        {" "}
        <InputText
          name="refActivity"
          value={inputs.refActivity}
          onChange={handleInput}
          placeholder="Enter Activity"
        />
        <Button
          label={submitLoading ? "Adding..." : "Add Activity"}
          onClick={addActivity}
          disabled={submitLoading}
        />
      </div>

      <DataTable value={activities} className="p-datatable-sm mt-2">
        <Column header="S.No" body={snoTemplate} style={{ width: "10%" }} />
        <Column
          field="refActivitiesName"
          header="Activity Name"
          body={(rowData) =>
            editActivityId === rowData.refActivitiesId ? (
              <InputText
                value={editActivityValue}
                onChange={handleActivityInputChange}
              />
            ) : (
              rowData.refActivitiesName
            )
          }
        />
        <Column body={actionTemplate} header="Actions" />
      </DataTable>
    </>
  );
};

export default Activities;
