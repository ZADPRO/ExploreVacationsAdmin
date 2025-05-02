import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";

type DecryptResult = any;

const UserDetails: React.FC = () => {
  const decrypt = (
    encryptedData: string,
    iv: string,
    key: string
  ): DecryptResult => {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
    });

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };
  const [UserDetail, setTourDetail] = useState<any[]>([]);
  const [TourBooking, setTourBooking] = useState<any[]>([]);
  const [CarBookings, setCarBookings] = useState<any[]>([]);
  const [parking, setParking] = useState<any[]>([]);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const [_editCustomizeId, setEditCustomizeId] = useState<number | null>(null);
  const [_editTourId, setEditTourId] = useState<number | null>(null);
  const [approvedTourIds, setApprovedTourIds] = useState<number[]>([]);

  const [_editCarId, setEditCarId] = useState<number | null>(null);
  const [_editParkingId, setEditParkingId] = useState<number | null>(null);

  const fetchCustomize = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listCustomizeTourBookings",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data-------------->Customise", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setTourDetail(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching customise:", e);
    }
  };

  const fetchTourBookings = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listTourBookings",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data-------------->listTourBookings", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setTourBooking(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching customise:", e);
    }
  };
  const fetchCarBookings = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listCarBookings",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data-------------->Customise", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setCarBookings(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching customise:", e);
    }
  };

  const fetchParkingBookings = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listParkingBookings",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data-------------->ParkingBookings", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setParking(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching customise:", e);
    }
  };

  useEffect(() => {
    fetchCustomize();
    fetchTourBookings();
    fetchCarBookings();
    fetchParkingBookings();
  }, []);

  // customize
  const actionDeleteCustomize = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteCustomize(rowData.customizeTourBookingId)}
      />
    );
  };

  const deleteCustomize = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL +
          "/adminRoutes/deleteCustomizeTourBookings",
        {
          customizeTourBookingId: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchCarBookings();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error delete package:", e);
      setSubmitLoading(false);
      setEditCustomizeId(null);
    }
  };
  // aprove

  const actionReadCustomize = (rowData: any) => {
    const isApproved = rowData.refStatus === "Approved"; // Check if it's already approved

    return (
      <div className="flex items-center gap-2">
        <button
          className={`${
            isApproved ? "bg-[#1da750]" : "bg-[#ffcb28] hover:bg-[#ffc928b9]"
          } text-white py-1 px-2 rounded`}
          onClick={() => {
            if (!isApproved) {
              readCustomizr(rowData.refuserId); // Call readTour to approve it
            }
          }}
          disabled={isApproved} // Disable the button if already approved
        >
          {isApproved ? "Approved" : "Approve"}{" "}
          {/* Show "Approved" if already approved */}
        </button>
      </div>
    );
  };

  const readCustomizr = async (refuserId: any) => {
    console.log("Approving booking with ID:", refuserId);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL +
          "/bookingRoutes/approveCustomizeTourBooking",
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

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        const updatedTourCustomize = UserDetail.map((tour) =>
          tour.refuserId === refuserId
            ? { ...tour, refStatus: "Approved" }
            : tour
        );
        setTourDetail(updatedTourCustomize);
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error approving booking:", e);
    }
  };
  //Car

  const actionDeleteCar = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteCar(rowData.userCarBookingId)}
      />
    );
  };

  const deleteCar = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/deleteCarBookings",
        {
          userCarBookingId: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchCarBookings();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error delete package:", e);
      setSubmitLoading(false);
      setEditCarId(null);
    }
  };


//Car update
const readCar = async (refuserId: any) => {
  console.log("Approving booking with ID:", refuserId);
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + "/bookingRoutes/approveCarBooking",
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

    const data = decrypt(
      response.data[1],
      response.data[0],
      import.meta.env.VITE_ENCRYPTION_KEY
    );
    console.log("API Response:", data);

    if (data.success) {
      localStorage.setItem("token", "Bearer " + data.token);

      const updatedCarBooking = CarBookings.map((tour) =>
        tour.refuserId === refuserId
          ? { ...tour, refStatus: "Approved" }
          : tour
      );
      setCarBookings(updatedCarBooking);
    } else {
      console.error("API update failed:", data);
    }
  } catch (e) {
    console.error("Error approving booking:", e);
  }
};

