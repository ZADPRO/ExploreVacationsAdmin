import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "primereact/button";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { TiTickOutline } from "react-icons/ti";
import { decryptAPIResponse } from "../../utils";
// import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useTranslation } from "react-i18next";


interface BannerProps {
  closeBanner: () => void;
  BannerupdateID: string;
}

interface ModuleOption {
  label: string;
  value: number;
}

interface Banner {
  refHomePageId: string;
  refHomePageName: string;
  homePageHeading: string;
  homePageContent: string;
  refOffer: string;
  refOfferName: string;
  homePageImage: {
    filename: string;
    contentType: string;
    content: string;
  } | null;
  refModuleId: string | null;
}

const moduleOptions: ModuleOption[] = [
  { label: "Parking", value: 1 },
  { label: "Car", value: 2 },
  { label: "Tour", value: 3 },
  { label: "Home", value: 4 },
];

const UpdateBanner: React.FC<BannerProps> = ({
  closeBanner,
  BannerupdateID,
}) => {
  const [inputs, setInputs] = useState<Banner>({
    refHomePageId: "",
    refHomePageName: "",
    homePageHeading: "",
    homePageContent: "",
    refOffer: "",
    refOfferName: "",
    homePageImage: { filename: "", contentType: "", content: "" },
    refModuleId: null,
  });
  const [selectedType, setSelectedType] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [_submitLoading, setSubmitLoading] = useState(false);
  // const [formDataImages, setFormdataImages] = useState<any>([]);
  const [_uploadedProfile, setUploadedProfile] = useState<File | null>(null);
  const toast = useRef<Toast>(null);
  const [_bannerSingle, setBannerSingle] = useState("");
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [_editStaffId, setEditStaffId] = useState<number | null>(null);
  const { t } = useTranslation("global");

  const Updatebanner = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/bookingRoutes/updateContent",
        {
          refHomePageId: inputs.refHomePageId,
          refHomePageName: inputs.refHomePageName,
          homePageHeading: inputs.homePageHeading,
          homePageContent: inputs.homePageContent,
          refOffer: inputs.refOffer,
          refOfferName: inputs.refOfferName,
          refModuleId: selectedType,
          homePageImage:
            profileImage === ""
              ? inputs.homePageImage?.filename ?? ""
              : profileImage,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("token line 126======", token);

      const data = decryptAPIResponse(
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
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Banner",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding Banner:", e);
      setSubmitLoading(false);
    }
  };
  const fetchSingleBanner = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookingRoutes/getHomeImage`,
        { refHomePageId: BannerupdateID },
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

      console.log("data---->Single banner", data);

      if (data.success) {
        setBannerSingle(data.result);
        setInputs({
          refHomePageId: data.result[0].refHomePageId,
          refHomePageName: data.result[0].refHomePageName,
          homePageHeading: data.result[0].homePageHeading,
          homePageContent: data.result[0].homePageContent,
          refOffer: data.result[0].refOffer,
          refOfferName: data.result[0].refOfferName,
          homePageImage: data.result[0].homePageImage,
          refModuleId: data.result[0].refModuleId,
        });
        setSelectedType(data.result[0].refModuleId);
        console.log("Single banner:", data);
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
    fetchSingleBanner();
  }, []);

  const profile = async (event: any) => {
    console.table("event", event);
    const file = event.files[0];
    const formData = new FormData();
    formData.append("images", file);
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
        import.meta.env.VITE_API_URL + "/homePageRoutes/uploadImages",

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
  // const handleDropdownChange = (e: DropdownChangeEvent) => {
  //   const { name, value } = e.target.value;

  //   setInputs((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  //delete banner

  const deletebanner = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/bookingRoutes/deletehomeImage",
        {
          refHomePageId: id,
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
          detail: "Error While Deleting ",
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
    <div>
      <Toast ref={toast} />

      <div>Banner ID : {BannerupdateID}</div>
      <p className="text-sm text-[#f60000] mt-3">{t("dashboard.warning")}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          Updatebanner(e);
        }}
        className="mt-4"
      >
        <div className="w-[30%] h-[30%] relative">
          {inputs?.homePageImage && (
            <>
              <img
                src={`data:${inputs.homePageImage.contentType};base64,${inputs.homePageImage.content}`}
                alt="Staff Profile Image"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  console.log("Deleting image for ID:", inputs.refHomePageId);
                  deletebanner(inputs.refHomePageId);
                  setInputs({ ...inputs, homePageImage: null });
                }}
                className="absolute top-1 right-1 bg-amber-50 text-[#000] text-3xl rounded-full w-2 h-6 flex items-center justify-center hover:bg-red-600"
                title="Remove Image"
              >
                &times;
              </button>
            </>
          )}
        </div>
        <div className="mt-3">
          <h2 className="mt-3">{t("dashboard.upload image")} </h2>
          <FileUpload
            name="logo"
            customUpload
            className="mt-3"
            uploadHandler={profile}
            accept="image/*"
            maxFileSize={10000000}
            emptyTemplate={<p className="m-0">{t("dashboard.imagewarning")}</p>}
          />
        </div>

        <div className="flex flex-row gap-3 mt-5">
          <InputText
            placeholder={t("dashboard.Enter Banner heading")}
            name="refHomePageName"
            required
            className="w-full"
            value={inputs.refHomePageName}
            onChange={(e: any) => {
              console.log("inputs----", inputs.refHomePageName);
              setInputs({ ...inputs, refHomePageName: e.target.value });
            }}
          />

          <InputText
            name="homePageHeading"
            placeholder={t("dashboard.Enter homepage heading")}
            className="w-full"
            onChange={(e: any) => {
              console.log("inputs----", inputs.homePageHeading);
              setInputs({ ...inputs, homePageHeading: e.target.value });
            }}
            value={inputs.homePageHeading}
            required
          />
          {/* 
          <Dropdown
            name="refModuleId"
            value={selectedType}
            onChange={(e: DropdownChangeEvent) => {
              console.log("inputs----", inputs.refModuleId)
              setSelectedType(e.value);
            }}
            options={moduleOptions}
            optionValue="value"        
            placeholder="Select Module"
            className="w-full"
          /> */}
          <Dropdown
            name="refModuleId"
            value={selectedType}
            onChange={(e: DropdownChangeEvent) => {
              console.log("inputs----", inputs.refModuleId);
              setSelectedType(e.value);
            }}
            options={moduleOptions}
            optionValue="value"
            placeholder={t("dashboard.Select Module")}
            className="w-full"
          />
        </div>
        <div className="flex flex-row gap-3 mt-5">
          <InputText
            placeholder={t("dashboard.Enter homePage Content")}
            name="homePageContent"
            onChange={(e: any) => {
              console.log("inputs----", inputs.homePageContent);
              setInputs({ ...inputs, homePageContent: e.target.value });
            }}
            value={inputs.homePageContent}
            required
            className="w-full"
          />
          <InputText
            name="refOffer"
            placeholder={t("dashboard.Enter Offer")}
            onChange={(e: any) => {
              console.log("inputs----", inputs.refOffer);
              setInputs({ ...inputs, refOffer: e.target.value });
            }}
            value={inputs.refOffer}
            className="w-full"
            required
          />
          <InputText
            name="refOfferName"
            placeholder={t("dashboard.Enter Offer Name")}
            onChange={(e: any) => {
              console.log("inputs----", inputs.refOfferName);
              setInputs({ ...inputs, refOfferName: e.target.value });
            }}
            value={inputs.refOfferName}
            className="w-full"
            required
          />
        </div>
        <div className="flex justify-center mt-5">
          <Button type="submit" label={t("dashboard.Submit")} onClick={closeBanner} />
        </div>
      </form>
    </div>
  );
};

export default UpdateBanner;
