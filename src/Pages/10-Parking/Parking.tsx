import axios from "axios";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

import CryptoJS from "crypto-js";
import { addSpecialFeature } from "../../services/parkingService";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect, useRef } from "react";
import { TabPanel, TabView } from "primereact/tabview";
// import { Nullable } from "primereact/ts-helpers";
import AddForm from "../../component/05-CarServices/AddForm";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import Updateparking from "./Updateparking";
import { Calendar } from "primereact/calendar";
import { useTranslation } from "react-i18next";


interface Service {
  Feature: string;
  refServiceFeaturesId: number;
  refServiceFeatures: string;
}
// interface CarType {
//   refCarTypeId: number;
//   refCarTypeName: string;
// }

type DecryptResult = any;
const Parking: React.FC = () => {
  const { t } = useTranslation("global");
  const [visible, setVisible] = useState(false);
  const [parkingImg, setParkingImg] = useState<any>([]);
  // const [parkingupdatesidebar, setParkingupdatesidebar] = useState(false);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const [service, setService] = useState<Service[]>([]);
  const [editServiceValue, setEditServiceValue] = useState({
    refServiceFeaturesId: 0,
    refServiceFeatures: "",
  });
  const [_sidebarVisible, setSidebarVisible] = useState(false);

  const [editServiceId, setEditServiceId] = useState<number | null>(null);
  // const [selectedCarType, setSelectedCarType] = useState<CarType | null>(null);
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [selectedVechileType, setSelectedVechileType] = useState(null);
  const [vechileType, setVechileType] = useState<any[]>([]);
  const [carType, setCarType] = useState<any[]>([]);
  const [parking, setParking] = useState<any[]>([]);

  const [inputs, setInputs] = useState({
    refCarParkingTypeId: "",
    refParkingTypeId: "",
    refParkingName: "",
    refAssociatedAirport: "",
    refLocation: "",
    refAvailability: "",
    refOperatingHours: "",
    refBookingType: "",
    pricePerHourORday: "",
    refPrice: "",
    refWeeklyDiscount: "",
    refExtraCharges: "",
    MinimumBookingDuration: null as Date | null,
    MaximumBookingDuration: null as Date | null,
    isCancellationAllowed: null,
    isRescheduleAllowed: null,
    ServiceFeatures: "",
    instructions: "",
    description: "",
    parkingSlotImage: "",
    refStatus: null,
  });
  const [parkingupdatesidebar, setParkingupdatesidebar] = useState(false);
  const [parkingupdateID, setParkingupdateID] = useState("");
  const closeParkingupdatesidebar = () => {
    setParkingupdatesidebar(false);
  };

  const [_parkingDetails, setParkingDetails] = useState(null);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [selectService, setSelectService] = useState<any[]>([]);
  const [serviceOption, setServiceOption] = useState<Service[]>([]);
  const [_editParkingId, setEditParkingId] = useState<number | null>(null);
  function transformArrayToObject(array: string[], outerKey: string) {
    return {
      [outerKey]: array.map((val) => ({ Feature: val })),
    };
  }
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

  //   const handleInput1 = (e:any) => {
  //   const { name, value } = e.target || e.value ? e : { name: '', value: '' };
  //   setInputs((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  const fetchService = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/listServiceFeatures",
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
      console.log("data-------------->service", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setService(data.result);
        setServiceOption(data.result);
        console.log("Service------", data.result);
      }
    } catch (e: any) {
      console.log("Error fetching service:", e);
    }
  };
  useEffect(() => {
    fetchService();
    fetchCarType();
    fetchParking();
    fetchVechileType();
  }, []);

  const snoTemplate = (_rowData: Service, options: { rowIndex: number }) => {
    return options.rowIndex + 1;
  };
  // Update API Call
  const updateService = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL +
          "/carParkingRoutes/updateServiceFeatures",
        editServiceValue,
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
        setEditServiceId(null);
        fetchService(); // Refresh list
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating Service feature",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating include:", e);
      setSubmitLoading(false);
      setEditServiceId(null);
    }
  };
  const handleIncludeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditServiceValue((prevData) => ({
      ...prevData,
      refServiceFeatures: e.target.value,
    }));
  };
  const handleEditServiceClick = (rowData: any) => {
    setEditServiceId(rowData.refServiceFeaturesId);
    setEditServiceValue({ ...rowData });
  };

  const parkingImage = async (event: any) => {
    console.table("event", event);
    const file = event.files[0]; // Assuming single file upload
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    for (let pair of formData.entries()) {
      console.log("-------->______________", pair[0] + ":", pair[1]);
    }

    console.log("formData------------>", formData);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/uploadParkingImage",

        formData,

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("token", "Bearer " + data.token);
      console.log("data==============", data);

      if (data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "parking image uploaded successfully!",
          life: 3000,
        });
        console.log("data+", data);
        handleUploadSuccessMap(data);
      } else {
        console.log("data-", data);
        handleUploadFailure(data);
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };
  const handleUploadSuccessMap = (response: any) => {
    console.log("Upload Successful:", response);
    setParkingImg(response.filePath);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  const ServiceActionTemplateDelete = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editServiceId === rowData.refServiceFeaturesId ? (
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={updateService}
          />
        ) : (
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditServiceClick(rowData)}
          />
        )}

        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          onClick={() => {
            deleteService(rowData.refServiceFeaturesId);
            console.log("Deleting id:", rowData.refServiceFeaturesId);
          }}
        />
      </div>
    );
  };

  const deleteService = async (refServiceFeaturesId: number) => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL +
          "/carParkingRoutes/deleteServiceFeatures",
        { refServiceFeaturesId }, // Send only the required payload
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
        await fetchService();
      }
    } catch (e) {
      console.error("Error deleting service:", e);
      setSubmitLoading(false);
    }
  };
  const fetchCarType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/getCarType",
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
      console.log("data car details", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchCarType--------->", data);
        setCarType(data.Data);
        // setVechileType(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  //parking type

  const fetchVechileType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/getCarParkingType",
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
      console.log("data car details", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchVechileType--------->", data);
        setVechileType(data.vehicleType);
        console.log("fetchVechileType array--------->", data.vehicleType);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  //Add new Parking

  const AddParking = async () => {
    setSubmitLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/addCarParking",
        {
          // refParkingType: selectedCarType?.refCarTypeName,
          refCarParkingTypeId: selectedVechileType,
          refParkingTypeId: selectedCarType,
          refParkingName: inputs.refParkingName,
          refAssociatedAirport: inputs.refAssociatedAirport,
          refLocation: inputs.refLocation,
          refAvailability: inputs.refAvailability,
          refOperatingHours: inputs.refOperatingHours,
          refBookingType: inputs.refBookingType,
          pricePerHourORday: inputs.pricePerHourORday,
          refPrice: inputs.refPrice,
          refWeeklyDiscount: inputs.refWeeklyDiscount,
          refExtraCharges: inputs.refExtraCharges,
          MinimumBookingDuration: inputs.MinimumBookingDuration,
          MaximumBookingDuration: inputs.MaximumBookingDuration,
          isCancellationAllowed: inputs.isCancellationAllowed,
          isRescheduleAllowed: inputs.isRescheduleAllowed,
          // ServiceFeatures: inputs.ServiceFeatures,
          ServiceFeatures: selectService.map((exc: Service) =>
            exc.refServiceFeaturesId.toString()
          ),

          instructions: inputs.instructions,
          description: inputs.description,
          parkingSlotImage: parkingImg,
          refStatus: inputs.refStatus,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("token line 126======", token);

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      setSubmitLoading(false);
      console.log("data---------->Parking data", data);
      if (data.success) {
        setSidebarVisible(false);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully added",
          life: 3000,
        });
        localStorage.setItem("token", "Bearer " + data.token);
        fetchParking();
        fetchParking();

        // Reset form after submission
        setInputs({
          refCarParkingTypeId: "",
          refParkingTypeId: "",
          refParkingName: "",
          refAssociatedAirport: "",
          refLocation: "",
          refAvailability: "",
          refOperatingHours: "",
          refBookingType: "",
          pricePerHourORday: "",
          refPrice: "",
          refWeeklyDiscount: "",
          refExtraCharges: "",
          MinimumBookingDuration: null,
          MaximumBookingDuration: null,
          isCancellationAllowed: null,
          isRescheduleAllowed: null,
          ServiceFeatures: "",
          instructions: "",
          description: "",
          parkingSlotImage: "",
          refStatus: null,
        });
        setSelectedCarType(null);
        setSelectedVechileType(null);
        setParkingImg([]);
        setSelectService([]);
        setParkingupdatesidebar(false);
      }
    } catch (e) {
      console.log("Error adding staff:", e);
      setSubmitLoading(false);
    }
  };

  //get parking

  const fetchParking = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/listCarParking",
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
      console.log("get parking", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("parking data--------->", data);
        setParking(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching :", e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleInput2 = (e: any) => {
    const { name, value } = e.target
      ? e.target
      : { name: e.originalEvent.target.name, value: e.value };
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValue = (e: any) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (e: DropdownChangeEvent) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // delete parking

  const deleteParking = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/deleteCarParking",
        {
          refCarParkingId: id,
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
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchParking();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error updating package:", e);
      setSubmitLoading(false);
      setEditParkingId(null);
    }
  };

  const actionDeleteTour = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteParking(rowData.refCarParkingId)}
      />
    );
  };

  const fetchParkingId = async (refCarParkingId: string) => {
    console.log("packageID", refCarParkingId);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/carParkingRoutes/getCarParking`,
        { refCarParkingId: refCarParkingId },
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

      console.log("data---->staffdetails", data);

      if (data.success) {
        setParkingDetails(data.tourDetails);
        console.log("Package Details:", data.tourDetails);
      } else {
        setError("Failed to fetch package details.");
      }
    } catch (err) {
      setError("Error fetching package details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {t("dashboard.Parking Module")}
          </h2>
          <Button
            label={t("dashboard.Add New Parking")}
            severity="success"
            onClick={() => setVisible(true)}
          />
        </div>
        <div className="mt-3 p-2">
          <h3 className="text-lg font-bold">
            {t("dashboard.Added Parking Package")}
          </h3>
          <DataTable
            value={parking}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={3}
          >
            <Column
              header={t("dashboard.SNo")}
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              className="underline text-[#0a5c9c] cursor-pointer"
              headerStyle={{ width: "25rem" }}
              field="refParkingTypeName"
              header={t("dashboard.Parking Name")}
              body={(rowData) => (
                <div
                  onClick={() => {
                    setParkingupdateID(rowData.refCarParkingId);
                    setParkingupdatesidebar(true);
                    fetchParkingId(rowData.refCarParkingId);
                  }}
                >
                  {rowData.refParkingName}
                </div>
              )}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refParkingTypeName"
              header={t("dashboard.Parking Type")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refCarParkingTypeName"
              header={t("dashboard.Vehicle Type")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refServiceFeaturesList"
              header={t("dashboard.Service Features")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="MaximumBookingDuration"
              header={t("dashboard.Maximum Booking Duration")}
              body={(rowData) => rowData.MaximumBookingDuration?.slice(0, 10)}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="MinimumBookingDuration"
              header={t("dashboard.Minimum Booking Duration")}
               body={(rowData) => rowData.MinimumBookingDuration?.slice(0, 10)}
            />
            <Column
              headerStyle={{ minWidth: "15rem" }}
              field="pricePerHourORday"
              header={t("dashboard.Price Per Hour OR Day")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refAvailability"
              header={t("dashboard.Availability")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refBookingType"
              header={t("dashboard.Booking Type")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refExtraCharges"
              header={t("dashboard.Extra Charges")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refLocation"
              header={t("dashboard.Location")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refOperatingHours"
              header={t("dashboard.Operating Hours")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refWeeklyDiscount"
              header={t("dashboard.Weekly Discount")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="isCancellationAllowed"
              header={t("dashboard.Cancellation Allowed")}
              body={(a) => (a.isCancellationAllowed ? "Yes" : "No")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="isRescheduleAllowed"
              header={t("dashboard.Reschedule Allowed")}
              body={(a) => (a.isRescheduleAllowed ? "Yes" : "No")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refStatus"
              header={t("dashboard.Status")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refAssociatedAirport"
              header={t("dashboard.Associated Airport")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="description"
              header={t("dashboard.Description")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="instructions"
              header={t("dashboard.Instructions")}
            />
            <Column body={actionDeleteTour} header={t("dashboard.Delete")} />
          </DataTable>
        </div>

        <Sidebar
          visible={visible}
          style={{ width: "60%" }}
          onHide={() => setVisible(false)}
          position="right"
        >
          <Toast ref={toast} />
          <h2 className="text-xl font-bold mb-4">
            {t("dashboard.Add New Parking")}
          </h2>
          <p className="text-sm text-[#f60000] mt-3">
            {t("dashboard.warning")}
          </p>

          <TabView>
            <TabPanel header={t("dashboard.Service Features")}>
              <div className="flex flex-col items-center flex-start gap-10% w-[100%] ">
                {" "}
                <div className="bg-white shadow-md p-4 flex flex-col  w-[100%] rounded-lg">
                  <h4 className="font-semibold mb-3">
                    {t("dashboard.Add Service Features")}
                  </h4>

                  <AddForm
                    submitCallback={(values) => {
                      if (values.length < 1) return;

                      const payload = transformArrayToObject(
                        values,
                        "ServiceFeatures"
                      );

                      addSpecialFeature(payload, "specialfeature").then(
                        (result) => {
                          fetchService();
                          console.log("Saved:", result);
                        }
                      );
                    }}
                  />

                  <DataTable value={service} className="p-datatable-sm mt-2">
                    <Column
                      body={snoTemplate}
                      header={t("dashboard.SNo")}
                      style={{ width: "10%", color: "#0a5c9c" }}
                    />

                    <Column
                      field="refServiceFeatures"
                      header={t("dashboard.Service Features")}
                      body={(rowData) =>
                        editServiceId === rowData.refServiceFeaturesId ? (
                          <InputText
                            value={editServiceValue.refServiceFeatures}
                            onChange={handleIncludeInputChange}
                          />
                        ) : (
                          rowData.refServiceFeatures
                        )
                      }
                    />

                    <Column
                      body={ServiceActionTemplateDelete}
                      header={t("dashboard.Actions")}
                    />
                  </DataTable>
                </div>
              </div>
            </TabPanel>
            <TabPanel header={t("dashboard.Parking Package")}>
              <div className="flex flex-col items-center flex-start gap-10% w-[100%] ">
                {" "}
                <div className="bg-white shadow-md p-4 flex flex-col  w-[100%] rounded-lg">
                  <h4 className="font-semibold mb-3">
                    {t("dashboard.Add New Parking")}{" "}
                  </h4>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      AddParking();
                    }}
                    method="post"
                  >
                    <InputText
                      name="refParkingName"
                      value={inputs.refParkingName}
                      onChange={handleInput}
                      placeholder="Enter Parking Name"
                      className="w-full mt-4"
                    />

                    <div className="flex flex-row gap-3 mt-3">
                      <Dropdown
                        value={selectedCarType}
                        onChange={(e: DropdownChangeEvent) => {
                          setSelectedCarType(e.value);
                        }}
                        options={carType}
                        optionValue="refCarTypeId"
                        optionLabel="refCarTypeName"
                        placeholder="Choose Car Type"
                        className="w-full"
                        required
                      />

                      <Dropdown
                        value={selectedVechileType}
                        onChange={(e: DropdownChangeEvent) => {
                          setSelectedVechileType(e.value);
                        }}
                        options={vechileType}
                        optionValue="refCarParkingTypeId"
                        optionLabel="refCarParkingTypeName"
                        placeholder="Choose Vehicle Type"
                        className="w-full"
                        dataKey="refParkingTypeId"
                      />
                    </div>
                    <div className="flex flex-row gap-3 mt-3">
                      <InputText
                        name="refAssociatedAirport"
                        value={inputs.refAssociatedAirport}
                        onChange={handleInput}
                        placeholder="Nearby Associated Airport"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="flex flex-row gap-3 mt-3">
                      <InputText
                        name="refLocation"
                        value={inputs.refLocation}
                        onChange={handleInput}
                        placeholder="Enter Location"
                        className="w-full"
                        required
                      />
                      <InputText
                        name="refAvailability"
                        value={inputs.refAvailability}
                        onChange={handleInput}
                        placeholder="Enter Availability"
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-3 mt-3">
                      <InputText
                        name="refOperatingHours"
                        value={inputs.refOperatingHours}
                        onChange={handleInput}
                        placeholder="Enter Operating Hours"
                        className="w-full"
                        required
                      />

                      <Dropdown
                        name="refBookingType"
                        value={inputs.refBookingType}
                        options={[
                          { label: "Online", value: "Online" },
                          { label: "Offline", value: "Offline" },
                        ]}
                        onChange={handleInput2}
                        placeholder="Select Booking Type"
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-3 mt-3">
                      <Dropdown
                        name="pricePerHourORday"
                        value={inputs.pricePerHourORday}
                        options={[
                          { label: "Hour", value: "Hour" },
                          { label: "Day", value: "Day" },
                        ]}
                        onChange={handleInput2}
                        placeholder="price Per HourORday"
                        className="w-full"
                        required
                      />
                      <InputText
                        name="refPrice"
                        value={inputs.refPrice}
                        onChange={handleInput}
                        placeholder="Enter Price"
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-3 mt-3">
                      <InputText
                        name="refWeeklyDiscount"
                        value={inputs.refWeeklyDiscount}
                        onChange={handleInput}
                        placeholder="Enter Weekly Discount"
                        className="w-full"
                        required
                      />
                      <InputText
                        name="refExtraCharges"
                        value={inputs.refExtraCharges}
                        onChange={handleInput}
                        placeholder="Enter Extra Charges"
                        className="w-full"
                        required
                      />
                    </div>

                    {/* <div className="flex flex-row gap-3 mt-3">
                      
                      <Calendar
                        name="MinimumBookingDuration"
                        value={inputs.MinimumBookingDuration}
                        placeholder="Min Booking Duration"
                        onChange={handleValue}
                        minDate={new Date()} // disables past dates
                      />

                      <Calendar
                        name="MaximumBookingDuration"
                        value={inputs.MaximumBookingDuration}
                        placeholder="Max Booking Duration"
                        onChange={handleValue}
                        minDate={inputs.MinimumBookingDuration || new Date()} // ensures max date starts from min date
                      />
                    </div> */}
                    <div className="flex flex-row gap-3 mt-3">
                      <Calendar
                        name="MinimumBookingDuration"
                        value={inputs.MinimumBookingDuration}
                        placeholder="Min Booking Duration"
                        onChange={(e) => {
                          const selectedDate = e.value as Date | null;
                          setInputs((prev) => {
                            const maxDate =
                              prev.MaximumBookingDuration as Date | null;

                            const shouldResetMax =
                              maxDate &&
                              selectedDate &&
                              maxDate.getTime() < selectedDate.getTime();

                            return {
                              ...prev,
                              MinimumBookingDuration: selectedDate,
                              MaximumBookingDuration: shouldResetMax
                                ? null
                                : maxDate,
                            };
                          });
                        }}
                        minDate={new Date()} // disables past dates
                      />

                      <Calendar
                        name="MaximumBookingDuration"
                        value={inputs.MaximumBookingDuration}
                        placeholder="Max Booking Duration"
                        onChange={handleValue}
                        minDate={inputs.MinimumBookingDuration || new Date()}
                        disabled={!inputs.MinimumBookingDuration} // disables until Min is selected
                      />
                    </div>

                    <div className="flex flex-row gap-3 mt-3">
                      <Dropdown
                        name="isCancellationAllowed"
                        value={inputs.isCancellationAllowed}
                        options={[
                          { label: "Yes", value: true },
                          { label: "No", value: false },
                        ]}
                        onChange={handleDropdownChange}
                        className="w-[48%]"
                        placeholder="Cancellation"
                        showClear
                      />
                      <Dropdown
                        name="isRescheduleAllowed"
                        value={inputs.isRescheduleAllowed}
                        options={[
                          { label: "Yes", value: true },
                          { label: "No", value: false },
                        ]}
                        onChange={handleDropdownChange}
                        className="w-[48%]"
                        placeholder="Reschedule "
                        showClear
                      />
                    </div>
                    <div className="flex flex-row gap-3 mt-3">
                      <InputText
                        name="instructions"
                        value={inputs.instructions}
                        onChange={handleInput}
                        placeholder="Enter instructions"
                        className="w-full"
                        required
                      />
                      <InputText
                        name="description"
                        value={inputs.description}
                        onChange={handleInput}
                        placeholder="Enter description"
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-3 mt-3">
                      <MultiSelect
                        value={selectService}
                        onChange={(e) => {
                          setSelectService(e.value);
                          console.log("service-->", e.value);
                        }}
                        options={serviceOption}
                        optionLabel="refServiceFeatures"
                        display="chip"
                        placeholder="Select Service Features"
                        maxSelectedLabels={1}
                        className="w-full md:w-20rem"
                        required
                      />

                      <Dropdown
                        name="refStatus"
                        value={inputs.refStatus}
                        options={[
                          { label: "Yes", value: true },
                          { label: "No", value: false },
                        ]}
                        onChange={handleDropdownChange}
                        className="w-[48%]"
                        placeholder="Status "
                        showClear
                      />
                    </div>

                    {/* Parking Image upload */}

                    <div>
                      <h2 className="mt-3">
                        {t("dashboard.Upload Parking Image")}{" "}
                      </h2>
                      <FileUpload
                        name="logo"
                        customUpload
                        className="mt-3"
                        uploadHandler={parkingImage}
                        accept="image/*"
                        maxFileSize={10000000}
                        emptyTemplate={
                          <p className="m-0">{t("dashboard.imagewarning")}</p>
                        }
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button type="submit" label={t("dashboard.Submit")} />
                    </div>
                  </form>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </Sidebar>
        <Sidebar
          visible={parkingupdatesidebar}
          style={{ width: "50%" }}
          onHide={() => setParkingupdatesidebar(false)}
          position="right"
        >
          <Updateparking
            closeParkingupdatesidebar={closeParkingupdatesidebar}
            refCarParkingId={parkingupdateID}
          />
        </Sidebar>
      </div>
    </div>
  );
};

export default Parking;
