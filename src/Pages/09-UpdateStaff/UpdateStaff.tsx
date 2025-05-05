import { InputText } from "primereact/inputtext";
import React from "react";
import axios from "axios";
import { useState, useEffect, type FormEvent } from "react";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { useRef } from "react";

import { Button } from "primereact/button";
import { decryptAPIResponse } from "../../utils";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";

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
  userTypeId: number;
  refUserEmail: string;
}

const UpdateStaff: React.FC<StaffUpdateProps> = ({
  closeStaffupdatesidebar,
  StaffupdateID,
}) => {
  const isFormSubmitting = false;

  const [_isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<any[]>([]);
  const [employeeType, setEmployeeType] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    refuserId: 0,
    refFName: "",
    refLName: "",
    refDOB: "",
    refDesignation: "",
    refQualification: "",
    refProfileImage: "",
    refMoblile: "",
    userTypeId: [],
    refUserEmail: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [_staff, setStaff] = useState<StaffDetails[]>([]);
  const [_uploadedProfile, setUploadedProfile] = useState<File | null>(null);
  const toast = useRef<Toast>(null);

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
    // const formDataobject = Object.fromEntries(
    //   new FormData(e.target as HTMLFormElement)
    // );
    console.log("update APi");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/updateEmployee",
        {
          refuserId: formData.refuserId,
          refFName: formData.refFName,
          refLName: formData.refLName,
          refDOB: new Date(formData.refDOB).toISOString(),
          refDesignation: formData.refDesignation,
          refQualification: formData.refQualification,
          refProfileImage:
            profileImage === "" ? formData.refProfileImage : profileImage,
          refMoblile: formData.refMoblile,
          userTypeId: selectedEmployeeType.map((item: number) =>
            item.toString()
          ),
          // refUserEmail: formData.refUserEmail,
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
        setSelectedEmployeeType(data.result[0].userTypeId);
        console.log("data.result[0]--->", data.result[0].userTypeId);
      }
    } catch (e) {
      console.error("Error fetching tour data:", e);
    }
  };
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

      const data = decryptAPIResponse(
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

  useEffect(() => {
    fetchSingleIDStaffdataForm();
    fetchEmployeeType();
    fetchStaff();
  }, []);

  const profile = async (event: any) => {
    console.table("event", event);
    const file = event.files[0]; // Assuming single file upload
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);
    if (file) {
      setUploadedProfile(file);
    }

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

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("token", "Bearer " + data.token);
      console.log("data==============", data);

      if (data.success) {
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
    setProfileImage(response.filePath);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateSubmit(e);
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
                  setFormData({
                    ...formData,
                    refQualification: e.target.value,
                  });
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

              {/* <InputText
                name="refUserEmail"
                value={formData.refUserEmail}
                onChange={(e: any) =>
                  setFormData({ ...formData, refUserEmail: e.target.value })
                }
                placeholder="Enter Email"
                className="p-inputtext-sm w-full"
              /> */}
            </div>

            <div>
              <h2 className="mt-3">Upload Profile * </h2>
              <FileUpload
                name="logo"
                customUpload
                className="mt-3"
                uploadHandler={profile}
                accept="image/*"
                maxFileSize={10000000}
                emptyTemplate={
                  <p className="m-0">Drag and drop your Map here to upload.</p>
                }
              />
            </div>

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
