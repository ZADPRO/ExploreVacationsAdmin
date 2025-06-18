import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import { Document, Page, pdf, Text, View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { Image } from "@react-pdf/renderer";
import car from "../../assets/images/image.png";
import logo from "../../assets/images/logo.png";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import ViewPDFAction from "../Pdf/viewPDFAction ";
import moment from "moment-timezone";
import PdfViewer from "../Pdf/PdfViewer";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";



type DecryptResult = any;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    marginBottom: 10,
  },
  infoGroup: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
});

const UserDetails: React.FC = () => {
  const { t } = useTranslation("global");

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

  const [UserDetails, setUserDetails] = useState<any[]>([]);
  const [UserDetail, setTourDetail] = useState<any[]>([]);
  const [TourBooking, setTourBooking] = useState<any[]>([]);
  const [CarBookings, setCarBookings] = useState<any[]>([]);
  // const [viewAgreement, setAgreement] = useState("");
  // const[airportBookings,setAirportBookings]=useState<any[]>([]);
  const [parking, setParking] = useState<any[]>([]);
  const [airport, setAirport] = useState<any[]>([]);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const [_editCustomizeId, setEditCustomizeId] = useState<number | null>(null);
  const [_editAirportId, setEditAirportId] = useState<number | null>(null);
  const [_editTourId, setEditTourId] = useState<number | null>(null);

  const [_editCarId, setEditCarId] = useState<number | null>(null);
  const [_editParkingId, setEditParkingId] = useState<number | null>(null);
  //  const [visible, setVisible] = useState(false);
 const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedIncludeId, setSelectedIncludeId] = useState<number | null>(null);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedParkingId, setSelectedParkingId] = useState<number | null>(
    null
  );
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB"); // e.g., "21/05/2025"

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
      console.log("data-------------->Customiseeeeeeeeee", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setTourDetail(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching customise:", e);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/newCarsRoutes/listOfflineCarBooking",
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
      console.log("data-------------->fetchUserDetails", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setUserDetails(data.result);
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
      console.log("HAI TESTING LINE 141");
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/listCarBookings",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response line ----- 15", response);
      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data-------------->CarBookings", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setCarBookings(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching customise:", e);
    }
  };

  // const fetchParkingBookings = async () => {
  //   try {
  //     const response = await axios.get(
  //       import.meta.env.VITE_API_URL + "/adminRoutes/listParkingBookings",
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("data-------------->beforeParkingBookings", data);
  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);

  //       setParking(data.result);
  //     }
  //   } catch (e: any) {
  //     console.log("Error fetching customise:", e);
  //   }
  // };

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
      if (data.success) {
        console.log("data-------------->afterParkingBookings", data);
        localStorage.setItem("token", "Bearer " + data.token);
        setParking(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching bookings:", e);
    }
  };

  // airport
  const fetchAirportBookings = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/flightRoutes/listFlightBooking",
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
      if (data.success) {
        console.log("data-------------->fetchAirportBookings", data);
        localStorage.setItem("token", "Bearer " + data.token);
        setAirport(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching bookings:", e);
    }
  };

  const deleteAirport = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/flightRoutes/deleteFlightBooking",
        {
          flightBookingId: id,
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
        fetchAirportBookings();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error delete package:", e);
      setSubmitLoading(false);
      setEditAirportId(null);
    }
  };
  const actionDeleteAirport = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteAirport(rowData.flightBookingId)}
      />
    );
  };

  //delete user

  const deleteUSer = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/newCarsRoutes/deleteOfflineCarBooking",
        {
          offlineCarBookingId: id,
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
        fetchUserDetails();
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error delete package:", e);
      setSubmitLoading(false);
      setEditAirportId(null);
    }
  };
  const actionDeleteUser = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => deleteUSer(rowData.offlineCarBookingId)}
      />
    );
  };

  //update

  useEffect(() => {
    fetchCustomize();
    fetchTourBookings();
    fetchCarBookings();
    fetchParkingBookings();
    fetchAirportBookings();
    fetchUserDetails();
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
      <div className="flex items-center gap-2 cursor-pointer">
        <button
          className={`${
            isApproved ? "bg-[#1da750]" : "bg-[#ffcb28] hover:bg-[#ffc928b9]"
          } text-white py-1 px-2 rounded cursor-pointer`}
          onClick={() => {
            if (!isApproved) {
              readCustomizr(rowData); // Call readTour to approve it
              console.log("id-------------->", rowData);
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

  // Customize
  const readCustomizr = async (booking: any) => {
    console.log("bookingid--------", booking);
    const {
      refFName,
      refuserId,
      refTourCustID,
      refAdultCount,
      refChildrenCount,
      refArrivalDate,
      refPackageName,
      refTourPrice,
      refInfants,
    } = booking;

    const doc = (
      <Document>
        <Page size="A4">
          <View style={{ width: "100%", height: "100%", padding: "40px" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                {
                  <Image
                    src={logo}
                    style={{
                      width: "90%", // Adjust as needed
                      marginLeft: 15,
                      marginTop: 10,
                    }}
                  />
                }

                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Oberfeldstarsse10 CH-8302 Kloten
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Name : {refFName}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                    marginTop: "10px",
                  }}
                >
                  Address :
                </Text> */}
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Date : {formattedDate}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Invoice / Travel Confirmation
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "10",
                }}
              >
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Invoice No :
                </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Booking No : {refTourCustID}
                </Text>
              </View>
            </View>
            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "10",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Travel Count
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Adults Count : {refAdultCount}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Children Count : {refChildrenCount}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Infants Count :{refInfants}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: "10",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Please always state these numbers when making inquiries!
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Booked Travel Services:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                    marginTop: "10px",
                  }}
                >
                  Dates : {refArrivalDate}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                    marginTop: "10px",
                  }}
                >
                  Tour Name : {refPackageName}
                </Text>
              </View>
            </View>
            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
                marginTop: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Total Travel Price
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                }}
              >
                CHF : {refTourPrice}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",

                width: "100%",
                marginTop: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "10px",
                }}
              >
                he booking is binding and has been successfully confirmed.
                Please refer to the attached general terms and conditions as
                well as your travel documents.
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "20px",
                }}
              >
                If you have any questions, please do not hesitate to contact us.
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "20px",
                }}
              >
                We wish you a pleasant journey!
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
              >
                Thank you for your booking.
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
              >
                The general terms and conditions of Explore Vacations AG apply.
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "20px",
                }}
              >
                Please note that you are personally responsible for obtaining
                any required visas in due time and for complying with the
                applicable entry, transit, and health regulations of the
                destination and any transit countries. Swiss citizens can find
                up-to-date information on entry requirements on the website of
                the Swiss Federal Department of Foreign Affairs (FDFA):
                https://www.eda.admin.ch. Travellers of other nationalities are
                advised to contact the relevant embassy, consulate, or their
                travel agency for information on applicable requirements. In the
                event of cancellations or changes to names or travel dates,
                cancellation or processing fees may apply. Please refer to our
                General Terms and Conditions (GTC) (AGB ) for further details.
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);

    reader.onloadend = async () => {
      if (reader.result && typeof reader.result === "string") {
        const base64data = reader.result.split(",")[1];
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL +
              "/bookingRoutes/approveCustomizeTourBooking",
            {
              userId: refuserId,
              pdfBase64: base64data,
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

          if (data.success) {
            localStorage.setItem("token", "Bearer " + data.token);
            fetchCustomize();

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
      }
    };
  };

  // const readCustomizr = async (refuserId: any) => {
  //   console.log("Approving booking with ID:", refuserId);
  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL +
  //         "/bookingRoutes/approveCustomizeTourBooking",
  //       {
  //         userId: refuserId,
  //       },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("API Response:", data);

  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);

  //       const updatedTourCustomize = UserDetail.map((tour) =>
  //         tour.refuserId === refuserId
  //           ? { ...tour, refStatus: "Approved" }
  //           : tour
  //       );
  //       setTourDetail(updatedTourCustomize);
  //     } else {
  //       console.error("API update failed:", data);
  //     }
  //   } catch (e) {
  //     console.error("Error approving booking:", e);
  //   }
  // };
  //Car

  //

  const actionDeleteCar = (rowData: any) => {
    console.log(rowData);

    return (
      // <Button
      //   icon="pi pi-trash"
      //   severity="danger"
      //   onClick={() => deleteCar(rowData.userCarBookingId)}
      // />
        <Button
          icon="pi pi-trash"
      severity="danger"
      onClick={() => {
        setSelectedIncludeId(rowData.userCarBookingId);
        setShowDeleteConfirm(true);
      }}
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
  // const readCar = async (refuserId: any) => {
  //   console.log("Approving booking with ID:", refuserId);
  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/bookingRoutes/approveCarBooking",
  //       {
  //         userId: refuserId,
  //       },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("API Response:", data);

  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);

  //       const updatedCarBooking = CarBookings.map((tour) =>
  //         tour.refuserId === refuserId
  //           ? { ...tour, refStatus: "Approved" }
  //           : tour
  //       );
  //       setCarBookings(updatedCarBooking);
  //     } else {
  //       console.error("API update failed:", data);
  //     }
  //   } catch (e) {
  //     console.error("Error approving booking:", e);
  //   }
  // };

  //Tour

  const actionDeleteTour = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
          icon="pi pi-trash"
      severity="danger"
      onClick={() => {
        setSelectedIncludeId(rowData.userTourBookingId);
        setShowDeleteConfirm(true);
      }}
      />
    );
  };
  // const confirmDelete = (id: number) => {
  //   setSelectedIncludeId(id);
  //   setShowDeleteConfirm(true);
  // };
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

  // Tour Booking

  const readTours = async (booking: any) => {
    console.log("bookingid--------", booking);
    const {
      refFName,
      refuserId,
      refTourCustID,
      refAdultCount,
      refChildrenCount,
      refArrivalDate,
      refPackageName,
      refTourPrice,
      refInfants,
    } = booking;

    const doc = (
      <Document>
        <Page size="A4">
          <View style={{ width: "100%", height: "100%", padding: "40px" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                {
                  <Image
                    src={logo}
                    style={{
                      width: "90%", // Adjust as needed
                      marginLeft: 15,
                      marginTop: 10,
                    }}
                  />
                }

                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Oberfeldstarsse10 CH-8302 Kloten
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Name : {refFName}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                    marginTop: "10px",
                  }}
                >
                  Address :
                </Text> */}
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Date : {formattedDate}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Invoice / Travel Confirmation
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "10",
                }}
              >
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Invoice No :
                </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Booking No : {refTourCustID}
                </Text>
              </View>
            </View>
            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "10",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Travel Count
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Adults Count : {refAdultCount}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Children Count : {refChildrenCount}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Infants Count :{refInfants}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: "10",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                  }}
                >
                  Please always state these numbers when making inquiries!
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Booked Travel Services:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                    marginTop: "10px",
                  }}
                >
                  Dates : {refArrivalDate}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#000",
                    fontWeight: "normal",
                    marginTop: "10px",
                  }}
                >
                  Tour Name : {refPackageName}
                </Text>
              </View>
            </View>
            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
                marginTop: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Total Travel Price
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                }}
              >
                CHF : {refTourPrice}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",

                width: "100%",
                marginTop: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "10px",
                }}
              >
                he booking is binding and has been successfully confirmed.
                Please refer to the attached general terms and conditions as
                well as your travel documents.
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "20px",
                }}
              >
                If you have any questions, please do not hesitate to contact us.
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "20px",
                }}
              >
                We wish you a pleasant journey!
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
              >
                Thank you for your booking.
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
              >
                The general terms and conditions of Explore Vacations AG apply.
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  marginLeft: 18,
                  color: "#000",
                  fontWeight: "normal",
                  marginTop: "20px",
                }}
              >
                Please note that you are personally responsible for obtaining
                any required visas in due time and for complying with the
                applicable entry, transit, and health regulations of the
                destination and any transit countries. Swiss citizens can find
                up-to-date information on entry requirements on the website of
                the Swiss Federal Department of Foreign Affairs (FDFA):
                https://www.eda.admin.ch. Travellers of other nationalities are
                advised to contact the relevant embassy, consulate, or their
                travel agency for information on applicable requirements. In the
                event of cancellations or changes to names or travel dates,
                cancellation or processing fees may apply. Please refer to our
                General Terms and Conditions (GTC) (AGB ) for further details.
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);

    reader.onloadend = async () => {
      if (reader.result && typeof reader.result === "string") {
        const base64data = reader.result.split(",")[1];
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL + "/bookingRoutes/approveTourBooking",
            {
              userId: booking,
              pdfBase64: base64data,
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

          if (data.success) {
            localStorage.setItem("token", "Bearer " + data.token);
            fetchTourBookings();
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
      }
    };
  };

  // const readTour = async (refuserId: any) => {
  //   console.log("Approving booking with ID:", refuserId);
  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/bookingRoutes/approveTourBooking",
  //       {
  //         userId: refuserId,
  //       },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("API Response:", data);

  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);

  //       const updatedTourBooking = TourBooking.map((tour) =>
  //         tour.refuserId === refuserId
  //           ? { ...tour, refStatus: "Approved" }
  //           : tour
  //       );
  //       setTourBooking(updatedTourBooking);
  //     } else {
  //       console.error("API update failed:", data);
  //     }
  //   } catch (e) {
  //     console.error("Error approving booking:", e);
  //   }
  // };

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
              readTours(rowData); // Call readTour to approve it
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

  // const actionDeleteParking = (rowData: any) => {
  //   console.log(rowData);

  //   return (
  //     <Button
  //       icon="pi pi-trash"
  //       severity="danger"
  //       onClick={() => deleteParking(rowData.carParkingBookingId)}
  //     />
  //   );
  // };
  const actionDeleteParking = (rowData: any) => {
    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => {
          setSelectedParkingId(rowData.carParkingBookingId);
          setVisibleDialog(true);
        }}
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
      setVisibleDialog(false);
      setSelectedParkingId(null);

    }
  };
  //update Airport

  // const readParking = async (refuserId: any) => {
  //   console.log("Approving booking with ID:", refuserId);

  //   const doc = (
  //     <Document>
  //     <Page size="A4" style={styles.page}>
  //       <View>
  //         <Text style={styles.header}>Explore Vacations AG</Text>
  //         <Text style={styles.paragraph}>
  //           Oberfeldstrasse 10, 8302 Kloten, Switzerland{"\n"}
  //           +41 44 442 30 35 | ✉️ info@explorevacations.ch{"\n"}
  //           www.explorevacations.ch
  //         </Text>

  //         <Text style={styles.subHeader}>
  //           Booking Confirmation – Parking
  //         </Text>

  //         <Text style={styles.paragraph}>
  //           Dear Mr./Ms. [{refFName}],{"\n"}
  //           Thank you for your online booking with Explore Vacations AG. We
  //           hereby confirm your parking reservation at {nearbylocation} Airport.
  //         </Text>

  //         <View style={styles.infoGroup}>
  //           <Text>
  //             <Text style={styles.label}>Booking Number:</Text> {bookingNumber}
  //           </Text>
  //           <Text>
  //             <Text style={styles.label}>Customer:</Text> [{firstName}{" "}
  //             {lastName}]
  //           </Text>
  //           <Text>
  //             <Text style={styles.label}>Parking Period:</Text>
  //           </Text>
  //           <Text>
  //             Check-in: [{checkInDate}, {checkInTime}]
  //           </Text>
  //           <Text>
  //             Check-out: [{checkOutDate}, {checkOutTime}]
  //           </Text>
  //           <Text>
  //             <Text style={styles.label}>Vehicle:</Text> [{vehicleMake},{" "}
  //             {vehicleModel}, {vehicleLicensePlate}]
  //           </Text>
  //           <Text>
  //             <Text style={styles.label}>Location:</Text> {location}
  //           </Text>
  //           <Text>
  //             <Text style={styles.label}>Payment Status:</Text>{" "}
  //             {paymentStatus === "paid" ? "Paid" : "Pay on Arrival"}
  //           </Text>
  //         </View>

  //         <Text style={styles.subHeader}>Important Information:</Text>
  //         <View style={{ marginTop: 10, marginLeft: 10 }}>
  //           <Text style={{ marginBottom: 5 }}>
  //             • Please bring this confirmation with you on the day of arrival
  //             (printed or digital).
  //           </Text>
  //           <Text style={{ marginBottom: 5 }}>
  //             • Our free shuttle service to the terminal will be arranged for
  //             you after your booking.
  //           </Text>
  //           <Text>
  //             • Return transport will be provided after you call us upon your
  //             return.
  //           </Text>
  //         </View>
  //         <Text style={styles.paragraph}>
  //           If you have any questions or need to make changes, please contact us
  //           at +41 44 442 30 35 or info@explorevacations.ch.
  //         </Text>

  //         <Text style={styles.paragraph}>
  //           Thank you for choosing us. We wish you a pleasant journey!
  //         </Text>

  //         <Text style={{ marginTop: 20 }}>
  //           Best regards,{"\n"}Your Explore Vacations AG Team
  //         </Text>
  //       </View>
  //     </Page>
  //   </Document>
  //   )

  //   const pdfBlob = await pdf(doc).toBlob();
  //   const reader = new FileReader();
  //     reader.readAsDataURL(pdfBlob);

  //     reader.onloadend = async () => {
  //       if (reader.result && typeof reader.result === "string") {
  //         const base64data = reader.result.split(",")[1];
  //         return base64data
  //       }
  //     };

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/bookingRoutes/approveParkingBooking",
  //       {
  //         userId: refuserId,
  //       },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("API Response:", data);
  //     console.log("data----------------->beforeparkingdata", data);
  //     if (data.success) {

  //       console.log("data----------------->afterparkingdata", data);
  //       localStorage.setItem("token", "Bearer " + data.token);

  //       const updatedParking = parking.map((tour) =>
  //         tour.refuserId === refuserId
  //           ? { ...tour, refStatus: "Approved" }
  //           : tour
  //       );
  //       setParking(updatedParking);
  //     } else {
  //       console.error("API update failed:", data);
  //     }
  //   } catch (e) {
  //     console.error("Error approving booking:", e);
  //   }
  // };

  //car agreement

  const readCarAgreement = async (booking: any) => {
    console.log("Approving booking with ID:", booking);

    const {
      refuserId,
      refFName,
      refCarCustId,
      refPickupDate,
      refDriverName,
      refCarGroupName,
      refPickupAddress,
      refSubmissionAddress,
      refCarPrice,
      refCarTypeName,
      refVehicleTypeName,
      refMileage,
      refcarManufactureYear,
    } = booking;

    const doc = (
      <Document>
        <Page size="A4">
          <View style={{ width: "100%", height: "100%", padding: "40px" }}>
            <View
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              {/* Left Column */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 18,
                    color: "#015195",
                    fontWeight: "bold",
                  }}
                >
                  Car rental voucher
                </Text>
                {
                  <Image
                    src={logo}
                    style={{
                      width: "90%", // Adjust as needed
                      marginLeft: 15,
                      marginTop: 10,
                    }}
                  />
                }
              </View>

              {/* Right Column */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: 15,
                    color: "#015195",
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Don't forget!
                </Text>
                <Text style={{ fontSize: 9, marginLeft: 15, color: "#015195" }}>
                  * Passport, Full Driving License and International Driving
                  Permit
                </Text>
                <Text style={{ fontSize: 9, marginLeft: 15, color: "#015195" }}>
                  * Print this page
                </Text>
                <Text style={{ fontSize: 9, marginLeft: 15, color: "#015195" }}>
                  * Physical Credit card (Visa or MasterCard) in name of the
                  lead driver. Debit cards, Pre-paid cards and non Physical
                  cards are not accepted.
                </Text>
              </View>
            </View>

            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "row", // Arrange items horizontally
                width: "100%",
                paddingTop: 30,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%", // Use percentage for proper layout
                }}
              >
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Supplier telephone number:{" "}
                  <Text style={{ fontWeight: "bold" }}>+41764959010</Text>
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "20%",
                }}
              >
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Pay on arrival:{" "}
                  <Text style={{ fontWeight: "bold" }}>Payment status</Text>
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%",
                }}
              >
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Carnect voucher number:{" "}
                  <Text style={{ fontWeight: "bold" }}>{refCarCustId}</Text>
                </Text>
              </View>
            </View>

            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "row", // Arrange items horizontally
                width: "100%",
                paddingTop: 30,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "70%", // Use percentage for proper layout
                }}
              >
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Dear Mr/Miss.{refFName} ,
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Please note that your excess is uncovered. DON'T TAKE THE
                  RISK! Add NoRisk Warranty or NoRisk Warranty Plus+ online to
                  enjoy a carefree trip!
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Please check the information below and ensure you bring the
                  required Passport, Driver’s License, Physical Credit Card and
                  voucher to the rental desk.
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  {" "}
                  Please carefully read the supplier's rental agreement and make
                  sure you fully understand it before signing it.
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Kind regards,
                  <br />
                  Explorevacations.ch
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "48%",
                  border: "1px solid red",
                  padding: "10px",
                }}
              >
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Supplier Information
                </Text>

                {[
                  ["Priceless reservation", "Explore Vacations"],
                  ["Reservation date", refPickupDate],
                  ["Driver name", refDriverName],
                  ["Car group", refCarGroupName],
                  // ["From", from],
                  // ["Till", to],
                  // ["Rental Days", rentaldays],
                ].map(([label, value], index) => (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      width: "100%",
                    }}
                  >
                    <Text style={{ fontSize: 9, color: "#000" }}>{label}</Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#000",
                        fontWeight: "bold",
                      }}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row", // Arrange items horizontally
                width: "100%",
                paddingTop: 30,
                justifyContent: "space-around",
                gap: 20, // Optional: adds spacing between columns (React Native Web)
              }}
            >
              {/* Left Column */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%", // Slightly wider for better spacing
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    marginBottom: 8,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Pick-up details
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  {/* Sunday, 09/03/2025 12:30 EVAG - Zurich airport, Switzerland */}
                  {refPickupAddress}
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Explore Vacations AG Shuttle bus *
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Opening hours: 06:00 - 20:00
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  þ +41764959010, +41444423035
                </Text>
              </View>

              {/* Right Column */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%",
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    marginBottom: 8,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Drop-off details
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  {/* Sunday, 16/03/2025 12:30 EVAG - Zurich airport, Switzerland */}
                  {refSubmissionAddress}
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Explore Vacations AG Shuttle bus *
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Opening hours: 06:00 - 20:00
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  þ +41764959010, +41444423035
                </Text>
              </View>
            </View>

            {/* Horizontal Line */}
            <View
              style={{
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                width: "100%",
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row", // Arrange items horizontally
                width: "100%",
                paddingTop: 30,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%", // Use percentage for proper layout
                }}
              >
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  * Airport Shuttle, the Shuttle runs every 20 minutes. The
                  customer will be picked up from CHECK IN 2 EXIT which is in
                  the 2nd Floor (Top Floor) from the Arrival Terminal. If you
                  require any assistance please contact us on +41764959010
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row", // Arrange items horizontally
                width: "100%",
                paddingTop: 30,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%", // Adjust as needed
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    marginBottom: 8,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Your reservation
                </Text>

                <Image
                  src={car}
                  style={{
                    width: "100%",
                    height: "30%",
                    marginTop: "10px",
                  }}
                />
                <View style={{ marginTop: "10px" }}>
                  <View style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, color: "#000", width: "50%" }}>
                      {refCarTypeName}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#000", width: "50%" }}>
                      {refVehicleTypeName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, color: "#000", width: "50%" }}>
                      {refMileage}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#000", width: "50%" }}>
                      {refcarManufactureYear}
                    </Text>
                  </View>
                </View>
                {/* Horizontal Line */}
                <View
                  style={{
                    marginTop: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    width: "100%",
                  }}
                />
                <Text
                  style={{
                    fontSize: 9,
                    marginTop: 10,
                    marginBottom: 8,
                    color: "#000",
                  }}
                >
                  ** Rental companies can't guarantee availability of a specific
                  car brand/model. However you will always be guaranteed to get
                  at least a similar car from the same class.
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "10%",
                }}
              ></View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "60%",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 8,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Price overview
                </Text>
                {/* Horizontal Line */}
                <View
                  style={{
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    width: "100%",
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      color: "#000",
                      marginTop: 5,
                    }}
                  >
                    Premium category (UCAR)
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      color: "#000",
                      marginTop: 5,
                    }}
                  >
                    Prepaid
                  </Text>
                </View>
                {/* Horizontal Line */}
                <View
                  style={{
                    marginTop: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    width: "100%",
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      color: "#000",
                      marginTop: 5,
                    }}
                  >
                    Discount
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      color: "#000",
                      marginTop: 5,
                    }}
                  >
                    Prepaid
                  </Text>
                </View>
                {/* Horizontal Line */}
                <View
                  style={{
                    marginTop: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    width: "100%",
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      color: "#000",
                      marginTop: 5,
                    }}
                  >
                    Pay on arrival
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      color: "#000",
                      marginTop: 5,
                    }}
                  >
                    {refCarPrice}
                  </Text>
                </View>
                {/* Horizontal Line */}
                <View
                  style={{
                    marginTop: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    width: "100%",
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ width: "100%", height: "100%", padding: "40px" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              This is an important notice to make your car rental a smooth
              experience.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              In order to provide you with the most transparent information on
              the price of your car rental services, we have listed on your
              voucher what the price paid to HolidayCars.com includes and what
              it does not include. Terms and conditions vary by country, so we
              have listed any local fees that you might be liable to pay to the
              car rental company at time of vehicle collection. These are the
              only mandatory fees or services you are required to pay locally to
              the car rental company.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              The actual car rental company listed on your voucher might give
              you the option to purchase equipment (such as GPS unit, child
              safety seat, …) , prepaid tank of gas or additional insurances.
              Unless they are listed as mandatory on your voucher, these items
              are optional and you may choose to purchase them or not. If you
              are unsure or require further information, you should contact us
              at time of vehicle pickup on our toll free number, 24 hours a day,
              on the number listed below (see Terms and Conditions section).
              HolidayCars.com cannot accept liability for items purchased
              locally.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              At time of pickup, we also strongly recommend that you check that
              the condition of the vehicle is adequately reflected on the rental
              agreement and that any pre-existing damage is indicated. Should
              you expect to be delayed for the pickup of the vehicle, you should
              also contact us to ensure your vehicle can be confirmed after the
              scheduled timing.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              It is also your responsibility to be aware of the local driving
              laws and local tolls or stickers required for any country you are
              traveling into. Again, you can call HolidayCars.com on our free
              toll number at any time for advice and assistance.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Finally, we strongly recommend that you request and review a copy
              of the rental agreement in English, wherever the car rental
              company can produce one.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              We wish you safe travels and hope you enjoy your car rental.
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Rental Price Includes
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Collision damage waiver with excess up to the value of the car
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Theft protection with excess up to the value of the car
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Rate Option Disclaimer
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              The prices given are estimates only and subject to changes without
              prior notice.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Extras such as child seats, GPS, etc. are on a request basis and
              are not included in the rental price. They are paid in the local
              currency at the rental desk according to the supplier.
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Driver
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Minimum Driver Age
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 4 }}>25</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Maximum Driver Age
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 4 }}>75</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Young Driver
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              A young driver surcharge generally applies to drivers up to the
              age of 25 years. The applicable young driver surcharge and age
              policy may differ depending on your selected car category and
              country. Only drivers over 30 years old may rent superior car
              categories, such as Full Size or Premium/Luxury cars.This
              mandatory surcharge (as a guideline between EUR 5 - EUR 55 per
              day) is not included in the rental price and is paid in local
              currency at rental desk.
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Senior Driver
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              A senior driver surcharge or extra insurance applies to drivers
              over the age of 65 years. When applicable senior driver surcharges
              or extra insurances are obligatory and mostly payable at the time
              of pick up in the local currency. Senior driver age rules are
              different and depend on the dedicated terms of the respective car
              rental company and location. We strongly recommend you check the
              individual supplier's requirements as additional documents may be
              also required. In some locations, for instance, senior drivers
              must provide a medical certificate to confirm that they are
              medically fit to drive.{" "}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 4 }}>75</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Mileage Info
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Unlimited Mileage{" "}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 4 }}>75</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              Security Deposit
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Estimated deposit amount: 500 EUR Upon collection of the car a
              security deposit will be blocked on the driver’s credit card. This
              deposit is determined by the car rental company considering your
              selected car category. Please be informed that the value of one
              tank of fuel and possible traffic fines can be additionally
              blocked on your credit card. It is recommended to present a credit
              card with chip, pin code and embossed numbers. Please note that
              you will have to present evidence that your credit card company /
              or your personal car insurance will be liable also against car
              rental damages. Otherwise, the car rental company may request you
              to leave a security deposit up to the value of the car or you may
              need to consider buying an extra coverage at time of pick-up to
              reduce the liability.{" "}
            </Text>
          </View>
          <View style={{ width: "100%", height: "100%", padding: "40px" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Winter Tyres
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Under certain weather conditions winter or four season tires (mud
              and snow rated tires) and/ or snow chains are recommended or
              mandatory in certain destinations, for instance mountains or
              mountainous regions within the winter season (usually between
              November and April). Additional surcharges may apply and are
              payable in the local currency at the rental desk. Please check the
              local requirements for your journey.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Fuel Policy
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Level to Level: The vehicle should be returned with the same
              amount of fuel as delivered.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Insurance
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Damage, Collision and Theft Protection
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Collision damage waiver with excess up to 0.00 EUR
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Theft protection with excess up to 0.00 EUR
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              You have selected the basic product without any coverage or
              protection against damages or theft. In case of any accident,
              damage of the car body, loss, or theft you will be liable to
              compensate costs up to the value of the car. Any damages which
              have been caused by you or a theft will be claimed together with
              administration fees by the car rental supplier. Please note that
              you will have to present evidence that your credit card company or
              your personal car insurance will cover your damage excess.
              Otherwise, the car rental company may request you to leave a
              higher security deposit which can be up to the value of the car
              different than stated below under the section "Security deposit
              for the car".
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Pickup Location
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Pickup Location Details
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Oberfeldstrasse 10 Kloten 8302 41444423035
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Pickup instructionsThe Shuttle runs every 20 minutes. The customer
              will be picked up from CHECK IN 2 EXIT which is in the 2nd Floor
              (Top Floor) from the Arrival Terminal. If you require any
              assistance please contact us on +41 76 495 90 10• Hotel /
              Apartment Deliver only possible on request by the time of booking
              with extra charge of 100 CHF / way plus local taxes within a 15
              Kms radius of the station and additional Km will be charge 5 CHF
              Please note, the Priceless Car Rental is not obligated to wait for
              your arrival, and if you fail to arrive at the pick-up station at
              the time indicated in the voucher, it may constitute a No-Show on
              your part. At the end of the rental period, you must return the
              vehicle undamaged and in a clean condition to the correct location
              and at the agreed time. Please make sure you return the vehicle to
              the same location which you collected it.In the event the car is
              dropped off unreasonably dirty, as determined solely by Explore
              Vacations AG and may charge you for special cleaning fees.No-Show
              A "no-show" is when youwish to cancel your booking but do not tell
              us until your rental is due to start;fail to pick up the car at
              the arranged date and time;fail to provide the documentation that
              is required to pick up the car;fail to provide a credit card in
              the main driver's name with enough funds to cover the deposit;fail
              to meet supplier terms or requirements;In all these cases, you
              will receive no refund of the money you have paid.Explore
              Vacations AG Car Rental reserves the right to refuse to rent a car
              to any customer who fails to arrive on time and does not have the
              necessary documentation and a credit card with enough funds. In
              such a case, unless the rental has been cancelled in advance, the
              customer will not be entitled to a refund.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Pickup Location Opening Hours
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 13 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>
                  Monday: 06:00 - 20:00
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>
                  Tuesday: 06:00 - 20:00
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>
                  Wednesday: 06:00 - 20:00
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>
                  Thursday: 06:00 - 20:00
                </Text>

                <Text style={{ fontSize: 9, marginBottom: 4 }}>
                  Friday: 06:00 - 20:00
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>
                  Saturday: 07:00 - 16:00
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>
                  Sunday: 06:00 - 20:00
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              After Hours Fee
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Please note: Pick ups or drop offs outside of general opening
              hours maybe subject to an out of hours fee, payable locally at the
              rental desk.
            </Text>
          </View>
          <View style={{ width: "100%", height: "100%", padding: "40px" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Cross Border Travel
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Cross-border travel is not usually permitted. Cross-border may or
              may not be available if you intend to drive to different islands
              within the same country or outside the country/state (for example,
              US/CAN). Charges may apply if available. It is MANDATORY to notify
              the rental agent of your plan to cross borders PRIOR TO THE
              PICK-UP DAY (it is usually recommended to do this at least 48
              hours in advance). Please include the name of the country, state,
              or island you would like to visit. In this manner, the rental
              agent will confirm whether the car you have reserved is
              appropriate and fully insured for any potential cross-border
              travel.
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Grace Period
            </Text>
            <Text
              style={{
                fontSize: 8,
                marginBottom: 12,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              Cross-border travel is not usually permitted. Cross-border may or
              may not be available if you intend to drive to different islands
              within the same country or outside the country/state (for example,
              US/CAN). Charges may apply if available. It is MANDATORY to notify
              the rental agent of your plan to cross borders PRIOR TO THE
              PICK-UP DAY (it is usually recommended to do this at least 48
              hours in advance). Please include the name of the country, state,
              or island you would like to visit. In this manner, the rental
              agent will confirm whether the car you have reserved is
              appropriate and fully insured for any potential cross-border
              travel.
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Additional Driver
            </Text>
            <Text
              style={{
                fontSize: 8,
                marginBottom: 12,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              Additional Driver surcharges are usually not included in the
              rental price and are to be paid in the local currency at the
              rental desk. However there are special offers or promotions where
              the additional driver surcharge for a minimum of one driver is
              included in the rental price. In this case it is clearly stated
              under the listed price inclusions.
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Means of Payment
            </Text>
            <Text
              style={{
                fontSize: 8,
                marginBottom: 12,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              At pick-up a valid credit card in main driver's name is required
              as a guarantee. It is recommended to present a credit card with
              chip, pin code and embossed numbers and it must be valid at least
              3 months after the drop-off date of the rented car
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Most welcomed payment types
            </Text>
            <Text
              style={{
                fontSize: 8,
                marginBottom: 12,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              Visa or Mastercard
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Some suppliers may not accept
            </Text>
            <Text
              style={{
                fontSize: 8,
                marginBottom: 12,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              American Express, Union Pay, Visa Premier or Diners/ Discover
              Club, Carte Bleue (Dual Cards), Debit Cards
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Most Declined Payment Types
            </Text>
            <Text
              style={{
                fontSize: 8,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              Prepaid Debit Cards, Prepaid Credit Cards, Virtual Credit Cards
              (Apple Pay, Corporatepay and Comparable), and Cash
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Premium, Luxury, Elite and higher categories
            </Text>
            <Text
              style={{
                fontSize: 8,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              For cars in Premium, Luxury, Elite and higher categories, two
              credit cards in the same driver's name are required for all
              rentals. The credit cards must not be from the same issuer but the
              required deposit amount must be available on only one of the
              cards.{" "}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Please Note
            </Text>
            <Text
              style={{
                fontSize: 8,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              If the main driver does not provide a valid credit card or does
              not have sufficient funds, the rental company reserves the right
              to charge additional fees or refuse to release the vehicle. In
              this case, your reservation will be charged in accordance with the
              agreed no-show policy.{" "}
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Most Declined Payment Types
            </Text>
            <Text
              style={{
                fontSize: 8,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              Prepaid Debit Cards, Prepaid Credit Cards, Virtual Credit Cards
              (Apple Pay, Corporatepay and Comparable), and Cash
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Compulsory Documentation
            </Text>
            <Text
              style={{
                fontSize: 8,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              Suppliers usually request compulsory documents and they further
              request a valid credit card with enough funds at time of pick up.
              Compulsory documents are determined by the supplier and are
              subject to vary per destination. In worst cases supplier decline
              the handover of the rental car because of insufficient
              documentation or the failure to provide a valid credit card with
              enough credits. In such a scenario your reservation will be
              treated as a ‘No Show’ and the cancellation policy according to
              your relevant rental terms of your reservation will be applied.{" "}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Compulsory documents for domestic rentals within or Latin America
            </Text>
            <Text
              style={{
                fontSize: 8,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              Suppliers in Latin America usually accept a valid Passport rather
              than an ID card. Please be aware in case you fail to bring the
              respective and compulsory documents suppliers will decline the
              handover of the reserved and prepaid rent a car.{" "}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 6,
              }}
            >
              Compulsory documents for pick up at a glance
            </Text>
            <Text
              style={{
                fontSize: 8,
                lineHeight: 1.5,
                color: "#000",
              }}
            >
              At time of pick-up, the following physical documentation issued in
              the main driver´s name must be presented at the rental desk
              referring to the supplier's reservation confirmation reference
              number:{"\n\n"}- Voucher where applicable{"\n"}- Valid Passport/or
              ID card (For domestic rentals ID card may be mandatory){"\n"}-
              Valid Driving License{"\n"}- Valid Credit Card with PIN CODE in
              the same name as the driver license{"\n"}- Fiscal Code (applicable
              for Italian customers with destination Italy){"\n\n"}
              Local renters may also require a round-trip ticket or initiate a
              verification process which may include verifying personal
              information by providing at least 2 documents showing proof of
              residency. Please check with the supplier before Pick-Up.
            </Text>
          </View>
          <View style={{ width: "100%", height: "100%", padding: "40px" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Driving License
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              When picking up the car, all drivers need to present valid
              driver's license typically held for at least one year with no
              major endorsements. Driver needs to provide physical driving
              license, digital or electronic format is not accepted. The
              required years of driving experience may vary according to the car
              category, country or car rental supplier.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Driving License Requirements domestic rentals
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              When renting a vehicle, some suppliers additionally require an
              extra form of identification (e.g. utility bill or bank
              statement), especially in the UK, France, or Italy. This extra
              identification should be less than three months old and must
              confirm your last name, first name, and address as indicated
              during the reservation process.{" "}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              International Rentals Requirements
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              International rentals may have different requirements. We strongly
              advise you to check individual country or car rental supplier
              requirements as you may be asked to provide additional
              documentation or/and an international driving license. If an
              International Driving License is required, you will need to
              present both your international driver's license and your domestic
              license for pick-up. For holders of a UK driving license please
              visit DVLA for an update on recent changes to the paper
              counterpart effective from 8th June 2015. When renting in the
              United States the legal terms for 12-17 passenger van rentals may
              differ as per rental destination. Please check the local
              requirements for driving license policy.{" "}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Domestic Driving Licence, issue in non-Latin Characters
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              If your domestic driving license is issued in non-Latin characters
              (e.g. Arabic, Chinese, Cyrillic...etc.), you will need to present
              an International Driving Permit in addition to your domestic
              driving license. Please remember that you must carry both
              documents also when driving your rental car.If the International
              Driver's Permits cannot be issued by your home Country (e.g.
              drivers from People's Republic of China), you may be allowed to
              present your domestic driving license accompanied by a Notarised
              Translation instead. We strongly recommend verifying the
              international driving license regulations applicable for your
              Country of pick-up, or to contact your Embassy for more
              information. Please keep in mind, however, that while a certain
              Country’s regulations may not require an International Driver's
              Permit, some car rental suppliers located in that Country may
              require to present the International Driver's Permit anyway.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Driving Licence Requirements for destination Japan
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              The drivers age must be at least 18. Please be advised that only
              drivers with driving licences from the IDP countries listed in
              1949 Geneva convention are acceptable. International Driving
              permissions which are issued in the countries Belgium, Estonia,
              France, Germany, Monaco, Slovenia, Switzerland, Taiwan are only
              accepted in combination with a translation of the driver's license
              issued from Japan Automobile Federation (JAF), more information is
              available here: http://www.jaf.or.jp/e/translation/with.htm.
              Chinese driving licenses are not accepted in Japan at all also not
              in combination with official translations.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Payment Details
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              Prepayment: Full rental price due at time of reservation. At
              pick-up a valid credit card in main driver's name is required as a
              guarantee. Prepaid or debit cards, such as Maestro, Visa electron,
              Visa Premier or Carte Bleue are not accepted. The actual charge to
              your credit card may vary according to the exchange rate used
              and/or additional fees imposed by your bank. Please note that
              payments at pick-up are subject to local currency.
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4, marginTop: 300 }}>
              For more information, please visit www.explorevacations.ch
            </Text>
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);

    reader.onloadend = async () => {
      if (reader.result && typeof reader.result === "string") {
        const base64data = reader.result.split(",")[1];
        console.log(
          "----------------------------------refuserId 2147",
          refuserId
        );
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL + "/bookingRoutes/approveCarBooking",
            {
              userId: refuserId,
              pdfBase64: base64data,
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

          if (data.success) {
            localStorage.setItem("token", "Bearer " + data.token);
            fetchCarBookings();
            console.log("----------------------------------refuserId", booking);
            const updatedCar = CarBookings.map((p) =>
              p.booking === booking ? { ...p, refStatus: "Approved" } : p
            );
            setCarBookings(updatedCar);
            console.log("updatedCar--------------------------:", updatedCar);
          } else {
            console.error("API update failed:", data);
          }
        } catch (e) {
          console.error("Error approving booking:", e);
        }
      }
    };
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
              readCarAgreement(rowData); // Call readTour to approve it
            }
            console.log("----------------------------------refuserId", rowData);
          }}
          disabled={isApproved} // Disable the button if already approved
        >
          {isApproved ? "Approved" : "Approve"}{" "}
          {/* Show "Approved" if already approved */}
        </button>
      </div>
    );
  };

  const readParking = async (booking: any) => {
    console.log("bookingid--------", booking);
    const {
      refuserId,
      refFName,
      refLName,
      travelStartDate,
      travelEndDate,
      VehicleModel,
      vehicleNumber,
      refLocation,
      refStatus,
      refParkingName,
    } = booking;

    const checkInDate = new Date(travelStartDate).toLocaleDateString();
    const checkInTime = new Date(travelStartDate).toLocaleTimeString();
    const checkOutDate = new Date(travelEndDate).toLocaleDateString();
    const checkOutTime = new Date(travelEndDate).toLocaleTimeString();

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.header}>Explore Vacations AG</Text>
            <Text style={styles.paragraph}>
              Oberfeldstrasse 10, 8302 Kloten, Switzerland{"\n"}
              +41 44 442 30 35 | ✉️ info@explorevacations.ch{"\n"}
              www.explorevacations.ch
            </Text>

            <Text style={styles.subHeader}>Booking Confirmation – Parking</Text>

            <Text style={styles.paragraph}>
              Dear Mr./Ms. {refFName} {refLName},{"\n"}
              Thank you for your online booking with Explore Vacations AG. We
              hereby confirm your parking reservation at {refParkingName},{" "}
              {refLocation}.
            </Text>

            <View style={styles.infoGroup}>
              <Text>
                <Text style={styles.label}>Booking Number:</Text> #
                {booking.carParkingBookingId}
              </Text>
              <Text>
                <Text style={styles.label}>Customer:</Text> {refFName}{" "}
                {refLName}
              </Text>
              <Text>
                <Text style={styles.label}>Parking Period:</Text>
              </Text>
              <Text>
                Check-in: {checkInDate}, {checkInTime}
              </Text>
              <Text>
                Check-out: {checkOutDate}, {checkOutTime}
              </Text>
              <Text>
                <Text style={styles.label}>Vehicle:</Text> {VehicleModel},{" "}
                {vehicleNumber}
              </Text>
              <Text>
                <Text style={styles.label}>Location:</Text> {refLocation}
              </Text>
              <Text>
                <Text style={styles.label}>Payment Status:</Text>{" "}
                {refStatus === "Approved" ? "Paid" : "Pay on Arrival"}
              </Text>
            </View>

            <Text style={styles.subHeader}>Important Information:</Text>
            <View style={{ marginTop: 10, marginLeft: 10 }}>
              <Text style={{ marginBottom: 5 }}>
                • Please bring this confirmation with you on the day of arrival.
              </Text>
              <Text style={{ marginBottom: 5 }}>
                • Our free shuttle service to the terminal will be arranged for
                you after your booking.
              </Text>
              <Text>
                • Return transport will be provided after you call us upon your
                return.
              </Text>
            </View>

            <Text style={styles.paragraph}>
              If you have any questions, please contact us at +41 44 442 30 35
              or info@explorevacations.ch.
            </Text>

            <Text style={styles.paragraph}>
              Thank you for choosing us. We wish you a pleasant journey!
            </Text>

            <Text style={{ marginTop: 20 }}>
              Best regards,{"\n"}Your Explore Vacations AG Team
            </Text>
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);

    reader.onloadend = async () => {
      if (reader.result && typeof reader.result === "string") {
        const base64data = reader.result.split(",")[1];
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL +
              "/bookingRoutes/approveParkingBooking",
            {
              userId: refuserId,
              pdfBase64: base64data,
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

          if (data.success) {
            localStorage.setItem("token", "Bearer " + data.token);
            fetchParkingBookings();

            const updatedParking = parking.map((p) =>
              p.refuserId === refuserId ? { ...p, refStatus: "Approved" } : p
            );
            setParking(updatedParking);
          } else {
            console.error("API update failed:", data);
          }
        } catch (e) {
          console.error("Error approving booking:", e);
        }
      }
    };
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
              // readParking(rowData.refuserId); // Call readTour to approve it
              readParking(rowData);
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

  const formatToSwissTime = (dateString: any) => {
    return moment(dateString).tz("Europe/Zurich").format("DD.MM.YYYY HH:mm");
  };

  // const ViewCar = async (userId: any) => {
  //   console.log("Approving booking with ID:", userId);
  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/adminRoutes/viewCarAgreement",
  //       { refuserId:userId },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("API Response:", data);

  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);
  //       setAgreement(data.result);
  //         const agreement = data.result?.[0]; // Access first item in result array

  //     if (agreement?.refAgreementPath?.filename) {
  //       const pdfUrl = `${import.meta.env.VITE_API_URL}/uploads/agreements/${agreement.refAgreementPath.filename}`;
  //       window.open(pdfUrl, "_blank");
  //     } else {
  //       console.warn("No PDF file found in the response.");
  //     }
  //     } else {
  //       console.error("API update failed:", data);
  //     }
  //   } catch (e) {
  //     console.error("Error approving booking:", e);
  //   }
  // };

  const actinViewCar = (rowData: any) => {
    console.log("Row Data:-------->", rowData);
    // https://explorevacations.max-idigital.ch/src/assets/carAgreement/17466163716824287.pdf
    const pdfUrl = `https://explorevacations.max-idigital.ch/src/assets/carAgreement/${rowData.refAgreementPath?.filename}`;
    console.log("PDF URL:", pdfUrl);
    return <PdfViewer pdfUrl={pdfUrl} />;
  };
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // On mount, check for tabIndex from state
  useEffect(() => {
    if (location.state?.tabIndex !== undefined) {
      setActiveIndex(location.state.tabIndex);
    }
  }, [location.state]);

  return (
    <div className="p-10 mt-0">
      <h2 className="text-2xl font-semibold">{t("dashboard.User Details")}</h2>
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {/* <TabPanel header={t("dashboard.Customize Tour Details")}>
          <div className="mt-1 p-2 ">
            <h3 className="text-lg font-bold mb-4">
              {t("dashboard.Customize TourBookings")}
            </h3>
            <DataTable
              value={UserDetail}
              paginator
              rows={8}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header={t("dashboard.SNo")}
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />

              <Column
                field="refCustId"
                header={t("dashboard.User CustID")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refUserName"
                header={t("dashboard.User Name")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header={t("dashboard.User Email")}
                style={{ minWidth: "250px" }}
              />

              <Column
                field="refTourCustID"
                header={t("dashboard.TourCustID")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refPackageName"
                header={t("dashboard.Package Name")}
                style={{ minWidth: "150px" }}
              />

              <Column
                field="refUserMobile"
                header={t("dashboard.User Mobile")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refArrivalDate"
                header={t("dashboard.Arrival Date")}
                style={{ minWidth: "200px" }}
                body={(rowData) => formatToSwissTime(rowData.refArrivalDate)}
              />
              <Column
                field="refSingleRoom"
                header={t("dashboard.Single Room")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refTwinRoom"
                header={t("dashboard.Twin Room")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refTripleRoom"
                header={t("dashboard.Triple Room")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refAdultCount"
                header={t("dashboard.Adult Count")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refChildrenCount"
                header={t("dashboard.Children Count")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refVaccinationType"
                header={t("dashboard.Vaccination Type")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refOtherRequirements"
                header={t("dashboard.Other Requirements")}
                style={{ minWidth: "300px" }}
              />
              <Column
                body={actionReadCustomize}
                header={t("dashboard.Approve")}
              />
              <Column
                body={actionDeleteCustomize}
                header={t("dashboard.Delete")}
              />
            </DataTable>
          </div>
        </TabPanel> */}

        <TabPanel header={t("dashboard.TourBookings")}>
          <div className=" ">
            <h3 className="text-lg font-bold">
              {t("dashboard.Added TourBookings")}
            </h3>
            <DataTable
              paginator
              rows={8}
              scrollable
          scrollHeight="500px"
              value={TourBooking}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header={t("dashboard.S.No")}
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />
              <Column
                field="refCustId"
                header={t("dashboard.User CustID")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserName"
                header={t("dashboard.User Name")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header={t("dashboard.User Email")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refTourCustID"
                header={t("dashboard.TourCustID")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refPackageName"
                header={t("dashboard.Package Name")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refDurationIday"
                header={t("dashboard.No of Days")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refDurationINight"
                header={t("dashboard.No of Nights")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refGroupSize"
                header={t("dashboard.Group Size")}
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
                header={t("dashboard.Tour Price")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refSeasonalPrice"
                header={t("dashboard.Seasonal Price")}
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refLocationName"
                header={t("dashboard.Location")}
                style={{ minWidth: "200px" }}
                body={(rowData) => rowData.refLocationName?.join(", ")}
              />
              <Column
                field="Activity"
                header={t("dashboard.Activity")}
                style={{ minWidth: "250px" }}
                body={(rowData) => rowData.Activity?.join(", ")}
              />
              <Column
                field="refUserName"
                header={t("dashboard.Booked By")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header={t("dashboard.User Email")}
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refUserMobile"
                header={t("dashboard.Mobile")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refPickupDate"
                header={t("dashboard.Pickup Date")}
                body={formatDate}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refAdultCount"
                header={t("dashboard.Adults")}
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refChildrenCount"
                header={t("dashboard.Children")}
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refInfants"
                header={t("dashboard.Infants")}
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refOtherRequirements"
                header={t("dashboard.Other Requirements")}
                style={{ minWidth: "300px" }}
              />
              <Column body={actionReadTour} header={t("dashboard.Approve")} />
              <Column body={actionDeleteTour} header={t("dashboard.Delete")} />
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
                            if (selectedIncludeId) {
                              deleteTour(selectedIncludeId);
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
        </TabPanel>
        <TabPanel header={t("dashboard.CarBookings")}>
          <div className="mt-2 p-1  ">
            <h3 className="text-lg font-bold mb-4">
              {t("dashboard.Added CarBookings")}
            </h3>
            <DataTable
              paginator
              scrollable
              scrollHeight="500px"
              rows={4}
              value={CarBookings}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header={t("dashboard.SNo")}
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />
              <Column
                field="refCustId"
                header={t("dashboard.User CustID")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refUserName"
                header={t("dashboard.User Name")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header={t("dashboard.User Email")}
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refUserMobile"
                header={t("dashboard.Mobile")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refPickupAddress"
                header={t("dashboard.Pickup Address")}
                style={{ minWidth: "300px" }}
              />
              <Column
                field="refSubmissionAddress"
                header={t("dashboard.Submission Address")}
                style={{ minWidth: "300px" }}
              />
              <Column
                field="refPickupDate"
                header={t("dashboard.Pickup Date")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refAdultCount"
                header={t("dashboard.Adults")}
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refChildrenCount"
                header={t("dashboard.Children")}
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refInfants"
                header={t("dashboard.Infants")}
                style={{ minWidth: "100px" }}
              />
              <Column
                field="refOtherRequirements"
                header={t("dashboard.Other Requirements")}
                style={{ minWidth: "300px" }}
              />
              <Column body={actinViewCar} header={t("dashboard.View Pdf")} />
              <Column body={actionReadCar} header={t("dashboard.Approve")} />
              <Column body={actionDeleteCar} header={t("dashboard.Delete")} />
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
                            if (selectedIncludeId) {
                              deleteTour(selectedIncludeId);
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
        </TabPanel>
        <TabPanel header={t("dashboard.Booked Parking")}>
          <div className="mt-2 p-1  ">
            <h3 className="text-lg font-bold mb-4">
              {t("dashboard.Added Parking")}
            </h3>
            <DataTable
              paginator
              rows={8}
              scrollable
          scrollHeight="500px"
              value={parking}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header={t("dashboard.SNo")}
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />
              <Column
                field="refCustId"
                header={t("dashboard.User CustID")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refFName"
                header={t("dashboard.User Name")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserEmail"
                header={t("dashboard.User Email")}
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refParkingName"
                header={t("dashboard.Parking Name")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refParkingTypeName"
                header={t("dashboard.ParkingType")}
                style={{ minWidth: "250px" }}
              />
              <Column
                field="travelStartDate"
                header={t("dashboard.Start Date")}
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
                header={t("dashboard.End Date")}
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
                header={t("dashboard.Vehicle Model")}
                style={{ minWidth: "100px" }}
              />
              <Column
                field="HandoverPersonEmail"
                header={t("dashboard.Handover PersonEmail")}
                style={{ minWidth: "300px" }}
              />
              <Column
                field="HandoverPersonName"
                header={t("dashboard.Handover PersonName")}
                style={{ minWidth: "200px" }}
              />
              <Column
                field="HandoverPersonPhone"
                header={t("dashboard.Handover PersonPhone")}
                style={{ minWidth: "100px" }}
              />
              <Column
                body={actionReadParking}
                header={t("dashboard.Approve")}
              />
              <Column
                body={actionDeleteParking}
                header={t("dashboard.Delete")}
              />
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
                if (selectedParkingId !== null) {
                  deleteParking(selectedParkingId);
                }
              }}
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this car parking booking?</p>
      </Dialog>
          </div>
        </TabPanel>
        <TabPanel header={t("dashboard.Flight Ticket Form")}>
          <div className="mt-1 p-2 ">
            <h3 className="text-lg font-bold mb-4">
              {t("dashboard.Flight Ticket Details")}
            </h3>
            <DataTable
              value={airport}
              paginator
              rows={8}
              scrollable
          scrollHeight="500px"
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header={t("dashboard.SNo")}
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />

              {/* <Column
    field="refCustId"
    header={t("dashboard.UserCustId")}
    style={{ minWidth: "150px" }}
  /> */}

              <Column
                field="refUserName"
                header={t("dashboard.User Name")}
                style={{ minWidth: "200px" }}
              />

              <Column
                field="refMoblile"
                header={t("dashboard.Mobile")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refEmail"
                header={t("dashboard.Email")}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refPickup"
                header={t("dashboard.Pickup")}
                style={{ minWidth: "150px" }}
              />

              <Column
                field="refDestination"
                header={t("dashboard.Destination")}
                style={{ minWidth: "250px" }}
              />
              <Column
                field="refRequirements"
                header={t("dashboard.Requirement")}
                style={{ minWidth: "200px" }}
              />

              {/* <Column body={actionReadAirport} header={t("dashboard.Approve")} /> */}

              <Column
                body={actionDeleteAirport}
                header={t("dashboard.Delete")}
              />
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel header={t("dashboard.User Form Details")}>
          <div className="mt-1 p-2 ">
            <h3 className="text-lg font-bold mb-4">
              {t("dashboard.User Form Details")}
            </h3>
            <DataTable
              value={UserDetails}
              paginator
              rows={8}
              scrollable
          scrollHeight="500px"
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header={t("dashboard.SNo")}
                headerStyle={{ width: "3rem" }}
                body={(_, options) => options.rowIndex + 1}
              />

              {/* <Column
    field="refCustId"
    header={t("dashboard.UserCustId")}
    style={{ minWidth: "150px" }}
  /> */}

              <Column
                field="refUserName"
                header={t("dashboard.User Name")}
                style={{ minWidth: "200px" }}
              />

              <Column
                field="refUserMobile"
                header={t("dashboard.Mobile")}
                style={{ minWidth: "150px" }}
              />

              <Column
                field="refUserMail"
                header={t("dashboard.Email")}
                style={{ minWidth: "150px" }}
              />

              <Column
                field="refDoorNumber"
                header={t("dashboard.Door Number")}
                style={{ minWidth: "150px" }}
              />

              <Column
                field="refStreet"
                header={t("dashboard.Street")}
                style={{ minWidth: "250px" }}
              />

              <Column
                field="refArea"
                header={t("dashboard.Area")}
                style={{ minWidth: "200px" }}
              />

              <Column
                field="refcountry"
                header={t("dashboard.Country")}
                style={{ minWidth: "200px" }}
              />

              {/* <Column body={actionReadAirport} header={t("dashboard.Approve")} /> */}

              <Column body={actionDeleteUser} header={t("dashboard.Delete")} />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default UserDetails;
