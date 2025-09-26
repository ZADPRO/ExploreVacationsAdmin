import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
} from "@react-pdf/renderer";
import { Image } from "@react-pdf/renderer";
import car from "../../assets/images/image.png";
import logo from "../../assets/images/logo.png";

interface CarDetails {
  userName: string;
  customerID: string;
  reservationDate: string;
  driverName: string;
  cargroup: string;
  from: string;
  to: string;
  rentaldays: string;
  pickupAddress: string;
  submissionAddress: string;
  amount: string;
  carType: string;
  carName: string;
  milage: string;
  year: string;
}

const CarAgreement: React.FC<CarDetails> = ({
  userName,
  customerID,
  reservationDate,
  driverName,
  cargroup,
  from,
  to,
  rentaldays,
  pickupAddress,
  submissionAddress,
  amount,
  carType,
  carName,
  milage,
  year,
}) => {
  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "100%",
      }}
    >
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
                  <Text style={{ fontWeight: "bold" }}>{customerID}</Text>
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
                  width: "50%", // Use percentage for proper layout
                }}
              >
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  Dear Mr/Miss.{userName} ,
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
                  ZüriCar GmbHs.ch
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
                  ["Priceless reservation", "ZüriCar GmbHs"],
                  ["Reservation date", reservationDate],
                  ["Driver name", driverName],
                  ["Car group", cargroup],
                  ["From", from],
                  ["Till", to],
                  ["Rental Days", rentaldays],
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
                  {pickupAddress}
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  ZüriCar GmbHs AG Shuttle bus *
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
                  {submissionAddress}
                </Text>
                <Text style={{ fontSize: 9, marginBottom: 8, color: "#000" }}>
                  ZüriCar GmbHs AG Shuttle bus *
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
                      {carType}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#000", width: "50%" }}>
                      {carName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, color: "#000", width: "50%" }}>
                      {milage}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#000", width: "50%" }}>
                      {year}
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
                 width:"10%"
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
                   {amount}
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
              For more information, please visit www.ZüriCar GmbHs.ch
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default CarAgreement;
