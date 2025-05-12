import React, { useState, useEffect } from "react";
// import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { TiTickOutline } from "react-icons/ti";
import { decryptAPIResponse } from "../../utils";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import { format, toZonedTime } from 'date-fns-tz';

const Userlist: React.FC = () => {
  const [userlist, setUserlist] = useState<any[]>([]);
  const [viewuserlistID, setViewUserlistID] = useState("");
  const [userlistsidebar, setUserlistsidebar] = useState(false);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [_viewuser, setViewUser] = useState<any[]>([]);
  const[tourBooking, setTourBooking] = useState<any[]>([]);
  const[customBooking, setCustomBooking] = useState<any[]>([]);
  const[carBooking, setCarBooking] = useState<any[]>([]);
  const[parkingBooking, setParkingBooking] = useState<any[]>([]);
 

  const formatSwissDate = (dateString:any) => {
    if (!dateString) return '';
    const swissTime = toZonedTime(new Date(dateString), 'Europe/Zurich');
    return format(swissTime, 'MM/dd/yyyy');
  };

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

  return (
    <>
      <div className="flex flex-col justify-between p-4">
        <h2 className="text-2xl font-semibold">User Profile Details</h2>
        <div className="flex flex-col gap-4 mt-4">
          <DataTable
            value={userlist}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={3}
          >
            <Column
              header="S.No"
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              headerStyle={{ width: "15rem" }}
              className="underline   text-[#0a5c9c]  cursor-pointer "
              field="refCustId"
              header="Customer ID"
              body={(rowData) => (
                <div
                  onClick={() => {
                    setViewUserlistID(rowData.refuserId);
                    setUserlistsidebar(true);
                    fetchSinglelist(rowData.refuserId);
                  }}
                >
                  {" "}
                  {rowData.refCustId}
                </div>
              )}
            />

            <Column
              headerStyle={{ width: "15rem" }}
              field="refFName"
              header="First Name"
            />
             <Column
              headerStyle={{ width: "15rem" }}
              field="refMoblile"
              header="Mobile"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refUserEmail"
              header="Email"
            />
          
            <Column
              field="refDOB"
              header="DOB"
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
              headerStyle={{ width: "15rem" }}
              field="refUserAddress"
              header="Address"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refUserCity"
              header="City"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refUserCountry"
              header="Country"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refUserState"
              header="State"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refUserZipCode"
              header="ZipCode"
            />
          </DataTable>
        </div>

        <Sidebar
          visible={userlistsidebar}
          onHide={() => setUserlistsidebar(false)}
          position="right"
          style={{ width: "80%" }}
          header="User Details"
        >
          <h2 className="text-xl font-bold">
            User ID: {viewuserlistID}
          </h2>
          <h2 className="text-xl mt-3 font-bold">
            Tour Booking Details
          </h2>
          <div className="flex flex-col gap-4 mt-4">
          <DataTable
            value={tourBooking}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={5}
          >
            <Column
              header="S.No"
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            
            <Column
              headerStyle={{ width: "15rem" }}
              field="refTourCustID"
              header="TourCustID"
            />
            
            <Column
              headerStyle={{ width: "15rem" }}
              field="refPackageName"
              header="Package Name"
            />
             <Column
              headerStyle={{ width: "15rem" }}
              field="refTourCode"
              header="Tour Code"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refTourPrice"
              header="Price"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refDestinationName"
              header="Destination"
            />
         
           
          </DataTable>
        </div>
        <h2 className="text-xl mt-3 font-bold">
            Customize Booking Details
          </h2>

        <div className="flex flex-col gap-4 mt-4">
        <DataTable
            value={customBooking}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={5}
          >
            <Column
              header="S.No"
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            
            <Column
              headerStyle={{ width: "15rem" }}
              field="refTourCustID"
              header="TourCustID"
            />
            
            <Column
              headerStyle={{ width: "15rem" }}
              field="refPackageName"
              header="Package Name"
            />
             <Column
              headerStyle={{ width: "15rem" }}
              field="refArrivalDate"
              header="Arrival Date"
              body={(rowdata)=>formatSwissDate(rowdata.refArrivalDate)} 
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refSingleRoom"
              header="Single Room"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refTwinRoom"
              header="Twin Room"
            />
             <Column
              headerStyle={{ width: "15rem" }}
              field="refTripleRoom"
              header="Triple Room"
            />
         
           
          </DataTable>
        </div>

        <h2 className="text-xl mt-3 font-bold">
            Car Booking Details
          </h2>
        <div className="flex flex-col gap-4 mt-4">
          <DataTable
            value={carBooking}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={5}
          >
            <Column
              header="S.No"
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              headerStyle={{ width: "15rem" }}
            //   className="underline   text-[#0a5c9c]  cursor-pointer "
              field="refCarCustId"
              header="Car CustId"
           
            />

            <Column
              headerStyle={{ width: "15rem" }}
              field="refCarTypeName"
              header="First Name"
            />
             <Column
              headerStyle={{ width: "15rem" }}
              field="refVehicleTypeName"
              header="VehicleType Name"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refcarManufactureYear"
              header="Manufacture Year"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refStatus"
              header="Status"
            />
           
            <Column
              headerStyle={{ width: "15rem" }}
              field="refCarPrice"
              header="Price"
            />
          
          </DataTable>
        </div>
        <h2 className="text-xl mt-3 font-bold">
          Parking Booking Details
          </h2>
        <div className="flex flex-col gap-4 mt-4">
          <DataTable
            value={parkingBooking}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={5}
          >
            <Column
              header="S.No"
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              headerStyle={{ width: "15rem" }}
            //   className="underline   text-[#0a5c9c]  cursor-pointer "
              field="refParkingCustId"
              header="Parking CustId"
           
            />

            <Column
              headerStyle={{ width: "15rem" }}
              field="refParkingName"
              header="Parking Name"
            />
             <Column
              headerStyle={{ width: "15rem" }}
              field="refParkingTypeName"
              header="Parking TypeName"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refPrice"
              header="Price"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refLocation"
              header="Location"
            />
           
            <Column
              headerStyle={{ width: "15rem" }}
              field="refAvailability"
              header="Availability"
            />
            <Column
              headerStyle={{ width: "15rem" }}
              field="refBookingType"
              header="Booking Type"
            />
  
          </DataTable>
        </div>
        </Sidebar>
      </div>
    </>
  );
};

export default Userlist;
