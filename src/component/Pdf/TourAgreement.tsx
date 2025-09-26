import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
} from "@react-pdf/renderer";
import { Image } from "@react-pdf/renderer";
import logo from "../../assets/images/logo.png";

const TourAgreement: React.FC = ({}) => {
  return (
    <>
      <PDFViewer
        style={{
          width: "100%",
          height: "100%",
          padding: "40px",
        }}
      >
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
                    Name :
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
                    Address :
                  </Text>
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
                    Date :
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
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: 18,
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Invoice No :
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: 18,
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Booking No :
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
                    Adults Count :
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: 18,
                      color: "#000",
                      fontWeight: "normal",
                    }}
                  >
                    Children Count :
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: 18,
                      color: "#000",
                      fontWeight: "normal",
                    }}
                  >
                    Infants Count :
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
                    Dates :
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
                    Tour Name :
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
                  CHF :
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
                  If you have any questions, please do not hesitate to contact
                  us.
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
                  The general terms and conditions of ZüriCar GmbHs AG
                  apply.
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
                  https://www.eda.admin.ch. Travellers of other nationalities
                  are advised to contact the relevant embassy, consulate, or
                  their travel agency for information on applicable
                  requirements. In the event of cancellations or changes to
                  names or travel dates, cancellation or processing fees may
                  apply. Please refer to our General Terms and Conditions (GTC)
                  (AGB ) for further details.
                </Text>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
};

export default TourAgreement;
