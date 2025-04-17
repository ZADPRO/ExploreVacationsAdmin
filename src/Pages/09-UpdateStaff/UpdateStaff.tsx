import { InputText } from "primereact/inputtext";
import React from "react";
import axios from "axios";
import { useState, useEffect, type FormEvent } from "react";
import { Calendar } from "primereact/calendar";

import { Button } from "primereact/button";
import { decryptAPIResponse } from "../../utils";

interface StaffUpdateProps {
  closeStaffupdatesidebar: () => void;
  StaffupdateID: string;
}

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



const UpdateStaff: React.FC<StaffUpdateProps> = ({
  closeStaffupdatesidebar,
  StaffupdateID,
}) => {
  //   const decrypt = (
  //     encryptedData: string,
  //     iv: string,
  //     key: string
  //   ): DecryptResult => {
  //     const cipherParams = CryptoJS.lib.CipherParams.create({
  //       ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
  //     });

  //     const decrypted = CryptoJS.AES.decrypt(
  //       cipherParams,
  //       CryptoJS.enc.Hex.parse(key),
  //       {
  //         iv: CryptoJS.enc.Hex.parse(iv),
  //         mode: CryptoJS.mode.CBC,
  //         padding: CryptoJS.pad.Pkcs7,
  //       }
  //     );

  //     return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  //   };

  const isFormSubmitting = false;
 
  const [_isAddStaffOpen, setIsAddStaffOpen] = useState(false);
 

  const [formData, setFormData] = useState({
    refuserId: 0,
    refFName: "",
    refLName: "",
    refDOB: "",
    refDesignation: "",
    refQualification: "",
    refProfileImage: "",
    refMoblile: "",
    refUserTypeId: 0,
    refUserEmail: "",
  });
  const [_staff, setStaff] = useState<StaffDetails[]>([]);

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

      const data = decryptAPIResponse(
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

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataobject = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );
    console.log("formDataobject------->", formData);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/updateEmployee",
        {
          refuserId: formData.refuserId,
          refFName: formData.refFName,
          refLName: formDataobject.refLName,
          refDOB: new Date(formData.refDOB).toISOString(),
          refDesignation: formData.refDesignation,
          refQualification: formData.refQualification,
          refProfileImage: formData.refProfileImage,
          refMoblile: formData.refMoblile,
          refUserEmail: formData.refUserEmail,
        },
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
      console.log("data--> Staffupdate---working", data);
      if (data.success) {
        // await addTour(payload);
        // setIsFormSubmitting(false);
        localStorage.setItem("token", "Bearer " + data.token);

        setIsAddStaffOpen(false);
        fetchSingleIDStaffdataForm();
      }
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
  };

  const fetchSingleIDStaffdataForm = async () => {
    console.log("Fetching data for StaffupdateID-----Line 154:", StaffupdateID);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/getEmployee",
        {
          refuserId: StaffupdateID,
        },
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

      console.log("fetchSingleIDStaffdataForm----------------", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setFormData(data.result[0]);
      }
    } catch (e) {
      console.error("Error fetching tour data:", e);
    }
  };

  useEffect(() => {
    fetchSingleIDStaffdataForm();

    fetchStaff();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetchSingleIDStaffdataForm();

    await handleUpdateSubmit(e);
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">
          Update New Tour Package ID: {StaffupdateID}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="mt-4"
        >
          <div className="flex flex-col items-center justify-center gap-4 w-[100%]">
            <div className="flex flex-row w-[100%] gap-4 sm:w-full">
              <InputText
                name="refFName"
                placeholder="Enter  First Name"
                className="p-inputtext-sm w-full"
                value={formData.refFName}
                onChange={(e: any) =>
                  setFormData({ ...formData, refFName: e.target.value })
                }
              />
              <InputText
                name="refLName"
                value={formData.refLName}
                onChange={(e: any) =>
                  setFormData({ ...formData, refLName: e.target.value })
                }
                placeholder="Enter Last Name"
                className="p-inputtext-sm w-full"
              />
            </div>
            <div className="flex flex-row w-[100%] gap-4 sm:w-full">
              <Calendar
                name="refDOB"
                value={new Date(formData.refDOB)}
                onChange={(e: any) =>
                  setFormData({ ...formData, refDOB: e.target.value })
                }
                placeholder="Enter Date of Birth"
              />

              <InputText
                name="refDesignation"
                value={formData.refDesignation}
                onChange={(e: any) =>
                  setFormData({ ...formData, refDesignation: e.target.value })
                }
                placeholder="Enter Designation"
                className="p-inputtext-sm w-full"
              />
            </div>
            <div className="flex flex-row w-[70%] gap-4 sm:w-full">
              <InputText
                name="refQualification"
                value={formData.refQualification}
                onChange={(e: any) => {

                  setFormData({ ...formData, refQualification: e.target.value });
                }}
                placeholder="Enter qualification"
                className="p-inputtext-sm w-full"
              />
              <InputText
                name="refMoblile"
                value={formData.refMoblile}
                onChange={(e: any) =>
                  setFormData({ ...formData, refMoblile: e.target.value })
                }
                placeholder="Enter Mobuile Number"
                className="p-inputtext-sm w-full"
              />
            </div>
            <div className="flex flex-row w-[70%] gap-4 sm:w-full">
              <InputText
                name="refUserEmail"
                value={formData.refUserEmail}
                onChange={(e: any) =>
                  setFormData({ ...formData, refUserEmail: e.target.value })
                }
                placeholder="Enter Email"
                className="p-inputtext-sm w-full"
              />
            </div>

            {/* <div>
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
                              Drag and drop your Map here to upload.
                            </p>
                          }
                        />
                      </div> */}

            <div>
              <Button
                type="submit"
                label="Submit"
                onClick={closeStaffupdatesidebar}
                loading={isFormSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaff;
