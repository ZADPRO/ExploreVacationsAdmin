import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import { Document, Page, pdf, Text, View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
// import { FaEye } from "react-icons/fa";
// import ViewPDFAction from "../Pdf/viewPDFAction ";
import moment from "moment-timezone";
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
      console.log("data-------------->Customiseeeeeeeeee", data);
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

    // const handleViewPDF = () => {
    //   const base64 = rowData?.refVaccinationCertificate; // Adjust as needed

    //   if (!base64) {
    //     alert("No PDF available");
    //     return;
    //   }

    //   const pdfWindow = window.open("");
    //   if (pdfWindow) {
    //     pdfWindow.document.write(
    //       `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64}'></iframe>`
    //     );
    //   } else {
    //     alert("Popup blocked! Please allow popups for this site.");
    //   }
    // };

  

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

  const readParking = async (booking: any) => {
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

  // const downloadPdf = async () => {
  //   const bookingNumber = "123456";

  //   const doc = (
  //     <BookingPDF
  //       title="Booking Confirmation"
  //       customerName="John Doe"
  //       bookingNumber={bookingNumber}
  //       firstName="John"
  //       lastName="Doe"
  //       vehicleMake="Toyota"
  //       vehicleModel="Camry"
  //       vehicleLicensePlate="ABC1234"
  //       location="Zurich Airport"
  //       paymentStatus="paid"
  //       checkInDate={new Date().toISOString().split("T")[0]}
  //       checkInTime={new Date().toLocaleTimeString()}
  //       checkOutDate={new Date().toISOString().split("T")[0]}
  //       checkOutTime={new Date().toLocaleTimeString()}
  //       nearbylocation="Zurich"
  //     />
  //   );

  //   try {
  //     const pdfBlob = await pdf(doc).toBlob();
  //     const reader = new FileReader();
  //       reader.readAsDataURL(pdfBlob);

  //       reader.onloadend = async () => {
  //         if (reader.result && typeof reader.result === "string") {
  //           const base64data = reader.result.split(",")[1];
  //           return base64data
  //         }
  //       };

  //   } catch (error) {
  //     console.error("Error generating or downloading PDF:", error);
  //   }
  // };

  const formatToSwissTime = (dateString: any) => {
    return moment(dateString).tz("Europe/Zurich").format("DD.MM.YYYY HH:mm");
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
                field="refCustId"
                header="User CustID"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refUserName"
                header="User Name"
                style={{ minWidth: "200px" }}
              />

              <Column
                field="refUserMail"
                header="Email"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refTourCustID"
                header="TourCustID"
                style={{ minWidth: "150px" }}
              />
              <Column
                field="refPackageName"
                header="Package Name"
                style={{ minWidth: "150px" }}
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
                body={(rowData) => formatToSwissTime(rowData.refArrivalDate)}
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
              <Column body={actionReadCustomize} header="Approve" />

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
                field="refCustId"
                header="User CustID"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserName"
                header="User Name"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserMail"
                header="User Email"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refTourCustID"
                header="Tour CustID"
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
              <Column body={actionReadTour} header="Approve" />
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
              <Column body={actionReadCar} header="Approve" />
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
                field="refCustId"
                header="User CustId"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refFName"
                header="User Name"
                style={{ minWidth: "200px" }}
              />
              <Column
                field="refUserEmail"
                header="User Email"
                style={{ minWidth: "250px" }}
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
              {/* <Column body={hanldleviewPDFAction()} header="View PDF" style={{ minWidth: "100px" }} /> */}
              {/* <Column body={ViewPDFAction} header="View PDF" style={{ minWidth: "100px" }} /> */}
              <Column body={actionReadParking} header="Approve" />
              <Column body={actionDeleteParking} header="Delete" />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default UserDetails;
