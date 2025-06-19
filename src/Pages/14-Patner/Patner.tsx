import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { decryptAPIResponse } from "../../utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import UpdatePatner from "../14-Patner/UpdatePatner";
import PatnerOffer from "./PatnerOffer";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";

interface Patner {
  refFName: String;
  refLName: String;
  refDOB: String;
  refMoblile: String;
  refUserEmail: String;
  refOffersId: String;
}

interface Offer {}

const Patner: React.FC = () => {
  const { t } = useTranslation("global");
  const [visible, setVisible] = useState(false);
  const toast = useRef<Toast>(null);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const [_editPatnerId, setEditPatnerId] = useState<number | null>(null);
  const [patner, setPatner] = useState<Patner[]>([]);
  const [_date, setDate] = useState<Nullable<Date>>(null);
  const [offer, setOffer] = useState<Offer[]>([]);
  const [airportBookings, setAirportBookings] = useState<any[]>([]);
  const [patnerupdatesidebar, setPatnerupdatesidebar] = useState(false);
  const [patnerupdateID, setPatnerupdateID] = useState("");
  const [selecteOffer, setSelectedOffer] = useState<any[]>([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);

  const closePaterupdatesidebar = () => {
    setPatnerupdatesidebar(false);
  };
  const [inputs, setInputs] = useState({
    refFName: "",
    refLName: "",
    refDOB: null as Date | null,
    refMoblile: "",
    refUserEmail: "",
    refOffersId: "",
  });
  const handleCalendarChange = (e: any) => {
    setInputs((prev) => ({
      ...prev,
      refDOB: e.value,
    }));
  };

  //add patner

  const Addpatner = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/addPartners",
        {
          refFName: inputs.refFName,
          refLName: inputs.refLName,
          refDOB: inputs.refDOB,
          refMoblile: inputs.refMoblile,
          refUserEmail: inputs.refUserEmail,
          refOffersId: selecteOffer,
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

        setVisible(false);
        fetchPatner();

        setInputs({
          refFName: "",
          refLName: "",
          refDOB: null,
          refMoblile: "",
          refUserEmail: "",
          refOffersId: "",
        });
        setDate(null);
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
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    fetchPatner();
    fetchOffer();
    fetchOfferPatner();
  }, []);

  //fetchoffer

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

  //list patner

  const fetchPatner = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/partnerRoutes/listPartners",
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
        console.log("listing the patner details------>", data);
        setPatner(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching patner:", e);
    }
  };

  const deletePatner = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/deletePartners",
        {
          refuserId: id,
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
        fetchPatner();
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
      setVisibleDialog(false);
      setSelectedBannerId(null);
    }
  };

  const actionDeletePatner = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        // onClick={() => deletePatner(rowData.refuserId)}
        onClick={() => {
          setSelectedBannerId(rowData.refuserId);
          setVisibleDialog(true);
        }}
      />
    );
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // updatedata

  const fetchSingleIDPatnerdataForm = async (patnerupdateID: string) => {
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
      }
    } catch (e) {
      console.error("Error fetching tour data:", e);
    }
  };

  //update Airport

  const readAirport = async (refuserId: any) => {
    console.log("Approving booking with ID:", refuserId);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/partnerRoutes/applyCoupon",
        {
          userId: refuserId,
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
        fetchPatner();

        const updatedAirportBooking = airportBookings.map((tour) =>
          tour.refuserId === refuserId
            ? { ...tour, refStatus: "Approved" }
            : tour
        );
        setAirportBookings(updatedAirportBooking);
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error approving booking:", e);
    }
  };

  const actionReadAirport = (rowData: any) => {
    const isApproved = rowData.refApplyCoupon === "Applied"; // Check if it's already approved

    return (
      <div className="flex items-center gap-2">
        <button
          className={`${
            isApproved ? "bg-[#1da750]" : "bg-[#ffcb28] hover:bg-[#ffc928b9]"
          } text-white py-1 px-2 rounded`}
          onClick={() => {
            if (!isApproved) {
              readAirport(rowData.refuserId); // Call readTour to approve it
            }
          }}
          disabled={isApproved} // Disable the button if already approved
        >
          {isApproved ? "Applied" : "Apply"}{" "}
          {/* Show "Approved" if already approved */}
        </button>
      </div>
    );
  };
  console.log("patnerupdateID-----------", patnerupdateID);

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

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {t("dashboard.Partner Module")}
          </h2>
          <Button
            label={t("dashboard.Add New Partner")}
            severity="success"
            onClick={() => setVisible(true)}
          />
        </div>

        <div className="mt-3 p-2">
          <h3 className="text-lg font-bold">
            {t("dashboard.Added Partner Package")}
          </h3>
          <DataTable
            value={patner}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            scrollable
            scrollHeight="500px"
            rows={5}
          >
            <Column
              header={t("dashboard.SNo")}
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              className="underline text-[#0a5c9c] cursor-pointer"
              headerStyle={{ maxWidth: "20rem" }}
              style={{ minWidth: "200px" }}
              field="refCustId"
              header={t("dashboard.StaffID")}
              body={(rowData) => (
                <div
                  onClick={() => {
                    setPatnerupdateID(rowData.refuserId);
                    setPatnerupdatesidebar(true);
                    fetchSingleIDPatnerdataForm(rowData.refuserId);
                  }}
                >
                  {rowData.refCustId}
                </div>
              )}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refFName"
              header={t("dashboard.First Name")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refLName"
              header={t("dashboard.LastName")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refMoblile"
              header={t("dashboard.Mobile")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refUserEmail"
              header={t("dashboard.Email")}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refOffersName"
              header={t("dashboard.OffersName")}
            />
            <Column
              className="cursor-pointer"
              body={actionReadAirport}
              header={t("dashboard.Apply")}
            />
            <Column body={actionDeletePatner} header={t("dashboard.Delete")} />
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
                  // loading={submitLoading}
                  onClick={() => {
                    if (selectedBannerId !== null) {
                      deletePatner(selectedBannerId);
                    }
                    setVisibleDialog(false);
                  }}
                />
              </div>
            }
          >
            <p>Are you sure you want to delete this banner?</p>
          </Dialog>
        </div>
      </div>
      <Sidebar
        visible={visible}
        style={{ width: "60%" }}
        onHide={() => setVisible(false)}
        position="right"
      >
        <Toast ref={toast} />
        <h2 className="text-xl font-bold mb-4">
          {t("dashboard.Add New Partner")}
        </h2>

        <p className="text-sm text-[#f60000] mt-3">{t("dashboard.warning")}</p>

        <TabView>
          <TabPanel header={t("dashboard.Add Partner")}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                Addpatner();
              }}
              action="post"
            >
              <div className="flex flex-col items-center justify-center gap-4 w-[100%]">
                <div className="flex flex-row w-[100%] gap-4 sm:w-full">
                  <InputText
                    name="refFName"
                    value={inputs.refFName}
                    onChange={handleInput}
                    placeholder="Enter  First Name"
                    className="p-inputtext-sm w-full"
                  />
                  <InputText
                    name="refLName"
                    value={inputs.refLName}
                    onChange={handleInput}
                    placeholder="Enter Last Name"
                    className="p-inputtext-sm w-full"
                  />
                </div>

                <div className="flex flex-row w-[100%] gap-4 sm:w-full">
                  <Calendar
                    name="refDOB"
                    value={inputs.refDOB}
                    onChange={handleCalendarChange}
                    placeholder="Enter Date of Birth"
                  />

                  <InputText
                    name="refMoblile"
                    value={inputs.refMoblile}
                    onChange={handleInput}
                    placeholder="Enter Mobile"
                    className="p-inputtext-sm w-full"
                  />
                </div>
                <div className="flex flex-row w-[100%] gap-4  sm:w-full">
                  <InputText
                    name="refUserEmail"
                    value={inputs.refUserEmail}
                    onChange={handleInput}
                    placeholder="Enter Email"
                    className="p-inputtext-sm w-full"
                  />
                </div>

                <div className="flex flex-row w-[100%] gap-4 mb-5 sm:w-full">
                  <Dropdown
                    value={selecteOffer}
                    onChange={(e: DropdownChangeEvent) => {
                      setSelectedOffer(e.value);
                      fetchOffer();
                    }}
                    options={offer}
                    optionValue="refOffersId"
                    optionLabel="refOffersName"
                    placeholder="Choose a Offer"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <Button type="submit" label="Submit" />
              </div>
            </form>
          </TabPanel>
          <TabPanel header={t("dashboard.Add Partner Offer")}>
            <PatnerOffer />
          </TabPanel>
        </TabView>
      </Sidebar>
      <Sidebar
        visible={patnerupdatesidebar}
        style={{ width: "50%" }}
        onHide={() => setPatnerupdatesidebar(false)}
        position="right"
      >
        <UpdatePatner
          closePaterupdatesidebar={closePaterupdatesidebar}
          patnerupdateID={patnerupdateID}
        />
      </Sidebar>
    </div>
  );
};

export default Patner;