const actionReadCar = (rowData: any) => {
  const isApproved = rowData.refStatus === "Approved"; // Check if it's already approved

  return (
    <div className="flex items-center gap-2">
      <button
        className={`${
          isApproved ? "bg-[#1da750]" : "bg-[#ffcb28] hover:bg-[#ffc928b9]"
        } text-white py-1 px-2 rounded`}
        onClick={() => {
          if (!isApproved) {
            readCar(rowData.refuserId); // Call readTour to approve it
          }
        }}
        disabled={isApproved} // Disable the button if already approved
      >
        {isApproved ? "Approved" : "Approve"}{" "}
        {/* Show "Approved" if already approved */}
      </button>
    </div>
  );
};








  //Tour

  const actionDeleteTour = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteTour(rowData.userTourBookingId)}
      />
    );
  };

  const deleteTour = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/deleteTourBookings",
        {
          userTourBookingId: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchTourBookings();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error delete package:", e);
      setSubmitLoading(false);
      setEditTourId(null);
    }
  };
  const readTour = async (refuserId: any) => {
    console.log("Approving booking with ID:", refuserId);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/bookingRoutes/approveTourBooking",
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

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        const updatedTourBooking = TourBooking.map((tour) =>
          tour.refuserId === refuserId
            ? { ...tour, refStatus: "Approved" }
            : tour
        );
        setTourBooking(updatedTourBooking);
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error approving booking:", e);
    }
  };

  const actionReadTour = (rowData: any) => {
    const isApproved = rowData.refStatus === "Approved"; // Check if it's already approved

    return (
      <div className="flex items-center gap-2">
        <button
          className={`${
            isApproved ? "bg-[#1da750]" : "bg-[#ffcb28] hover:bg-[#ffc928b9]"
          } text-white py-1 px-2 rounded`}
          onClick={() => {
            if (!isApproved) {
              readTour(rowData.refuserId); // Call readTour to approve it
            }
          }}
          disabled={isApproved} // Disable the button if already approved
        >
          {isApproved ? "Approved" : "Approve"}{" "}
          {/* Show "Approved" if already approved */}
        </button>
      </div>
    );
  };

  //Parking

  const actionDeleteParking = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteParking(rowData.carParkingBookingId)}
      />
    );
  };

  const deleteParking = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/deleteCarParkingBookings",
        {
          carParkingBookingId: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchTourBookings();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error delete package:", e);
      setSubmitLoading(false);
      setEditParkingId(null);
    }
  };
  //update

  const readParking = async (refuserId: any) => {
    console.log("Approving booking with ID:", refuserId);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/bookingRoutes/approveParkingBooking",
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

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        const updatedParking = parking.map((tour) =>
          tour.refuserId === refuserId
            ? { ...tour, refStatus: "Approved" }
            : tour
        );
        setParking(updatedParking);
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error approving booking:", e);
    }
  };

  const actionReadParking = (rowData: any) => {
    const isApproved = rowData.refStatus === "Approved"; // Check if it's already approved

    return (
      <div className="flex items-center gap-2">
        <button
          className={`${
            isApproved ? "bg-[#1da750]" : "bg-[#ffcb28] hover:bg-[#ffc928b9]"
          } text-white py-1 px-2 rounded`}
          onClick={() => {
            if (!isApproved) {
              readParking(rowData.refuserId); // Call readTour to approve it
            }
          }}
          disabled={isApproved} // Disable the button if already approved
        >
          {isApproved ? "Approved" : "Approve"}{" "}
          {/* Show "Approved" if already approved */}
        </button>
      </div>
    );
  };

  const formatDate = (rowData: any) => {
    if (!rowData.refPickupDate) return ""; // Handle empty values
    const date = new Date(rowData.refPickupDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  return (
    <div className="p-10 mt-0">
      <h2 className="text-2xl font-semibold">User Details</h2>
      <TabView>
        <TabPanel header="Customize Tour Details">
          <div className="mt-1 p-2 ">
            <h3 className="text-lg font-bold mb-4">Customize TourBookings</h3>
            <DataTable
              value={UserDetail}
              paginator
              rows={2}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header="S.No"
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              ></Column>

              <Column
                field="refPackageName"
                header="Package Name"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refUserName"
                header="User Name"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header="User Email"
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refUserMobile"
                header="User Mobile"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refArrivalDate"
                header="Arrival Date"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refSingleRoom"
                header="Single Room"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refTwinRoom"
                header="Twin Room"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refTripleRoom"
                header="Triple Room"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refAdultCount"
                header="Adult Count"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refChildrenCount"
                header="Children Count"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refVaccinationType"
                header="Vaccination Type"
                style={{ minWidth: "200px" }}
              />
              {/* <Column
                field="refVaccinationCertificate"
                header="Vaccination Certificate"
                style={{ minWidth: "250px" }}
              /> */}
              <Column
                field="refOtherRequirements"
                header="Other Requirements"
                style={{ minWidth: "300px" }}
              />
              {/* <Column body={actionReadCustomize} header="Read" /> */}
              <Column body={actionDeleteCustomize} header="Delete" />
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel header="TourBookings">
          <div className=" ">
            <h3 className="text-lg font-bold">Added TourBookings</h3>
            <DataTable
              paginator
              rows={2}
              value={TourBooking}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header="S.No"
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              ></Column>
              <Column
                field="refuserId"
                header="USer Id"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refPackageName"
                header="Package Name"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refDurationIday"
                header="No of Days"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refDurationINight"
                header="No of Nights"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refGroupSize"
                header="Group Size"
                style={{ minWidth: "150px" }}
                body={(rowData) => {
                  const adultCount = Number(rowData.refAdultCount) || 0;
                  const childrenCount = Number(rowData.refChildrenCount) || 0;
                  const infantCount = Number(rowData.refInfants) || 0;
                  return <>{adultCount + childrenCount + infantCount}</>;
                }}
              />
              <Column
                field="refTourPrice"
                header="Tour Price ($)"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refSeasonalPrice"
                header="Seasonal Price ($)"
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refLocationName"
                header="Location"
                style={{ minWidth: "200px" }}
                body={(rowData) => rowData.refLocationName?.join(", ")}
              />
              <Column
                field="Activity"
                header="Activity"
                style={{ minWidth: "250px" }}
                body={(rowData) => rowData.Activity?.join(", ")}
              />
              <Column
                field="refUserName"
                header="Booked By"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header="User Email"
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refUserMobile"
                header="Mobile"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refPickupDate"
                header="Pickup Date"
                body={formatDate}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refAdultCount"
                header="Adults"
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refChildrenCount"
                header="Children"
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refInfants"
                header="Infants"
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refOtherRequirements"
                header="Other Requirements"
                style={{ minWidth: "300px" }}
              />
              {/* <Column body={actionReadTour} header="Read" /> */}
              <Column body={actionDeleteTour} header="Delete" />
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel header="CarBookings">
          <div className="mt-2 p-1  ">
            <h3 className="text-lg font-bold mb-4">Added CarBookings</h3>
            <DataTable
              paginator
              rows={2}
              value={CarBookings}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header="S.No"
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />
              <Column
                field="refUserName"
                header="User Name"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header="User Email"
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refUserMobile"
                header="Mobile"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refPickupAddress"
                header="Pickup Address"
                style={{ minWidth: "300px" }}
              />
              <Column
                field="refSubmissionAddress"
                header="Submission Address"
                style={{ minWidth: "300px" }}
              />
              <Column
                field="refPickupDate"
                header="Pickup Date"
                style={{ minWidth: "200px" }}
              />
              {/* <Column
                field="refVehicleTypeId"
                header="Vehicle Type"
                body={(rowData) =>
                  vehicleTypes[rowData.refVehicleTypeId] || "Unknown"
                }
                style={{ minWidth: "150px" }}
              /> */}
              <Column
                field="refAdultCount"
                header="Adults"
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refChildrenCount"
                header="Children"
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refInfants"
                header="Infants"
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refOtherRequirements"
                header="Other Requirements"
                style={{ minWidth: "300px" }}
              />
              {/* <Column
                field="refFormDetails"
                header="Form Details"
                body={(rowData) => rowData.refFormDetails.join(", ")}
                style={{ minWidth: "200px" }}
              /> */}
                {/* <Column body={actionReadCar} header="Read" /> */}
              <Column body={actionDeleteCar} header="Delete" />
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel header="Booked Parking">
          <div className="mt-2 p-1  ">
            <h3 className="text-lg font-bold mb-4">Added Parking</h3>
            <DataTable
              paginator
              rows={2}
              value={parking}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header="S.No"
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />
              <Column
                field="refParkingName"
                header="Parking Name"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refParkingTypeName"
                header="ParkingType"
                style={{ minWidth: "250px" }}
              />
              <Column
                field="travelStartDate"
                header="Start Date"
                style={{ minWidth: "200px" }}
                body={(rowData) =>
                  rowData.travelStartDate
                    ? new Date(rowData.travelStartDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />
              <Column
                field="travelEndDate"
                header="End Date"
                style={{ minWidth: "300px" }}
                body={(rowData) =>
                  rowData.travelEndDate
                    ? new Date(rowData.travelEndDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />

              <Column
                field="VehicleModel"
                header="Vehicle Model"
                style={{ minWidth: "100px" }}
              />
              <Column
                field="HandoverPersonEmail"
                header="Handover PersonEmail"
                style={{ minWidth: "300px" }}
              />
              <Column
                field="HandoverPersonName"
                header="Handover PersonName"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="HandoverPersonPhone"
                header="Handover PersonPhone"
                style={{ minWidth: "100px" }}
              />
              {/* <Column body={actionReadParking} header="Read" /> */}
              <Column body={actionDeleteParking} header="Delete" />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default UserDetails;
