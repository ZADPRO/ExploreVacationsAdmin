import React, { useState, useEffect } from "react";
// import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { TiTickOutline } from "react-icons/ti";
import { decryptAPIResponse } from "../../utils";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
// import { format, toZonedTime } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const Userlist: React.FC = () => {
  const { t } = useTranslation("global");
  const [userlist, setUserlist] = useState<any[]>([]);
  const [viewuserlistID, setViewUserlistID] = useState("");
  const [userlistsidebar, setUserlistsidebar] = useState(false);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [_viewuser, setViewUser] = useState<any[]>([]);
  const [tourBooking, setTourBooking] = useState<any[]>([]);
  const [_customBooking, setCustomBooking] = useState<any[]>([]);
  const [carBooking, setCarBooking] = useState<any[]>([]);
  const [parkingBooking, setParkingBooking] = useState<any[]>([]);
  const [selectUserDetails, setSelectedUserDetails] = useState<number | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [_visibleDialog, setVisibleDialog] = useState(false);
  const [_submitLoading, setSubmitLoading] = useState(false);

  const [_editUserDetailsId, setEditUserDetailsId] = useState<number | null>(
    null
  );



  useEffect(() => {
    fetchUserlist();
  }, []);

  const fetchUserlist = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listUserData",
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
        localStorage.setItem("token", "Bearer " + data.token);
        setUserlist(data.userData);

        console.log("listUserData------", data);
      }
    } catch (e: any) {
      console.log("Error fetching listdata:", e);
    }
  };

  const fetchSinglelist = async (userId: string) => {
    console.log("userID", userId);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adminRoutes/getUserData`,
        { userId: userId },
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

      console.log("data---->staffdetails", data);

      if (data.success) {
        setViewUser(data.result);
        setTourBooking(data.tour);
        setCustomBooking(data.customizeTour);
        setCarBooking(data.car);
        setParkingBooking(data.parking);

        console.log("single fetchSinglelist-----------------:", data);
      } else {
        setError("Failed to fetch User details.");
      }
    } catch (err) {
      setError("Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUSer = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/deleteUsers",
        {
          userId: id,
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
        fetchUserlist();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error delete package:", e);
      setSubmitLoading(false);
      setEditUserDetailsId(null);
      setSelectedUserDetails(null);
      setVisibleDialog(false);
    }
  };
  const actionDeleteUser = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        // onClick={() => deleteUSer(rowData.offlineCarBookingId)}
        onClick={() => {
          console.log("rowData.offlineCarBookingId", rowData.refuserId);
          setShowDeleteConfirm(true);
          setSelectedUserDetails(rowData.refuserId);
          setVisibleDialog(true);
        }}
      />
    );
  };

  return (
    <>
      <div className="flex flex-col justify-between p-4">
        <h2 className="text-2xl font-semibold">
          {t("dashboard.User Profile Details")}
        </h2>
        <div className="flex flex-col gap-4 mt-4">
          <DataTable
            value={userlist}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            scrollable
            scrollHeight="500px"
            rows={4}
          >
            <Column
              header={t("dashboard.SNo")}
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              header={t("dashboard.CustomerID")}
              // headerStyle={{ width: "20rem" }}
              headerStyle={{ width: "40rem" }}
              bodyStyle={{ width: "40rem" }}
              className="underline text-[#0a5c9c] cursor-pointer"
              field="refCustId"
              body={(rowData) => (
                <div
                  onClick={() => {
                    setViewUserlistID(rowData.refuserId);
                    setUserlistsidebar(true);
                    fetchSinglelist(rowData.refuserId);
                  }}
                >
                  {rowData.refCustId}
                </div>
              )}
            />
            <Column
              header={t("dashboard.First Name")}
              field="refFName"
              headerStyle={{ width: "15rem" }}
            />
            <Column
              header={t("dashboard.Mobile")}
              field="refMoblile"
              headerStyle={{ width: "15rem" }}
            />
            <Column
              header={t("dashboard.Email")}
              field="refUserEmail"
              headerStyle={{ width: "15rem" }}
            />
            <Column
              field="refDOB"
              header={t("dashboard.DOB")}
              headerStyle={{ width: "15rem" }}
              body={(rowData) => {
                const date = new Date(rowData.refDOB);
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                const yyyy = date.getFullYear();
                return `${mm}/${dd}/${yyyy}`;
              }}
            />
            <Column
              header={t("dashboard.Address")}
              field="refUserAddress"
              headerStyle={{ width: "15rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
              body={(rowData) =>
                rowData.refUserAddress ? rowData.refUserAddress : "-"
              }
            />
            <Column
              header={t("dashboard.City")}
              field="refUserCity"
              headerStyle={{ width: "15rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
              body={(rowData) =>
                rowData.refUserCity ? rowData.refUserCity : "-"
              }
            />
            <Column
              header={t("dashboard.Country")}
              field="refUserCountry"
              headerStyle={{ width: "15rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
              body={(rowData) =>
                rowData.refUserCountry ? rowData.refUserCountry : "-"
              }
            />
            <Column
              header={t("dashboard.State")}
              field="refUserState"
              headerStyle={{ width: "15rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
              body={(rowData) =>
                rowData.refUserState ? rowData.refUserState : "-"
              }
            />
            <Column
              header={t("dashboard.ZipCode")}
              field="refUserZipCode"
              headerStyle={{ width: "15rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center" }}
              body={(rowData) =>
                rowData.refUserZipCode ? rowData.refUserZipCode : "-"
              }
            />
            <Column body={actionDeleteUser} header={t("dashboard.Delete")} />
          </DataTable>
          <Dialog
            header="Confirm Deletion"
            visible={showDeleteConfirm}
            style={{ width: "350px" }}
            modal
            onHide={() => setShowDeleteConfirm(false)}
            footer={
              <div className="flex justify-end gap-2">
                <Button
                  label="No"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() => setShowDeleteConfirm(false)}
                />
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  className="p-button-danger"
                  // loading={submitLoading}
                  onClick={() => {
                    if (selectUserDetails) {
                      console.log(selectUserDetails);
                      deleteUSer(selectUserDetails);
                    }
                    setShowDeleteConfirm(false);
                  }}
                />
              </div>
            }
          >
            <p>Are you sure you want to delete this tour package?</p>
          </Dialog>
        </div>

        <Sidebar
          visible={userlistsidebar}
          onHide={() => setUserlistsidebar(false)}
          position="right"
          style={{ width: "80%" }}
          header={t("dashboard.User Details")}
        >
          <h2 className="text-xl font-bold">
            {t("dashboard.User")} ID: {viewuserlistID}
          </h2>
          <h2 className="text-xl mt-3 font-bold">
            {t("dashboard.Tour Booking Details")}{" "}
          </h2>
          <div className="flex flex-col gap-4 mt-4">
            <DataTable
              value={tourBooking}
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
                headerStyle={{ width: "15rem" }}
                field="refTourCustID"
                header={t("dashboard.TourCustID")} // "Tour-Kunden-ID"
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refPackageName"
                header={t("dashboard.Package Name")} // "Paketname"
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refTourCode"
                header={t("dashboard.Tour Code")} // "Reisecode"
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refTourPrice"
                header={t("dashboard.Tour Price")} // "Preis"
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refDestinationName"
                header={t("dashboard.Destination")} // "Reiseziel"
              />
            </DataTable>
          </div>
         

          <h2 className="text-xl mt-3 font-bold">
            {t("dashboard.Car Booking Details")}
          </h2>
          <div className="flex flex-col gap-4 mt-4">
            <DataTable
              value={carBooking}
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
                headerStyle={{ width: "15rem" }}
                field="refCarCustId"
                header={t("dashboard.CarCustId")}
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refCarTypeName"
                header={t("dashboard.First Name")}
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refVehicleTypeName"
                header={t("dashboard.VehicleTypeName")}
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refcarManufactureYear"
                header={t("dashboard.Manufacture Year")}
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refStatus"
                header={t("dashboard.Status")}
              />

              <Column
                headerStyle={{ width: "15rem" }}
                field="refCarPrice"
                header={t("dashboard.Price")}
              />
            </DataTable>
          </div>
          <h2 className="text-xl mt-3 font-bold">
            {t("dashboard.Parking Booking Details")}
          </h2>
          <div className="flex flex-col gap-4 mt-4">
            <DataTable
              value={parkingBooking}
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
                headerStyle={{ width: "15rem" }}
                field="refParkingCustId"
                header={t("dashboard.ParkingCustId")}
              />
              <Column
                headerStyle={{ width: "15rem" }}
                field="refParkingName"
                header={t("dashboard.Parking Name")}
              />
              <Column
                headerStyle={{ width: "15rem" }}
                field="refParkingTypeName"
                header={t("dashboard.ParkingTypeName")}
              />
              <Column
                headerStyle={{ width: "15rem" }}
                field="refPrice"
                header={t("dashboard.Price")}
              />
              <Column
                headerStyle={{ width: "15rem" }}
                field="refLocation"
                header={t("dashboard.Location")}
              />
              <Column
                headerStyle={{ width: "15rem" }}
                field="refAvailability"
                header={t("dashboard.Availability")}
              />
              <Column
                headerStyle={{ width: "15rem" }}
                field="refBookingType"
                header={t("dashboard.BookingType")}
              />
            </DataTable>
          </div>
        </Sidebar>
      </div>
    </>
  );
};

export default Userlist;
