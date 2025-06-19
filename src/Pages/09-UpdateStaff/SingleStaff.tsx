import React, { FormEvent } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useState, useEffect, useRef } from "react";
import { decryptAPIResponse } from "../../utils";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
// import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";

interface FormDataType {
  //   refuserId: number;
  refFName: string;
  refLName: string;
  refDOB: string;
  refDesignation: string;
  refQualification: string;
  refProfileImage: {
    filename: string;
    contentType: string;
    content: string;
    filepath:string;
  } | null;
  refMoblile: string;
  userTypeId: number[];
  refUserEmail: string;
  refUserPassword: string;
}

const SingleStaff: React.FC = () => {
  const isFormSubmitting = false;
  const { t } = useTranslation("global");
  const [_submitLoading, setSubmitLoading] = useState(false);
  const [_editStaffId, setEditStaffId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    // refuserId: 0,
    refFName: "",
    refLName: "",
    refDOB: "",
    refDesignation: "",
    refQualification: "",
    refProfileImage: { filename: "", contentType: "", content: "",filepath:"" },
    refMoblile: "",
    userTypeId: [],
    refUserEmail: "",
    refUserPassword: "",
  });
  // const [selectedEmployeeType, setSelectedEmployeeType] = useState<any[]>([]);
  // const [employeeType, setEmployeeType] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState("");

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/employeeProfile",
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
        setFormData({
          //   refuserId: data.result[0].refuserId,
          refFName: data.result[0].refFName,
          refLName: data.result[0].refLName,
          refDOB: data.result[0].refDOB,
          refDesignation: data.result[0].refDesignation,
          refQualification: data.result[0].refQualification,
          refProfileImage: data.result[0].refProfileImage,
          refMoblile: data.result[0].refMoblile,
          userTypeId: data.result[0].userTypeId,
          refUserEmail: data.result[0].refUserEmail,
          refUserPassword: data.result[0].refUserPassword,
        });
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formDataobject = Object.fromEntries(
    //   new FormData(e.target as HTMLFormElement)
    // );
    console.log("update APi");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/updateEmployeeProfile",
        {
          //   refuserId: formData.refuserId,
          refFName: formData.refFName,
          refLName: formData.refLName,
          refDOB: new Date(formData.refDOB).toISOString(),
          refDesignation: formData.refDesignation,
          refQualification: formData.refQualification,
          refProfileImage:
            profileImage === ""
              ? formData.refProfileImage?.filename ?? ""
              : profileImage,
          refMoblile: formData.refMoblile,
          refUserPassword: formData.refUserPassword,
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
      }
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
  };

  const toast = useRef<Toast>(null);

  const profile = async (event: any) => {
    const file = event.files[0];
    const formData = new FormData();
    formData.append("Image", file);

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

      if (data.success) {
        handleUploadSuccessMap(data);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });
      } else {
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
    setProfileImage(response.filePath);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
  };

  const deleteStaffimage = async (filepath: string) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/deleteEmployeeImage",
        {
          filepath: filepath,
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
    }
  };
  return (
    <div className="min-h-screen max-h-screen overflow-auto flex flex-col items-center justify-start px-4 py-6">
      <Toast ref={toast} />
      <div className="w-full max-w-4xl">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold">{t("dashboard.profile")}</h2>
          <p className="text-sm text-[#f60000] mt-3 mb-3">
            {t("dashboard.warning")}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateSubmit(e);
          }}
          className="w-full p-6 bg-white rounded-lg shadow-md"
        >
          <div className="flex flex-col justify-center items-center gap-4 w-[100%]">
            <div className="flex justify-center align-middle w-[20%] h-[10%] relative">
              {formData?.refProfileImage && (
                <>
                  <img
                    src={`data:${formData.refProfileImage.contentType};base64,${formData.refProfileImage.content}`}
                    alt="Staff Profile Image"
                    className="w-full h-full object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (formData.refProfileImage?.contentType) {
                        deleteStaffimage(formData.refProfileImage.filepath);
                      }

                      setFormData({ ...formData, refProfileImage: null });
                    }}
                    className="absolute top-1 right-1 bg-amber-50 text-[#000] text-3xl rounded-full w-2 h-6 flex items-center justify-center hover:bg-red-600"
                    title="Remove Image"
                  >
                    &times;
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-row gap-4 w-full ">
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
              <Calendar
                name="refDOB"
                value={new Date(formData.refDOB)}
                onChange={
                  (e: any) => setFormData({ ...formData, refDOB: e.value }) // use e.value instead of e.target.value
                }
                placeholder="Enter Date of Birth"
                dateFormat="yy-mm-dd" // <-- This formats as yyyy-mm-dd
              />
            </div>

            <div className="flex flex-row gap-4 w-full ">
              <InputText
                name="refDesignation"
                value={formData.refDesignation}
                onChange={(e: any) =>
                  setFormData({ ...formData, refDesignation: e.target.value })
                }
                placeholder="Enter Designation"
                className="p-inputtext-sm w-full"
              />
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

            <div className="flex flex-row gap-4 w-full">
              <InputText
                name="refUserEmail"
                value={formData.refUserEmail}
                onChange={(e: any) =>
                  setFormData({ ...formData, refUserEmail: e.target.value })
                }
                placeholder="Enter Email"
                className="p-inputtext-sm w-full"
              />
              <InputText
                name="refUserPassword"
                value={formData.refUserPassword}
                onChange={(e: any) =>
                  setFormData({ ...formData, refUserPassword: e.target.value })
                }
                placeholder="Enter Password"
                className="p-inputtext-sm w-full"
              />
            </div>

            <div>
              <h2 className="mt-3">Upload Profile</h2>
              <FileUpload
                name="logo"
                customUpload
                className="mt-3"
                uploadHandler={profile}
                accept="image/*"
                maxFileSize={10000000}
                emptyTemplate={
                  <p className="m-0">
                    Drag and drop your image here to upload.
                  </p>
                }
              />
            </div>

            <div className="flex justify-center mt-4">
              <Button type="submit" label="Submit" loading={isFormSubmitting} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleStaff;
