import React from "react";
import { decryptAPIResponse } from "../../utils";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface PaterUpdateProps {
  closePaterupdatesidebar: () => void;
  patnerupdateID: string;
}
interface Offer {
  refOfferType: string;
  refOffersId: string;
}

const UpdatePatner: React.FC<PaterUpdateProps> = ({
  closePaterupdatesidebar,
  patnerupdateID,
}) => {
  const toast = useRef<Toast>(null);
  const [offer, setOffer] = useState<Offer[]>([]);
  const [inputs, setInputs] = useState({
    refuserId: "",
    refFName: "",
    refLName: "",
    refDOB: "",
    refMoblile: "",
    refUserEmail: "",
    refOffersId: "",
  });

  // updatedata

  const Updatepatner = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/updatePartner",
        {
          refuserId: inputs.refuserId,
          refFName: inputs.refFName,
          refLName: inputs.refLName,
          refDOB: inputs.refDOB,
          refMoblile: inputs.refMoblile,
          refOffersId: inputs.refOffersId,
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
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Patner",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding staff:", e);
    }
  };

  const fetchSingleIDPatnerdataForm = async () => {
    console.log("Fetching data for update patner:", patnerupdateID);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/getPartners",
        {
          userId: patnerupdateID,
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
        setInputs({
          refuserId: data.result[0].refuserId,
          refFName: data.result[0].refFName,
          refLName: data.result[0].refLName,
          refDOB: data.result[0].refDOB,
          refMoblile: data.result[0].refMoblile,
          refUserEmail: data.result[0].refUserEmail,
          refOffersId: data.result[0].refOffersId,
        });
      }
    } catch (e) {
      console.error("Error fetching tour data:", e);
    }
  };

  useEffect(() => {
    fetchSingleIDPatnerdataForm();
    fetchOffer();
  }, []);

  const fetchOffer = async () => {
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
      console.log("data ---------->fetchOffer", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchOffer", data);
        setOffer(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching offer:", e);
    }
  };

  return (
    <div>
      <div className="mt-5">
        <p className="mb-5 font-bold">Update Patner Id : {patnerupdateID}</p>
         <p className="text-sm text-[#f60000] mt-2 mb-5">
            Please fill in the details below in English. *
          </p>
        <Toast ref={toast} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            Updatepatner();
          }}
          action="post"
        >
          <div className="flex flex-col items-center justify-center gap-4 w-[100%]">
            <div className="flex flex-row w-[100%] gap-4 sm:w-full">
              <InputText
                name="refFName"
                value={inputs.refFName}
                onChange={(e: any) =>
                  setInputs({ ...inputs, refFName: e.target.value })
                }
                placeholder="Enter  First Name"
                className="p-inputtext-sm w-full"
              />
              <InputText
                name="refLName"
                placeholder="Enter Last Name"
                value={inputs.refLName}
                onChange={(e: any) =>
                  setInputs({ ...inputs, refLName: e.target.value })
                }
                className="p-inputtext-sm w-full"
              />
            </div>

            <div className="flex flex-row w-[100%] gap-4 sm:w-full">
              <Calendar
                name="refDOB"
                placeholder="Enter Date of Birth"
                value={new Date(inputs.refDOB)}
                onChange={(e: any) =>
                  setInputs({ ...inputs, refDOB: e.target.value })
                }
              />
              <InputText
                name="refMoblile"
                value={inputs.refMoblile}
                onChange={(e: any) =>
                  setInputs({ ...inputs, refMoblile: e.target.value })
                }
                placeholder="Enter Mobile"
                className="p-inputtext-sm w-full"
              />
            </div>
            <div className="flex flex-row w-[100%] gap-4 mb-5 sm:w-full">
              <Dropdown
                value={inputs.refOffersId}
                onChange={(e: DropdownChangeEvent) => {
                  console.log("valuee--------", e.value);
                  setInputs((prev) => ({
                    ...prev,
                    refOffersId: e.value,
                  }));
                }}
                optionValue="refOffersId"
                optionLabel="refOffersName"
                placeholder="Choose a Offer"
                className="w-full"
                options={offer}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              label="Submit"
              onClick={closePaterupdatesidebar}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePatner;
