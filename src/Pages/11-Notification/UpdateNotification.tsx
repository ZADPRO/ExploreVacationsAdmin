import { InputText } from "primereact/inputtext";
import React from "react";
import axios from "axios";
import { useState, useEffect,type FormEvent} from "react";
import CryptoJS from "crypto-js";
import { Toast } from "primereact/toast";
import { useRef } from "react";

import { Button } from "primereact/button";
// import { decryptAPIResponse } from "../../utils";
// import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";

interface NotificationUpdateProps {
  closeNotificationupdatesidebar: () => void;
  NotificationupdateID: string;
}
type DecryptResult = any;

const UpdateNotification: React.FC<NotificationUpdateProps> = ({
  closeNotificationupdatesidebar,
  NotificationupdateID,
}) => {
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

  const [_notification, setNotification] = useState<Notification[]>([]);
 
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<any[]>([]);
  const [employeeType, setEmployeeType] = useState<any[]>([]);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const isFormSubmitting = false;

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
  // const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputs((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const Updatenotification = async (e: FormEvent<HTMLFormElement>) => {
     e.preventDefault(); 
    setSubmitLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL +
          "/notificationRoutes/updateNotifications",
        {
          refNotificationsId: inputs.refNotificationsId,
          refSubject: inputs.refSubject,
          refDescription: inputs.refDescription,
          refNotes: inputs.refNotes,
          refUserTypeId: selectedEmployeeType.map((item: number) =>
            item.toString()
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
      console.log("data---------->Notification", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchnotification();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: " Updated successfully!",
          life: 3000,
        });
        
      }
    } catch (e) {
      console.log("Error Notification :", e);
      setSubmitLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployeeType();
    fetchnotification();
    fetchNotificationId(NotificationupdateID);
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
        setNotification(data.Result);
      }
    } catch (e: any) {
      console.log("Error fetching notification:", e);
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
        const notificationData = data.Result[0];
      
        setNotificationDetails(notificationData);
        setSelectedEmployeeType(notificationData.userTypeId);
      
        setInputs({
          refNotificationsId: notificationData.refNotificationsId,
          refSubject: notificationData.refSubject || "",
          refDescription: notificationData.refDescription || "",
          refNotes: notificationData.refNotes || "",
          refUserTypeId: notificationData.userTypeId || [],
        });
        fetchnotification();
      
        console.log("fetchNotificationId:", notificationData);
      }
      
    } catch (err) {
      setError("Error fetching Notification details.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div>
         <Toast ref={toast} />
        <h2 className="text-xl font-bold">
          Update Staff Notification ID: {NotificationupdateID}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            Updatenotification(e);
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
                onChange={(e: any) => {
                  setInputs({ ...inputs, refSubject: e.target.value });
                  console.log("subject", e.target.value);
                }}
                placeholder="Enter Subject"
                className="p-inputtext-sm w-full"
              />
              <InputText
                name="refDescription"
                value={inputs.refDescription}
                onChange={(e: any) => {
                  setInputs({ ...inputs, refDescription: e.target.value });
                  console.log("refDescription", e.target.value);
                }}
                placeholder="Enter Description"
                className="p-inputtext-sm w-full"
              />
            </div>

            <div className="flex flex-row w-[100%] gap-4 sm:w-full">
              <InputText
                name="refNotes"
                value={inputs.refNotes}
                onChange={(e: any) => {
                  setInputs({ ...inputs, refNotes: e.target.value });
                  console.log("refNotes", e.target.value);
                }}
                placeholder="Enter Notes"
                className="p-inputtext-sm w-[50%]"
              />

              <MultiSelect
                value={selectedEmployeeType}
                onChange={(e) => {
                  setSelectedEmployeeType(e.value);
                  console.log("setSelectedEmployeeType-->", e.value);
                }}
                options={employeeType}
                optionLabel="refUserType"
                optionValue="refUserTypeId"
                display="chip"
                required
                placeholder="Select Employee Type"
                maxSelectedLabels={1}
                className="w-full md:w-20rem"
              />
            </div>
            <div>
              <Button
                type="submit"
                label="Submit"
                onClick={closeNotificationupdatesidebar}
                loading={isFormSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateNotification;
