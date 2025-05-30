import React, { useEffect, useState,useRef } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Toast } from "primereact/toast";
import "react-toastify/dist/ReactToastify.css";
// import { Slide } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";


interface Destination {
  refDestinationId: string;
  refDestinationName: string;
}

const Location: React.FC = () => {
  const { t } = useTranslation("global");
  type DecryptResult = any;

  const [submitLoading, setSubmitLoading] = useState(false);
  const [inputs, setInputs] = useState({
    refDestinationId: "",
    refDestination: "",
  });


  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [locations, setLocations] = useState<string[]>([""]);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [editLocationId, _setEditLocationId] = useState<number | null>(null);
  const [_editLocationValue, _setEditLocationValue] = useState({
    refLocationId: "",
    refLocationName: "",
    refDestinationId: "",
  });
    const toast = useRef<Toast>(null);
  

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

  const fetchLocations = async (destinationList: Destination[]) => {
    console.log("destinationList", destinationList);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/settingRoutes/listLocation",
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
      if (data.success) {
        console.log("data------------->94", data);

        const filteredLocations = data.result;

        const allLocations = destinationList.map((destination) => ({
          ...destination,
          locations: filteredLocations.filter(
            (location: any) =>
              location.refDestinationId === destination.refDestinationId
          ),
        }));

        setAllLocations(allLocations);
        console.log("allLocations---------------->85", allLocations);
      }
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
  };

  const fetchData = async () => {
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

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setDestinations(data.destinationList);
        console.log("data line 121 ============ ", data);
        fetchLocations(data.destinationList);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDropdownChange = (e: { value: Destination }) => {
    setSelectedDestination(e.value);
    setInputs((prev) => ({
      ...prev,
      refDestinationId: e.value.refDestinationId, // Ensure only the ID is stored
    }));
  };

  // const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputs((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const Addlocation = async () => {
    if (
      !inputs.refDestinationId ||
      locations.some((loc) => loc.trim() === "")
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Destination erroe",
        detail: "Please select a destination and enter valid locations",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const formattedLocations = locations.map((location) => ({
        refLocation: location.trim(),
      }));

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/addLocation",
        {
          refDestinationId: inputs.refDestinationId,
          locations: formattedLocations, // Send properly structured locations
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
      console.log("data line -----  134", data);

      setSubmitLoading(false);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setSelectedDestination(null);
        setLocations([""]); 
        setShowForm(false); 
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });
        fetchData();
        console.log("fetchData------------->", fetchData);
        
      }
      else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Location",
          life: 3000,
        });
      }
    } catch (e: any) {
      console.log("Error adding Location:", e);
      setSubmitLoading(false);
    }
  };

  const addLocationInput = () => {
    setLocations([...locations, ""]);
  };
  const handleLocationChange = (index: number, value: string) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = value;
    setLocations(updatedLocations);
  };
  const removeLocationInput = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
  };

  //update Location

  // Handle Edit Button Click
  // const handleEditIncludeClick = (rowData: any) => {
  //   setEditLocationId(rowData.refDestinationId);
  //   setEditLocationValue({ ...rowData });
  // };

  // Handle Input Change
  // const handleDestinationInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setEditLocationValue((prevData) => ({
  //     ...prevData,
  //     refDestinationId: e.target.value,
  //   }));
  // };

  // Update API Call
  // const UpdateDestination = async () => {
  //   setSubmitLoading(true);

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/settingRoutes/UpdateDestination",
  //       editLocationId,
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );

  //     setSubmitLoading(false);
  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);
  //       setEditLocationId(null);
  //       fetchData();
  //     }
  //   } catch (e) {
  //     console.error("Error updating include:", e);
  //     setSubmitLoading(false);
  //     setEditLocationId(null);
  //   }
  // };

  // const handleUpdate = (rowData: any) => {
  //   console.log("Updating:", rowData);
  //   // Add logic to open an edit modal or update state
  // };

  const deleteLocation = async (refDestinationId: any) => {
    setSubmitLoading(true);
    console.log("refDestinationId", refDestinationId);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/deleteLocation",
        { refDestinationId: refDestinationId },
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
      console.log("Delete location response:", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        toast.current?.show({
          severity: "error",
          summary: "Deleted",
          detail: "Location deleted successfully",
          life: 3000,
        });
        setAllLocations(
          allLocations.filter(
            (locations) => locations.refDestinationId !== refDestinationId
          )
        );

        // setAllLocations((prevLocations) =>
        //   prevLocations.filter(
        //     (location) => location.refLocationId !== refLocationId
        //   )
        // );
      }
    } catch (e) {
      console.error("Error deleting location:", e);
      setSubmitLoading(false);
    }
  };

  const actionTemplate = (rowData: any) => (
    <div className="flex gap-2">
      {editLocationId === rowData.refLocationId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          // onClick={updateLocation}
        />
      ) : (
        // <Button
        //   icon="pi pi-pencil"
        //   className="p-button-warning p-button-sm"
        //   onClick={() => handleEditLocationClick(rowData)}
        // />
        <></>
      )}
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteLocation(rowData.refDestinationId)}
      />
    </div>
  );

  // Delete Location

  // const deleteDestination = async (refDestinationId: number) => {

  //   setSubmitLoading(true);

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/settingRoutes/DeleteDestination",
  //       { refDestinationId }, // Send only the required payload
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY);
  //     console.log('deleted-->', data)
  //     setSubmitLoading(false);
  //     if (data.success) {

  //       localStorage.setItem("token", "Bearer " + data.token);
  //       fetchDestinations().then(result => {
  //         setDestinations(result);
  //       })
  //     }
  //   } catch (e) {
  //     console.error("Error deleting include:", e);
  //     setSubmitLoading(false);
  //   }
  // };

  // Action Buttons (Edit / Delete)
  // const DeleteActionTemplateDelete = (rowData: any) => {
  //   return (
  //     <div className="flex gap-2">
  //       {editDestinationId === rowData.refDestinationId ? (
  //         <Button
  //           label="Update"
  //           icon="pi pi-check"
  //           className="p-button-success p-button-sm"
  //           onClick={UpdateDestination}
  //         />
  //       ) : (
  //         <Button
  //           icon="pi pi-pencil"
  //           className="p-button-warning p-button-sm"
  //           onClick={() => handleEditIncludeClick(rowData)}
  //         />
  //       )}

  //       <Button
  //         icon="pi pi-trash"
  //         className="p-button-danger p-button-sm"
  //         onClick={() => deleteDestination(rowData.refDestinationId)}
  //       />
  //     </div>
  //   );
  // };

  return (
    <div>
       <Toast ref={toast} />
      <h2 className="text-xl font-bold text-[#0a5c9c]">{t("dashboard.Add New Location")}</h2>

      <p className="text-sm text-[#f60000] mt-3 mb-3">
        {t("dashboard.warning")}
        </p>
      <div
        style={{
          marginTop: "3%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          marginBottom: "2%",
        }}
      >
        <Button
          label={t("dashboard.Add New Location")}
          severity="success"
          onClick={() => setShowForm(true)}
        />
      </div>

      {showForm && (
        <div className="flex flex-col gap-4 mt-4 w-[50%] mb-5">
          {/* Destination Dropdown */}
          <label className="font-medium text-gray-700">
            Select Destination
          </label>
          <Dropdown
            value={selectedDestination}
            onChange={handleDropdownChange}
            options={destinations}
            optionLabel="refDestinationName"
            placeholder="Choose a Destination"
            className="w-full md:w-3/4 border border-gray-300 rounded-md"
          />

          {/* Location Input Fields */}
          <label className="font-medium text-gray-700">Enter Locations</label>
          <div className="flex flex-col gap-2">
            {locations.map((location, index) => (
              <div key={index} className="flex items-center gap-2">
                <InputText
                  value={location}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                  placeholder="Enter Location"
                  className="p-inputtext-sm w-full md:w-2/3 border border-gray-300 rounded-md"
                />
                <Button
                  icon="pi pi-plus"
                  className="p-button-success p-button-sm"
                  onClick={addLocationInput}
                  tooltip="Add another location"
                />
                {locations.length > 1 && (
                  <Button
                    icon="pi pi-times"
                    className="p-button-danger p-button-sm"
                    onClick={() => removeLocationInput(index)}
                    tooltip="Remove this location"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            label={submitLoading ? "Adding..." : "Add Location"}
            icon="pi pi-check"
            className="p-button-primary mt-4 w-full md:w-1/3"
            onClick={Addlocation}
            disabled={submitLoading}
          />
        </div>
      )}

      <DataTable value={allLocations} tableStyle={{ minWidth: "50rem" }}>
  <Column
    header={t("dashboard.SNo")}
    headerStyle={{ width: "3rem" }}
    body={(_data, options) => options.rowIndex + 1}
  />

  <Column
    field="refDestinationName"
    header={t("dashboard.Destination")}
    style={{ minWidth: "5rem" }}
  />

  <Column
    header={t("dashboard.Locations")}
    body={(rowData) => (
      <ul>
        {rowData.locations &&
          rowData.locations.map(
            (loc: Record<string, any>, index: number) => (
              <li key={index}>{loc.refLocationName}</li>
            )
          )}
      </ul>
    )}
    style={{ minWidth: "5rem" }}
  />

  <Column
    header={t("dashboard.Actions")}
    body={actionTemplate}
    style={{ minWidth: "150px", textAlign: "center" }}
  />
</DataTable>

    </div>
  );
};

export default Location;
