import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Define styles
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

// Define props interface
interface BookingPDFProps {
  title: string;
  firstName: string;
  lastName: string;
  bookingNumber: string;
  customerName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleLicensePlate: string;
  location: string;
  paymentStatus: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  nearbylocation: string;
}

// Component with typed props
const index: React.FC<BookingPDFProps> = ({
  title,
  firstName,
  lastName,
  bookingNumber,
  customerName,
  vehicleMake,
  vehicleModel,
  vehicleLicensePlate,
  location,
  paymentStatus,
  checkInDate,
  checkInTime,
  checkOutDate,
  checkOutTime,
  nearbylocation,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.header}>Explore Vacations AG</Text>
          <Text style={styles.paragraph}>
            Oberfeldstrasse 10, 8302 Kloten, Switzerland{"\n"}
            +41 44 442 30 35 | ✉️ info@explorevacations.ch{"\n"}
            www.explorevacations.ch
          </Text>

          <Text style={styles.subHeader}>
            Booking Confirmation – {title} Parking
          </Text>

          <Text style={styles.paragraph}>
            Dear Mr./Ms. [{customerName}],{"\n"}
            Thank you for your online booking with Explore Vacations AG. We
            hereby confirm your parking reservation at {nearbylocation} Airport.
          </Text>

          <View style={styles.infoGroup}>
            <Text>
              <Text style={styles.label}>Booking Number:</Text> {bookingNumber}
            </Text>
            <Text>
              <Text style={styles.label}>Customer:</Text> [{firstName}{" "}
              {lastName}]
            </Text>
            <Text>
              <Text style={styles.label}>Parking Period:</Text>
            </Text>
            <Text>
              Check-in: [{checkInDate}, {checkInTime}]
            </Text>
            <Text>
              Check-out: [{checkOutDate}, {checkOutTime}]
            </Text>
            <Text>
              <Text style={styles.label}>Vehicle:</Text> [{vehicleMake},{" "}
              {vehicleModel}, {vehicleLicensePlate}]
            </Text>
            <Text>
              <Text style={styles.label}>Location:</Text> {location}
            </Text>
            <Text>
              <Text style={styles.label}>Payment Status:</Text>{" "}
              {paymentStatus === "paid" ? "Paid" : "Pay on Arrival"}
            </Text>
          </View>

          <Text style={styles.subHeader}>Important Information:</Text>
          <View style={{ marginTop: 10, marginLeft: 10 }}>
            <Text style={{ marginBottom: 5 }}>
              • Please bring this confirmation with you on the day of arrival
              (printed or digital).
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
            If you have any questions or need to make changes, please contact us
            at +41 44 442 30 35 or info@explorevacations.ch.
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
};

export default index;
