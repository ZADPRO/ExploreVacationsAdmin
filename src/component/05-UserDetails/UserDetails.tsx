import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { TabPanel, TabView } from "primereact/tabview";

type DecryptResult = any;

interface UserDetail {}

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
  const [_UserDetail, setTourDetail] = useState<UserDetail[]>([]);
  const [TourBooking, setTourBooking] = useState<any[]>([]);
  const [CarBookingqs, setCarBookings] = useState<any[]>([]);
  // const packageDetails = [
  //   {
  //     refPackageId: 1,
  //     refPackageName: "Tropical Paradise",
  //     refDurationIday: 5,
  //     refDurationINight: 4,
  //     refGroupSize: 10,
  //     refTourPrice: 1500,
  //     refSeasonalPrice: 1400,
  //     refLocation: "Hawaii",
  //     refActivity: "Snorkeling, Hiking",
  //     refUserName: "John Doe",
  //     refUserMail: "johndoe@example.com",
  //     refUserMobile: "+1234567890",
  //     refPickupDate: "2025-04-01",
  //     refAdultCount: 2,
  //     refChildrenCount: 1,
  //     refInfants: 0,
  //     refOtherRequirements: "Vegetarian meal required",
  //   },
  //   {
  //     refPackageId: 2,
  //     refPackageName: "European Adventure",
  //     refDurationIday: 7,
  //     refDurationINight: 6,
  //     refGroupSize: 15,
  //     refTourPrice: 2500,
  //     refSeasonalPrice: 2300,
  //     refLocation: "France, Italy, Spain",
  //     refActivity: "Sightseeing, Wine Tasting",
  //     refUserName: "Jane Smith",
  //     refUserMail: "janesmith@example.com",
  //     refUserMobile: "+9876543210",
  //     refPickupDate: "2025-05-10",
  //     refAdultCount: 1,
  //     refChildrenCount: 0,
  //     refInfants: 1,
  //     refOtherRequirements: "Wheelchair assistance",
  //   },
  // ];

  // const vehicleTypes = {
  //   1: "Sedan",
  //   2: "SUV",
  //   3: "Minivan",
  //   4: "Luxury",
  // };

  // const CarBookings = [
  //   {
  //     refUserName: "John Doe",
  //     refUserMail: "johndoe@example.com",
  //     refUserMobile: "+1234567890",
  //     refPickupAddress: "123 Main Street, NY",
  //     refSubmissionAddress: "456 Elm Street, NY",
  //     refPickupDate: "2025-04-01",
  //     refVehicleTypeId: 3,
  //     refAdultCount: 2,
  //     refChildrenCount: 1,
  //     refInfants: 0,
  //     refOtherRequirements: "Need a baby seat",
  //     refFormDetails: [1, 2, 3],
  //   },
  //   {
  //     refUserName: " Smith john",
  //     refUserMail: "smithjohn@example.com",
  //     refUserMobile: "+9876543210",
  //     refPickupAddress: "789 Oak Street, CA",
  //     refSubmissionAddress: "321 Pine Street, CA",
  //     refPickupDate: "2025-04-05",
  //     refVehicleTypeId: 2,
  //     refAdultCount: 1,
  //     refChildrenCount: 2,
  //     refInfants: 1,
  //     refOtherRequirements: "Stroller space needed",
  //     refFormDetails: [4, 5],
  //   },
  // ];

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

  useEffect(() => {
    fetchCustomize();
    fetchTourBookings();
    fetchCarBookings();
  }, []);
  return (
    <div className="p-10 mt-0">
      <h2 className="text-2xl font-semibold">User Details</h2>
      <TabView>
        {/* <TabPanel header="Tour Form Details">
          <div className="mt-4 p-2 ">
            <h3 className="text-lg font-bold mb-4">Customize TourBookings</h3>
            <DataTable value={UserDetail} tableStyle={{ minWidth: "50rem" }}>
              <Column
                header="S.No"
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              ></Column>

              <Column
                field="refPackageId"
                header="Package ID"
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
              <Column
                field="refVaccinationCertificate"
                header="Vaccination Certificate"
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refOtherRequirements"
                header="Other Requirements"
                style={{ minWidth: "300px" }}
              />
            </DataTable>
          </div>
        </TabPanel> */}
        <TabPanel header="TourBookings">
          <div className=" ">
            <h3 className="text-lg font-bold">Added TourBookings</h3>
            <DataTable
              paginator
              rows={4}
              value={TourBooking}
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
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel header="CarBookings">
          <div className="mt-2 p-1  ">
            <h3 className="text-lg font-bold mb-4">Added CarBookings</h3>
            <DataTable
              paginator
              rows={4}
              value={CarBookingqs}
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
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default UserDetails;
