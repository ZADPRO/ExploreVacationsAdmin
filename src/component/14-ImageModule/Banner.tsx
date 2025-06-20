  import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { TiTickOutline } from "react-icons/ti";
import { decryptAPIResponse } from "../../utils";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import UpdateBanner from "./UpdateBanner";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";

interface ModuleOption {
  label: string;
  value: number;
}
const moduleOptions: ModuleOption[] = [
  { label: "Parking", value: 1 },
  { label: "Car", value: 2 },
  { label: "Tour", value: 3 },
  { label: "Home", value: 4 },
];

const Banner: React.FC = () => {
  const { t } = useTranslation("global");
  const [banner, setBanner] = useState<any[]>([]);
  const [bannerSidebar, setBannerSidebar] = useState(false);

  const [bannerupdateID, setBannerupdateID] = useState("");
  const [visible, setVisible] = useState(false);
  const [_editBannerId, setEditBannerId] = useState<number | null>(null);
  const [formDataImages, setFormdataImages] = useState<any>([]);
  const isFormSubmitting = false;
  const [_bannerSingle, setBannerSingle] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  
    const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);

  const closeBanner = () => {
    setBannerSidebar(false);
  };
  const [inputs, setInputs] = useState({
    refHomePageName: "",
    homePageHeading: "",
    homePageContent: "",
    refOffer: "",
    refOfferName: "",
    homePageImage: "",
    refModuleId: null,
  });
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const toast = useRef<Toast>(null);

  const customImage = async (event: any) => {
    console.table("event", event);
    const file = event.files[0];
    const formData = new FormData();
    formData.append("images", file);
    console.log("formData", formData);

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
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: " uploaded successfully!",
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
    setFormdataImages(response.filePath);
  };
  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleInput1 = (
    e: React.ChangeEvent<HTMLInputElement> | DropdownChangeEvent
  ) => {
    const { name } = e.target;
    const value = (e as DropdownChangeEvent).value ?? e.target.value;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Addnewbanner = async () => {
    setSubmitLoading(true);
    if (!formDataImages || formDataImages.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please upload an image before submitting.",
        life: 3000,
      });
      setSubmitLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/bookingRoutes/homeImageContent",
        {
          refHomePageName: inputs.refHomePageName,
          homePageHeading: inputs.homePageHeading,
          homePageContent: inputs.homePageContent,
          refOffer: inputs.refOffer,
          refOfferName: inputs.refOfferName,
          homePageImage: formDataImages,
          refModuleId: inputs.refModuleId,
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
  // list banner

  const fetchbanner = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/bookingRoutes/listhomeImage",
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
        console.log("Banner data---------->", data);
        setBanner(data.result);
        Addnewbanner();
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  const fetchSingleBanner = async (bannerid: string) => {
    console.log("packageID", bannerid);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookingRoutes/getHomeImage`,
        { refHomePageId: bannerid },
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
        setBannerSingle(data.tourDetails);
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

  const actionDelete = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        // onClick={() => deleteBanner(rowData.refHomePageId)}
         onClick={() => {
          setSelectedBannerId(rowData.refHomePageId);
          setVisibleDialog(true);
           }}
      />
    );
  };

  //delete
  const deleteBanner = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/bookingRoutes/deletehomeImageContent",
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
        fetchbanner();
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
      setEditBannerId(null);
      setVisibleDialog(false);
      setSelectedBannerId(null);
    }
  };
  useEffect(() => {
    fetchbanner();
  }, []);

  return (
    <>
      <div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {t("dashboard.BannerCreation")}
            </h2>
            <Button
              label={t("dashboard.Add new Banner")}
              severity="success"
              onClick={() => setVisible(true)}
            />
          </div>
        </div>

        <div className="mt-3 p-2">
          <h3 className="text-lg font-bold">
            {t("dashboard.AddedBannerPackage")}
          </h3>
          <DataTable
            value={banner}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={8}
            scrollable
          scrollHeight="500px"
          >
            <Column
              header={t("dashboard.SNo")}
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            ></Column>

            <Column
              className="underline text-[#0a5c9c] cursor-pointer"
              headerStyle={{ width: "15rem" }}
              field="homePageHeading"
              header={t("dashboard.homePageHeading")}
              body={(rowData) => (
                <div
                  onClick={() => {
                    setBannerupdateID(rowData.refHomePageId);
                    setBannerSidebar(true);
                    fetchSingleBanner(rowData.refHomePageId);
                  }}
                >
                  {rowData.homePageHeading}
                </div>
              )}
            />

            <Column
              headerStyle={{ width: "15rem" }}
              field="refHomePageName"
              header={t("dashboard.HomePageName")}
            />

            <Column
              headerStyle={{ width: "15rem" }}
              field="homePageContent"
              header={t("dashboard.homePageContent")}
            />

            <Column
              headerStyle={{ width: "15rem" }}
              field="refOfferName"
              header={t("dashboard.OfferName")}
            />

            <Column
              headerStyle={{ width: "15rem" }}
              field="refOffer"
              header={t("dashboard.Offer")}
            />

            <Column body={actionDelete} header={t("dashboard.actionDelete")} />

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
              loading={submitLoading}
              onClick={() => {
                if (selectedBannerId !== null) {
                  deleteBanner(selectedBannerId);
                }
                setVisibleDialog(false)
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
          <h2 className="text-xl font-bold">{t("dashboard.BannerCreation")}</h2>

          <p className="text-sm text-[#f60000] mt-3">
            {t("dashboard.warning")}
          </p>

          <form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              Addnewbanner();
            }}
          >
            <div className="mt-3">
              <h2 className="mt-3">{t("dashboard.upload image")}</h2>
              <FileUpload
                name="logo"
                customUpload
                className="mt-3"
                uploadHandler={customImage}
                accept="image/*"
                maxFileSize={10000000}
                emptyTemplate={
                  <p className="m-0">{t("dashboard.imagewarning")} </p>
                }
              />
            </div>

            <div className="flex flex-row gap-3 mt-5">
              <InputText
                placeholder={t("dashboard.Enter Banner heading")}
                name="refHomePageName"
                required
                className="w-full"
                onChange={handleInput}
              />
              <InputText
                name="homePageHeading"
                placeholder={t("dashboard.Enter homepage heading")}
                className="w-full"
                onChange={handleInput}
                required
              />
              <Dropdown
                name="refModuleId"
                value={inputs.refModuleId}
                options={moduleOptions}
                onChange={handleInput1}
                placeholder={t("dashboard.Select Module")}
                className="w-full"
              />
            </div>
            <div className="flex flex-row gap-3 mt-5">
              <InputText
                placeholder={t("dashboard.Enter homePage Content")}
                name="homePageContent"
                onChange={handleInput}
                required
                className="w-full"
              />
              <InputText
                name="refOffer"
                placeholder={t("dashboard.Enter Offer")}
                onChange={handleInput}
                className="w-full"
                required
              />
              <InputText
                name="refOfferName"
                placeholder={t("dashboard.Enter Offer Name")}
                onChange={handleInput}
                className="w-full"
                required
              />
            </div>
            <div className="flex justify-center mt-5">
              <Button type="submit" label={t("dashboard.Submit")} loading={isFormSubmitting} />
            </div>
          </form>
        </Sidebar>

        <Sidebar
          visible={bannerSidebar}
          style={{ width: "50%" }}
          onHide={() => setBannerSidebar(false)}
          position="right"
        >
          <UpdateBanner
            closeBanner={closeBanner}
            BannerupdateID={bannerupdateID}
          />
        </Sidebar>
      </div>
    </>
  );
};

export default Banner;
