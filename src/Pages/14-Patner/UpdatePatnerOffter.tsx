import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { decryptAPIResponse } from "../../utils";

interface OfferUpdateProps {
  closeOfferupdatesidebar: () => void;
  OfferpatnerupdateID: string;
}

interface Offer {
  refOffersId: string;
  refOffersName: string;
  refOfferType: string;
  refDescription: string;
  refOfferValue: string;
  refCoupon: string;
  isActive: boolean | null;
}
const UpdatePatnerOffter: React.FC<OfferUpdateProps> = ({
  closeOfferupdatesidebar,
  OfferpatnerupdateID,
}) => {
  const toast = useRef<Toast>(null);
  const [selectedOfferype, setSelectedOfferType] = useState(null);
  const [formData, setFormData] = useState<Offer>({
    refOffersId: "",
    refOffersName: "",
    refOfferType: "",
    refDescription: "",
    refOfferValue: "",
    refCoupon: "",
    isActive: null,
  });

  const fetchSingleIDOffer = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/getOffers",
        {
          refOffersId: OfferpatnerupdateID,
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

        setFormData({
          refOffersId: data.result[0].refOffersId,
          refOffersName: data.result[0].refOffersName,
          refOfferType: data.result[0].refOfferType,

          refDescription: data.result[0].refDescription,
          refOfferValue: data.result[0].refOfferValue,
          refCoupon: data.result[0].refCoupon,
          isActive: data.result[0].isActive,
        });
      }
      setSelectedOfferType(data.result[0].refOfferType);
    } catch (e) {
      console.error("Error fetching tour data:", e);
    }
  };

  useEffect(() => {
    fetchSingleIDOffer();
    fetchOfferPatner();
  }, []);

  //update

  const UpdateOfferPatner = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/updateOffers",
        {
          refOffersId: formData.refOffersId,
          refOffersName: formData.refOffersName,
          refOfferType: selectedOfferype,
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
          refOffersId: "",
          refOffersName: "",
          refOfferType: "",
          refDescription: "",
          refOfferValue: "",
          refCoupon: "",
          isActive: null,
        });
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
    }
  };

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

        UpdateOfferPatner();
      }
    } catch (e: any) {
      console.log("Error fetching patner:", e);
    }
  };

  return (
    <div className="mt-5">
      <p className="mb-5">Update Offer Id : {OfferpatnerupdateID}</p>
      <Toast ref={toast} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          UpdateOfferPatner();
        }}
        action="post"
      >
        <div className="flex flex-col items-center justify-center gap-4 w-[100%]">
          <div className="flex flex-row w-[100%] gap-4 sm:w-full">
            <InputText
              name="refOffersName"
              value={formData.refOffersName}
              onChange={(e: any) => {
                console.log(e.target.value);
                setFormData({ ...formData, refOffersName: e.target.value });
              }}
              placeholder="Enter Offer Name"
              className="p-inputtext-sm w-full"
            />
            <InputText
              name="refOfferValue"
              value={formData.refOfferValue}
              onChange={(e: any) => {
                console.log(e.target.value);
                setFormData({ ...formData, refOfferValue: e.target.value });
              }}
              placeholder="Enter Offer Value"
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="flex flex-row w-[100%] gap-4 sm:w-full">
            <Dropdown
              name="refOfferType"
              value={formData.refOfferType}
              options={[
                { label: "Percentage", value: "Percentage" },
                { label: "Flat", value: "Flat" },
              ]}
              placeholder="Select Offer Type"
              className="w-full"
              onChange={(e: DropdownChangeEvent) => {
                setSelectedOfferType(e.value);
                setFormData({ ...formData, refOfferType: e.value });
              }}
              required
            />
          </div>
          <div className="flex flex-row w-[100%] gap-4 mb-5 sm:w-full">
            <InputText
              name="refDescription"
              placeholder="Enter Description"
              value={selectedOfferype}
              onChange={(e: any) => {
                console.log(e.target.value);
                setFormData({ ...formData, refDescription: e.targetvalue });
              }}
              className="p-inputtext-sm w-full"
            />
            <InputText
              name="refCoupon"
              placeholder="Enter Coupon Code"
              value={formData.refCoupon}
              onChange={(e: any) => {
                console.log(e.target.value);
                setFormData({ ...formData, refCoupon: e.targetvalue });
              }}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="flex gap-4 align-items-center">
            <div className="flex align-items-center">
              <RadioButton
                inputId="active"
                name="isActive"
                checked={formData.isActive === true}
                onChange={() => setFormData({ ...formData, isActive: true })}
              />

              <label htmlFor="active" className="ml-2">
                Active
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="inactive"
                checked={formData.isActive === false}
                onChange={() => setFormData({ ...formData, isActive: false })}
              />
              <label htmlFor="inactive" className="ml-2">
                InActive
              </label>
            </div>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            label="Submit"
            className="mt-3 flex  "
            onClick={closeOfferupdatesidebar}
          />
        </div>
      </form>
    </div>
  );
};

export default UpdatePatnerOffter;
