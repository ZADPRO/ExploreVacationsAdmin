import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import CryptoJS from "crypto-js";
import { useState, useEffect, useRef } from "react";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import UpdateNotification from "./UpdateNotification";
import { useTranslation } from "react-i18next";


interface Notification {
  refNotificationsId: number;
  refSubject: string;
  refDescription: string;
  refNotes: string;
  refUserTypeId: string[];
}

type DecryptResult = any;
const Notification: React.FC = () => {
  const { t } = useTranslation("global");
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

  const closeNotificationupdatesidebar = () => {
    setNotificationupdatesidebar(false);
  };

  const [notification, setNotification] = useState<Notification[]>([]);
  const [notificationupdateID, setNotificationupdateID] = useState("");
  const [notificationupdatesidebar, setNotificationupdatesidebar] =
    useState(false);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<any[]>([]);
  const [employeeType, setEmployeeType] = useState<any[]>([]);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const isFormSubmitting = false;
  const [_editNotificationId, setEditNotificationId] = useState<number | null>(
    null
  );
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [_notificationDetails, setNotificationDetails] = useState(null);
  const [inputs, setInputs] = useState({
    refNotificationsId: 0,
    refSubject: "",
    refDescription: "",
    refNotes: "",
    refUserTypeId: [],
  });
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const toast = useRef<Toast>(null);

  const Addnotification = async () => {
    setSubmitLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/notificationRoutes/addNotifications",
        {
          refSubject: inputs.refSubject,
          refDescription: inputs.refDescription,
          refNotes: inputs.refNotes,
          refUserTypeId: selectedEmployeeType.map(
            (item) => item.refUserTypeId + ""
          ),
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
          detail: " Added successfully!",
          life: 3000,
        });

        localStorage.setItem("token", "Bearer " + data.token);

        fetchnotification();
      }
    } catch (e) {
      console.log("Error adding staff:", e);
      setSubmitLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployeeType();
    fetchnotification();
  }, []);

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
  //display

  const fetchnotification = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/notificationRoutes/listNotifications",
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
      console.log("data ---------->list fetchnotification", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchnotification-------", data);
        const sorted = data.Result.sort(
          (a: Notification, b: Notification) =>
            b.refNotificationsId - a.refNotificationsId
        );
        setNotification(sorted);
        setNotification(data.Result);
      }
    } catch (e: any) {
      console.log("Error fetching notification:", e);
    }
  };

  const actionDeleteNotification = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteNotification(rowData.refNotificationsId)}
      />
    );
  };

  //delete
  const deleteNotification = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL +
          "/notificationRoutes/deleteNotifications",
        {
          refNotificationsId: id,
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
        fetchnotification();
        toast.current?.show({
          severity: "error",
          detail: "Deleted Successfully",
          life: 3000,
        });
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error updating package:", e);
      setSubmitLoading(false);
      setEditNotificationId(null);
    }
  };

  //single notification
  const fetchNotificationId = async (refNotificationsId: string) => {
    console.log("packageID", refNotificationsId);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/notificationRoutes/getNotifications`,
        { refNotificationsId: refNotificationsId },
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

      console.log("data---->fetchNotificationId", data);

      if (data.success) {
        setNotificationDetails(data.tourDetails);
        console.log("fetchNotificationId:", data.tourDetails);
      } else {
        setError("Failed to fetch Notification details.");
      }
    } catch (err) {
      setError("Error fetching Notification details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">
          {t("dashboard.Notification")}
        </h2>

        <p className="text-sm text-[#f60000] mt-3 mb-3">
          {t("dashboard.warning")}
        </p>
        <TabView>
          <TabPanel header={t("dashboard.Add Notification")}>
            <div className="flex flex-col items-center justify-center gap-10% w-[100%] ">
              {" "}
              <Toast ref={toast} />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  Addnotification();
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
                      name="refSubject"
                      value={inputs.refSubject}
                      onChange={handleInput}
                      placeholder="Enter Subject"
                      className="p-inputtext-sm w-full"
                    />
                    <InputText
                      name="refDescription"
                      value={inputs.refDescription}
                      onChange={handleInput}
                      placeholder="Enter Description"
                      className="p-inputtext-sm w-full"
                    />
                  </div>

                  <div className="flex flex-row w-[100%] gap-4 sm:w-full">
                    <InputText
                      name="refNotes"
                      value={inputs.refNotes}
                      onChange={handleInput}
                      placeholder="Enter Notes"
                      className="p-inputtext-sm w-[50%]"
                    />

                    <MultiSelect
                      value={selectedEmployeeType}
                      onChange={(e) => {
                        setSelectedEmployeeType(e.value);
                      }}
                      options={employeeType}
                      optionLabel="refUserType"
                      display="chip"
                      required
                      placeholder="Select User Type"
                      filter
                      maxSelectedLabels={1}
                      className="w-full md:w-24rem"
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
          <TabPanel header={t("dashboard.History")}>
            <div className="mt-3 p-2">
              <Toast ref={toast} />
              <h3 className="text-lg font-bold">
                {t("dashboard.Added Notification")}
              </h3>
              <DataTable
                value={notification}
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
                  headerStyle={{ width: "20rem" }}
                  field="refSubject"
                  header={t("dashboard.Subject")}
                  body={(rowData) => (
                    <div
                      onClick={() => {
                        setNotificationupdateID(rowData.refNotificationsId);
                        setNotificationupdatesidebar(true);
                        fetchNotificationId(rowData.refNotificationsId);
                      }}
                    >
                      {rowData.refSubject}
                    </div>
                  )}
                />
                <Column
                  headerStyle={{ width: "15rem" }}
                  field="refUserType"
                  header={t("dashboard.EmployeeType")}
                  body={(rowData) =>
                    Array.isArray(rowData.refUserType)
                      ? rowData.refUserType.join(", ")
                      : rowData.refUserType
                  }
                />
                <Column
                  headerStyle={{ width: "15rem" }}
                  field="refDescription"
                  header={t("dashboard.Description")}
                />
                <Column
                  field="refNotes"
                  header={t("dashboard.Notes")}
                  headerStyle={{ width: "15rem" }}
                  body={(rowData) => {
                    const isLink =
                      typeof rowData.refNotes === "string" &&
                      rowData.refNotes.startsWith("http");
                    return isLink ? (
                      <a
                        href={rowData.refNotes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#326fd1] underline"
                      >
                        {rowData.refNotes}
                      </a>
                    ) : (
                      <span>{rowData.refNotes}</span>
                    );
                  }}
                />
                <Column
                  body={actionDeleteNotification}
                  header={t("dashboard.Delete")}
                />
              </DataTable>
            </div>
          </TabPanel>
        </TabView>
        <Sidebar
          visible={notificationupdatesidebar}
          style={{ width: "50%" }}
          onHide={() => setNotificationupdatesidebar(false)}
          position="right"
        >
          <UpdateNotification
            closeNotificationupdatesidebar={closeNotificationupdatesidebar}
            NotificationupdateID={notificationupdateID}
          />
        </Sidebar>
      </div>
    </>
  );
};

export default Notification;
