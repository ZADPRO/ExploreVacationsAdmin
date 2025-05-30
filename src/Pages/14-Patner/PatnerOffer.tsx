import { Toast } from "primereact/toast";
import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { decryptAPIResponse } from "../../utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Sidebar } from "primereact/sidebar";
import UpdatePatnerOffter from "./UpdatePatnerOffter";
import { useTranslation } from "react-i18next";



interface Offer {
  refOffersName: string;
  refOfferType: string;
  refDescription: string;
  refOfferValue: string;
  refCoupon: string;
  isActive: boolean | null;
}

const PatnerOffer: React.FC = () => {
  const { t } = useTranslation("global");
  const toast = useRef<Toast>(null);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const [offer, setOffer] = useState<Offer[]>([]);
  const [_editPatnerId, setEditPatnerId] = useState<number | null>(null);
  const [offerUpdatesidebar, setOfferUpdatesidebar] = useState(false);
  const [offerupdateID, setOfferupdateID] = useState("");
  const closeOfferupdatesidebar = () => {
    setOfferUpdatesidebar(false);
  };

  const [formData, setFormData] = useState<Offer>({
    refOffersName: "",
    refOfferType: "",
    refDescription: "",
    refOfferValue: "",
    refCoupon: "",
    isActive: null,
  });

  //add patneroffer

  const AddOfferPatner = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/addOffers",
        {
          refOffersName: formData.refOffersName,
          refOfferType: formData.refOfferType,
          refDescription: formData.refDescription,
          refOfferValue: formData.refOfferValue,
          refCoupon: formData.refCoupon,
          isActive: formData.isActive,
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
      if (data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });

        localStorage.setItem("token", "Bearer " + data.token);
        setFormData({
          refOffersName: "",
          refOfferType: "",
          refDescription: "",
          refOfferValue: "",
          refCoupon: "",
          isActive: null,
        });
        fetchOfferPatner();
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding offer Patner",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding staff:", e);
      setSubmitLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleInput2 = (e: any) => {
    const { name, value } = e.target
      ? e.target
      : { name: e.originalEvent.target.name, value: e.value };
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleRadioChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: value,
    }));
  };

  useEffect(() => {
    fetchOfferPatner();
  }, []);

  //list patner

  const fetchOfferPatner = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/partnerRoutes/listOffers",
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
      console.log("data -----fetchOfferPatner", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchOfferPatner------>", data);
        setOffer(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching patner:", e);
    }
  };
  // delete

  const deletePatnerOffer = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/deleteOffers",
        {
          refOffersId: id,
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
        fetchOfferPatner();
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
      setEditPatnerId(null);
    }
  };

  const actionDeleteOffer = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deletePatnerOffer(rowData.refOffersId)}
      />
    );
  };

  const fetchSingleIDOffer = async (offerupdateID: string) => {
    console.log("Fetching data for update patner:", offerupdateID);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/getOffers",
        {
          refOffersId: offerupdateID,
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
      }
    } catch (e) {
      console.error("Error fetching tour data:", e);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          AddOfferPatner();
        }}
        action="post"
      >
        <div className="flex flex-col items-center justify-center gap-4 w-[100%]">
          <div className="flex flex-row w-[100%] gap-4 sm:w-full">
            <InputText
              name="refOffersName"
              value={formData.refOffersName}
              onChange={handleInput}
              placeholder="Enter Offer Name"
              className="p-inputtext-sm w-full"
            />
            <InputText
              name="refOfferValue"
              value={formData.refOfferValue}
              onChange={handleInput}
              placeholder="Enter Offer Value"
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="flex flex-row w-[100%] gap-4 sm:w-full">
            <Dropdown
              name="refOfferType"
              value={formData.refOfferType}
              options={[
                { label: "Percentage", value: "Percentege" },
                { label: "Flat", value: "Flat" },
              ]}
              onChange={handleInput2}
              placeholder="Select Offer Type"
              className="w-full"
              required
            />
          </div>
          <div className="flex flex-row w-[100%] gap-4 mb-5 sm:w-full">
            <InputText
              name="refDescription"
              value={formData.refDescription}
              onChange={handleInput}
              placeholder="Enter Description"
              className="p-inputtext-sm w-full"
            />
            <InputText
              name="refCoupon"
              value={formData.refCoupon}
              onChange={handleInput}
              placeholder="Enter Coupon Code"
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="flex gap-4 align-items-center">
            <div className="flex align-items-center">
              <RadioButton
                inputId="active"
                name="isActive"
                value={true}
                onChange={() => handleRadioChange(true)}
                checked={formData.isActive === true}
              />
              <label htmlFor="active" className="ml-2">
                Active
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="inactive"
                name="isActive"
                value={false}
                onChange={() => handleRadioChange(false)}
                checked={formData.isActive === false}
              />
              <label htmlFor="inactive" className="ml-2">
                InActive
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <Button type="submit" label="Submit" />
        </div>
      </form>

      <div className="mt-3 p-2">
        <h3 className="text-lg font-bold">{t("dashboard.Added Offer")}</h3>
        <DataTable
          value={offer}
          scrollable
          style={{ width: "700px" }}
          paginator
          rows={3}
        >
          <Column
            header={t("dashboard.SNo")} // <-- use translation here
            headerStyle={{ width: "3rem" }}
            body={(_, options) => options.rowIndex + 1}
          />
          <Column
            className="underline text-[#0a5c9c] cursor-pointer"
            headerStyle={{ width: "25rem" }}
            field="refOffersName"
            header={t("dashboard.OffersName")} // if you want to translate other headers too
            body={(rowData) => (
              <div
                onClick={() => {
                  setOfferupdateID(rowData.refOffersId);
                  setOfferUpdatesidebar(true);
                  fetchSingleIDOffer(rowData.refOffersId);
                }}
              >
                {rowData.refOffersName}
              </div>
            )}
          />
          <Column
            headerStyle={{ width: "15rem" }}
            field="refCoupon"
            header={t("dashboard.Coupon")}
          />
          <Column
            headerStyle={{ width: "15rem" }}
            field="refOfferType"
            header={t("dashboard.OfferType")}
          />
          <Column
            headerStyle={{ width: "15rem" }}
            field="refOfferValue"
            header={t("dashboard.Value")}
          />
          <Column
            headerStyle={{ width: "15rem" }}
            header={t("dashboard.Status")}
            body={(rowData) => (
              <span
                className={`font-semibold ${
                  rowData.isActive ? "text-[#009f10]" : "text-[#c20000]"
                }`}
              >
                {rowData.isActive
                  ? t("dashboard.Active")
                  : t("dashboard.InActive")}
              </span>
            )}
          />
          <Column
            headerStyle={{ width: "15rem" }}
            field="refDescription"
            header={t("dashboard.Description")}
          />
          <Column body={actionDeleteOffer} header={t("dashboard.Delete")} />
        </DataTable>
      </div>
      <Sidebar
        visible={offerUpdatesidebar}
        style={{ width: "50%" }}
        onHide={() => setOfferUpdatesidebar(false)}
        position="right"
      >
        <UpdatePatnerOffter
          closeOfferupdatesidebar={closeOfferupdatesidebar}
          OfferpatnerupdateID={offerupdateID}
        />
      </Sidebar>
    </div>
  );
};

export default PatnerOffer;
