import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import CryptoJS from "crypto-js";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";

import "./Staff.css";
import { FileUpload } from "primereact/fileupload";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import UpdateStaff from "../09-UpdateStaff/UpdateStaff";
import { TabPanel, TabView } from "primereact/tabview";
import { Nullable } from "primereact/ts-helpers";
// import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useTranslation } from "react-i18next";

interface StaffDetails {
  refFName: string;
  refLName: string;
  refDOB: string;
  refDesignation: string;
  refQualification: string;
  refProfileImage: string;
  refMoblile: string;
  refUserTypeId: number;
  refUserEmail: string;
}

// interface Employee {
//   refUserTypeId: number;
//   refUserType: string;
// }

type DecryptResult = any;
const Staff: React.FC = () => {
  const { t } = useTranslation("global");
  const [visible, setVisible] = useState(false);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const isFormSubmitting = false;
  const [profileImage, setProfileImage] = useState("");

  const [staff, setStaff] = useState<StaffDetails[]>([]);
  const [staffhistory, setStaffhistory] = useState<StaffDetails[]>([]);
  const [_editStaffId, setEditStaffId] = useState<number | null>(null);
  const [staffupdatesidebar, setStaffupdatesidebar] = useState(false);
  const [staffupdateID, setStaffupdateID] = useState("");
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [_staffDetails, setStaffDetails] = useState(null);
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [selectedHistory, setSelectedHistory] = useState<any[]>([]);
  const [historyOptions, setHistoryOptions] = useState<any[]>([]);

  const [selectedEmployeeType, setSelectedEmployeeType] = useState<any[]>([]);
  const [employeeType, setEmployeeType] = useState<any[]>([]);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);
  const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);
  const closeStaffupdatesidebar = () => {
    setStaffupdatesidebar(false);
  };
  // const [senddata, setSenddata] = useState({
  //   TransactionType: "",
  //   updatedAt: "",
  // });
  const toast = useRef<Toast>(null);
  const [inputs, setInputs] = useState({
    refFName: "",
    refLName: "",
    refDOB: null as Date | null,
    refDesignation: "",
    refQualification: "",
    refProfileImage: "",
    refMoblile: "",
    refUserTypeId: [],
    refUserEmail: "",
  });

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

  const Addnewstaff = async () => {
    setSubmitLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/addEmployee",
        {
          refFName: inputs.refFName,
          refLName: inputs.refLName,
          refDOB: inputs.refDOB
            ? inputs.refDOB.toISOString().split("T")[0]
            : "",
          refDesignation: inputs.refDesignation,
          refQualification: inputs.refQualification,
          refProfileImage: profileImage,
          refMoblile: inputs.refMoblile,
          refUserTypeId: selectedEmployeeType.map(
            (item) => item.refUserTypeId + ""
          ),
          refUserEmail: inputs.refUserEmail,
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
      console.log("data---------->employeedta", data);
      if (data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });

        localStorage.setItem("token", "Bearer " + data.token);
        fetchStaff();
        setVisible(false); // if you're using this to show the form sidebar
        setStaffupdatesidebar(false); // if using this instead
        setInputs({
          refFName: "",
          refLName: "",
          refDOB: null,
          refDesignation: "",
          refQualification: "",
          refProfileImage: "",
          refMoblile: "",
          refUserTypeId: [],
          refUserEmail: "",
        });

        setSelectedEmployeeType([]);
        setDate(null);
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Staff",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding staff:", e);
      setSubmitLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listEmployees",
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
      console.log("data ---------->list staff", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data - list api - line 53", data);
        setStaff(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  const deleteStaff = async (id: any) => {
    console.log(id);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/deleteEmployee",
        {
          refuserId: id,
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
        fetchStaff();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Deleted",
          life: 3000,
        });
      } else {
        console.error("API update failed:", data);
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Deleting Staff",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating package:", e);
      setSubmitLoading(false);
      setEditStaffId(null);
      setVisibleDialog(false);
      setSelectedBannerId(null);
    }
  };

  const actionDeleteTour = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        // onClick={() => deleteStaff(rowData.refuserId)}
        onClick={() => {
          setSelectedBannerId(rowData.refuserId);
          setVisibleDialog(true);
        }}
      />
    );
  };

  //delete audit
    const deleteAudit = async (id: any) => {
      console.log("id------->",id);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/deleteAudit",
        {
          transId : id,
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
          toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Deleted",
          life: 3000,
        });
      } else {
        console.error("API update failed:", data);
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Deleting Staff",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating package:", e);
      setSubmitLoading(false);
      setEditStaffId(null);
      setVisibleDialog(false);
      setSelectedAuditId(null);
    }
  };

  const actionDeleteAudit = (rowData: any) => {
    console.log("refuserId----",rowData.transId);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        // onClick={() => deleteStaff(rowData.refuserId)}
        onClick={() => {
          console.log("rowData.refuserId", rowData.transId)
          setSelectedAuditId(rowData.transId);
          setVisibleDialog(true);
        }}
      />
    );
  };

  const fetchStaffDetails = async (StaffId: string) => {
    console.log("packageID", StaffId);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adminRoutes/getEmployee`,
        { refuserId: StaffId },
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
        setStaffDetails(data.tourDetails);
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

  useEffect(() => {
    fetchStaff();
    fetchhistory();
    fetchEmployeeType();
    fetchFilteredAudit();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleCalendarChange = (e: any) => {
    setInputs((prev) => ({
      ...prev,
      refDOB: e.value,
    }));
  };

  const profile = async (event: any) => {
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
        import.meta.env.VITE_API_URL + "/adminRoutes/uploadEmployeeImage",

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
        console.log("data+", data);
        handleUploadSuccessMap(data);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });
      } else {
        console.log("data-", data);
        handleUploadFailure(data);
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Profile",
          life: 3000,
        });
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };
  const handleUploadSuccessMap = (response: any) => {
    console.log("Upload Successful:", response);
    setProfileImage(response.filePath);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);

    // Add your failure handling logic here
  };

  // Employee type

  const fetchEmployeeType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listUserType",
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
      console.log("data employee details------------>", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchEmployeeType  --------->", data);
        setEmployeeType(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching employees:", e);
    }
  };

  //History

  const fetchhistory = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listTransactionType",
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
      console.log("data ---------->list History", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        const formatted = data.result.map((item: any) => ({
          label: item.refTransactionHistory,
          value: item.refTransactionHistoryId,
        }));

        setHistoryOptions(formatted); // Set this to historyOptions state
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  //send transction

  // const fetchFilteredAudit = async () => {
  //   console.log("fetchFilteredAudit");
  //   if (!date || selectedHistory.length === 0) {
  //     console.warn("Please select both date and transaction types.");
  //     return;
  //   }

  //   const formattedDate = date
  //     ? new Intl.DateTimeFormat("en-GB").format(date) // dd/mm/yyyy
  //     : "";

  //   const payload = {
  //     TransactionType: selectedHistory?.map((item) =>
  //       typeof item === "object" ? item.value : item
  //     ),
  //     updatedAt: formattedDate,
  //   };

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/adminRoutes/listAuditPage",
  //       payload,
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
  //     console.log("Audit Data:----", data);
  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);
  //       console.log("Filtered Audit Data:", data.result);
  //       setStaffhistory(data.result); // Assuming this is your audit table state
  //     }
  //   } catch (err) {
  //     console.error("Error fetching filtered audit data:", err);
  //   }
  // };
  const fetchFilteredAudit = async () => {
    console.log("fetchFilteredAudit");

    let payload: any = {};

    // If no filters selected, send empty payload to fetch all data
    if (!date && selectedHistory.length === 0) {
      console.log("Fetching all audit data — no filters applied.");
      payload = {};
    } else {
      // Format date if provided
      const formattedDate = date
        ? new Intl.DateTimeFormat("en-GB").format(date) // dd/mm/yyyy
        : "";

      payload = {
        TransactionType: selectedHistory?.map((item: any) =>
          typeof item === "object" ? item.value : item
        ),
        updatedAt: formattedDate,
      };
    }

    console.log("Sending payload:", payload); // Debug the payload

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/listAuditPage",
        payload,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("Audit Data (decrypted):", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setStaffhistory(data.result); // Update the DataTable with result
      } else {
        console.warn("Data fetch was unsuccessful:", data.message);
      }
    } catch (err: unknown) {
      console.error("❌ Error fetching audit data");

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("🚨 Server responded with error:", err.response.data);
        } else if (err.request) {
          console.error("⚠️ No response received:", err.request);
        } else {
          console.error("❗ Axios error message:", err.message);
        }
      } else if (err instanceof Error) {
        console.error("❗ General error:", err.message);
      } else {
        console.error("❗ Unknown error:", err);
      }
    }
  };

  return (
    <div>
      <div className="p-4 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {t("dashboard.Staff Module")}
          </h2>
          <Button
            label={t("dashboard.Add new Staff")}
            severity="success"
            onClick={() => setVisible(true)}
          />
        </div>
        <div className="mt-3 p-2">
          <h3 className="text-lg font-bold">
            {t("dashboard.Added Staff Package")}
          </h3>
          <DataTable
            value={staff}
            tableStyle={{ minWidth: "50rem" }}
            scrollable
            scrollHeight="500px" // Adjust height as needed
            paginator
            rows={4}
          >
            <Column
              header={t("dashboard.SNo")}
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              className="underline text-[#0a5c9c] cursor-pointer"
              // headerStyle={{ width: "30rem" }}
              headerStyle={{ width: "40rem" }}
              bodyStyle={{ width: "40rem" }}
              field="refCustId"
              header={t("dashboard.StaffID")}
              body={(rowData) => (
                <div
                  onClick={() => {
                    setStaffupdateID(rowData.refuserId);
                    setStaffupdatesidebar(true);
                    fetchStaffDetails(rowData.refuserId);
                  }}
                >
                  {rowData.refCustId}
                </div>
              )}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refFName"
              header={t("dashboard.First Name")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refLName"
              header={t("dashboard.LastName")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refDOB"
              header={t("dashboard.DOB")}
              body={(rowData) => rowData.refDOB?.split("T")[0]}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refMoblile"
              header={t("dashboard.Mobile")}
            />
            <Column
              headerStyle={{ width: "9rem" }}
              field="refQualification"
              header={t("dashboard.Qualification")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refDesignation"
              header={t("dashboard.Designation")}
            />
            <Column body={actionDeleteTour} header={t("dashboard.Delete")} />
          </DataTable>
          <Dialog
            header="Confirm Deletion"
            visible={visibleDialog}
            style={{ width: "350px" }}
            onHide={() => setVisibleDialog(false)}
            footer={
              <div className="flex justify-end gap-2">
                <Button
                  label="No"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() => setVisibleDialog(false)}
                />
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  className="p-button-danger"
                  // loading={setLoading}
                  onClick={() => {
                    if (selectedBannerId !== null) {
                      deleteStaff(selectedBannerId);
                    }
                    setVisibleDialog(false);
                  }}
                />
              </div>
            }
          >
            <p>Are you sure you want to delete this banner?</p>
          </Dialog>
        </div>

        <Sidebar
          visible={visible}
          style={{ width: "60%" }}
          onHide={() => setVisible(false)}
          position="right"
        >
          <Toast ref={toast} />
          <h2 className="text-xl font-bold mb-4">
            {t("dashboard.Add new Staff")}
          </h2>

          <TabView>
            <TabPanel header={t("dashboard.Add Staff")}>
              <p className="text-sm text-[#f60000] mt-3 mb-3">
                {t("dashboard.warning")}
              </p>
              <div className="flex flex-col items-center justify-center gap-10% w-[100%] ">
                {" "}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    Addnewstaff();
                  }}
                  style={{
                    width: "100%",
                    padding: "20px",
                    borderRadius: "8px",
                    background: "#fff",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-4 w-[100%]">
                    <div className="flex flex-row w-[100%] gap-4 sm:w-full">
                      <InputText
                        name="refFName"
                        value={inputs.refFName}
                        onChange={handleInput}
                        placeholder="Enter  First Name"
                        className="p-inputtext-sm w-full"
                      />
                      <InputText
                        name="refLName"
                        value={inputs.refLName}
                        onChange={handleInput}
                        placeholder="Enter Last Name"
                        className="p-inputtext-sm w-full"
                      />
                    </div>
                    <div className="flex flex-row w-[100%] gap-4 sm:w-full">
                      <Calendar
                        name="refDOB"
                        value={inputs.refDOB}
                        onChange={handleCalendarChange}
                        placeholder="Enter Date of Birth"
                      />

                      <InputText
                        name="refDesignation"
                        value={inputs.refDesignation}
                        onChange={handleInput}
                        placeholder="Enter Designation"
                        className="p-inputtext-sm w-full"
                      />
                    </div>
                    <div className="flex flex-row w-[100%] gap-4 sm:w-full">
                      <InputText
                        name="refQualification"
                        value={inputs.refQualification}
                        onChange={handleInput}
                        placeholder="Enter qualification"
                        className="p-inputtext-sm w-full"
                      />
                      <InputText
                        name="refMoblile"
                        value={inputs.refMoblile}
                        onChange={handleInput}
                        placeholder="Enter Mobile Number"
                        className="p-inputtext-sm w-full"
                      />
                    </div>
                    <div className="flex flex-row w-[100%] gap-4 sm:w-full">
                      {/* <Dropdown
                        value={selectedEmployeeType}
                        onChange={(e: DropdownChangeEvent) => {
                          setSelectedEmployeeType(e.value);
                          fetchEmployeeType();
                        }}
                        options={employeeType}
                        optionValue="refUserTypeId"
                        optionLabel="refUserType"
                        placeholder="Choose Employee type"
                        className="w-full"
                        required
                      /> */}
                      <MultiSelect
                        value={selectedEmployeeType}
                        onChange={(e) => {
                          setSelectedEmployeeType(e.value);
                        }}
                        options={employeeType}
                        optionLabel="refUserType"
                        display="chip"
                        required
                        placeholder="Select usertype"
                        maxSelectedLabels={1}
                        className="w-full md:w-20rem"
                      />
                      <InputText
                        name="refUserEmail"
                        value={inputs.refUserEmail}
                        onChange={handleInput}
                        placeholder="Enter Email"
                        className="p-inputtext-sm w-full"
                      />
                    </div>

                    <div>
                      <h2 className="mt-3">Upload Profile </h2>
                      <FileUpload
                        name="logo"
                        customUpload
                        className="mt-3"
                        uploadHandler={profile}
                        accept="image/*"
                        maxFileSize={10000000}
                        emptyTemplate={
                          <p className="m-0">
                            Drag and drop your image here to upload in 10 MB(Max).
                          </p>
                        }
                      />
                    </div>

                    <div>
                      <Button
                        type="submit"
                        label="Submit"
                        loading={isFormSubmitting}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </TabPanel>
            <TabPanel header="Audit">
              <div className="flex flex-row w-[100%] gap-4 sm:w-full mb-4">
                <div className="flex flex-col h-[50%] gap-2">
                  <label htmlFor="selectedHistory">Select Date</label>
                  <Calendar
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    dateFormat="dd/mm/yy"
                  />
                </div>
                <div className="flex flex-col h-[50%] gap-2">
                  <label htmlFor="selectedHistory">
                    Select Transaction Type
                  </label>
                  <MultiSelect
                    value={selectedHistory}
                    options={historyOptions}
                    onChange={(e) => setSelectedHistory(e.value)}
                    optionLabel="label"
                    maxSelectedLabels={1}
                    placeholder="Select Transaction Types"
                    display="chip"
                    filter
                  />
                </div>
                <div className="w-[10%] h-[10%] mt-4">
                  <Button label="Apply" onClick={fetchFilteredAudit} />
                </div>
              </div>

              <DataTable value={staffhistory} paginator rows={10}>
                <Column
                  header="S.No"
                  headerStyle={{ width: "3rem" }}
                  body={(_, options) => options.rowIndex + 1}
                ></Column>
                <Column field="transData" header="Action" />
                <Column
                  field="refTransactionHistory"
                  header="Transaction Type"
                />
                <Column field="updatedAt" header="Updated At" />
                <Column
                  body={actionDeleteAudit}
                  header={t("dashboard.Delete")}
                />
                {/* Add other columns as needed */}
              </DataTable>
              <Dialog
                header="Confirm Deletion"
                visible={visibleDialog}
                style={{ width: "350px" }}
                onHide={() => setVisibleDialog(false)}
                footer={
                  <div className="flex justify-end gap-2">
                    <Button
                      label="No"
                      icon="pi pi-times"
                      className="p-button-text"
                      onClick={() => setVisibleDialog(false)}
                    />
                    <Button
                      label="Yes"
                      icon="pi pi-check"
                      className="p-button-danger"
                      // loading={setLoading}
                      onClick={() => {
                        console.log("selectedAuditId", selectedAuditId);
                        if (selectedAuditId !== null) {
                          deleteAudit(selectedAuditId);
                        }
                        setVisibleDialog(false);
                      }}
                    />
                  </div>
                }
              >
                <p>Are you sure you want to delete this banner?</p>
              </Dialog>
            </TabPanel>
          </TabView>
        </Sidebar>
        <Sidebar
          visible={staffupdatesidebar}
          style={{ width: "50%" }}
          onHide={() => setStaffupdatesidebar(false)}
          position="right"
        >
          <UpdateStaff
            closeStaffupdatesidebar={closeStaffupdatesidebar}
            StaffupdateID={staffupdateID}
          />
        </Sidebar>
      </div>
    </div>
  );
};

export default Staff;
