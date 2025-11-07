import React, { useState } from "react";
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
// import { FaArrowRight } from "react-icons/fa";
import Destination from "../../Pages/00-Destination/Destination";
import Location from "../../Pages/01-Location/Location";
import Activities from "../../Pages/02-Activities/Activities";
import Categories from "../../Pages/03-Categories/Categories";
import Notification from "../../Pages/11-Notification/Notification";
import { useTranslation } from "react-i18next";
// import { FaArrowRight } from "react-icons/fa";
import { FromToLocations, CarSelection } from "../../Pages/16-CarSelection/CarSelection";
const Settings: React.FC = () => {
  const [visibleSidebar, setVisibleSidebar] = useState<string | null>(null);
  const { t } = useTranslation("global");
  return (
    <>
      <div>
        <div className="text-2xl font-semibold p-3">
          {t("dashboard.Settings")}
        </div>
        <div className="flex flex-row gap-3 px-5  justify-evenly">
          {/* Destination */}
          <div className="text-[#0a5c9c] flex-1">
            {/* <Card style={{ color: "#0a5c9c" }} title={t("dashboard.Destination")}>
                            <div className="w-[100%] flex justify-end ">
                                <FaArrowRight className="cursor-pointer" onClick={() => setVisibleSidebar("destination")} />
                            </div>
                        </Card> */}
            <Card
              style={{ color: "#0a5c9c", cursor: "pointer" }}
              title={t("dashboard.Destination")}
              onClick={() => setVisibleSidebar("destination")}
            >
              <div className="w-full flex justify-end">
                {/* <FaArrowRight /> */}
              </div>
            </Card>
          </div>

          {/* Location */}
          <div className="flex-1">
            {/* <Card style={{ color: "#0a5c9c" }} title={t("dashboard.Location")}>
              <div className="w-[100%] flex justify-end ">
                <FaArrowRight
                  className="cursor-pointer"
                  onClick={() => setVisibleSidebar("location")}
                />
              </div>
            </Card> */}
            <div
              onClick={() => setVisibleSidebar("location")}
              style={{ cursor: "pointer" }}
            >
              <Card
                style={{ color: "#0a5c9c" }}
                title={t("dashboard.Location")}
              >
                <div className="w-full flex justify-end ">
                  {/* <FaArrowRight /> */}
                </div>
              </Card>
            </div>
          </div>

          {/* From and to  */}
          {/* <div className="flex-1">
            <div onClick={() => setVisibleSidebar("Fromtolocations")}
              style={{ cursor: "pointer" }}
            >
              <Card style={{ color: "#0a5c9c" }} title="From/To Locations">

                <div className="w-full flex justify-end ">
                
                </div>
              </Card>
            </div>
          </div> */}


          <div className="flex-1">
            <div onClick={() => setVisibleSidebar("cars")}
              style={{ cursor: "pointer" }}
            >
              <Card style={{ color: "#0a5c9c" }} title="Cars">

                <div className="w-full flex justify-end ">
                  {/* <CarSelection /> */}
                </div>
              </Card>
            </div>
          </div>

          {/* Activities */}
          <div className="flex-1">
            {/* <Card style={{ color: "#0a5c9c" }} title={t("dashboard.Activities")}>
              <div className="w-[100%] flex justify-end ">
                                <FaArrowRight className="cursor-pointer" onClick={() => setVisibleSidebar("activities")} />
                </div>
              </Card> */}
            {/* </div> */}
            <div
              onClick={() => setVisibleSidebar("activities")}
              className="cursor-pointer"
            >
              <Card
                style={{ color: "#0a5c9c" }}
                title={t("dashboard.Activities")}
              >
                <div className="w-full flex justify-end"></div>
              </Card>
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1">
            {/* <Card
              style={{ color: "#0a5c9c" }}
              title={t("dashboard.Categories")}
            >
              <div className="w-[100%] flex justify-end ">
                <FaArrowRight
                  className="cursor-pointer"
                  onClick={() => setVisibleSidebar("categories")}
                />
              </div>
            </Card> */}
            <div
              onClick={() => setVisibleSidebar("categories")}
              className="cursor-pointer"
            >
              <Card
                style={{ color: "#0a5c9c" }}
                title={t("dashboard.Categories")}
              >
                <div className="w-full flex justify-end"></div>
              </Card>
            </div>
          </div>
          {/* Notification */}
          <div className="flex-1">
            {/* <Card
              style={{ color: "#0a5c9c" }}
              title={t("dashboard.Notification")}
            >
              <div className="w-[100%] flex justify-end ">
                <FaArrowRight
                  className="cursor-pointer"
                  onClick={() => setVisibleSidebar("notification")}
                />
              </div>
            </Card> */}
            <div
              onClick={() => setVisibleSidebar("notification")}
              className="cursor-pointer"
            >
              <Card
                style={{ color: "#0a5c9c" }}
                title={t("dashboard.Notification")}
              >
                <div className="w-full flex justify-end"></div>
              </Card>
            </div>
          </div>
        </div>
      </div >

      {/* Destination Sidebar */}
      < Sidebar
        style={{ width: "50vw" }
        }
        visible={visibleSidebar === "destination"}
        onHide={() => setVisibleSidebar(null)}
        position="right"
      >
        <Destination />
      </Sidebar >

      {/* Location Sidebar */}
      < Sidebar
        style={{ width: "50vw" }}
        visible={visibleSidebar === "location"}
        onHide={() => setVisibleSidebar(null)}
        position="right"
      >
        <Location />
      </Sidebar >

      {/* Activities Sidebar */}
      < Sidebar
        style={{ width: "50vw" }}
        visible={visibleSidebar === "activities"}
        onHide={() => setVisibleSidebar(null)}
        position="right"
      >
        <Activities />
      </Sidebar >

{/* From TO  */}
       < Sidebar
        style={{ width: "50vw" }}
        visible={visibleSidebar === "Fromtolocations"}
        onHide={() => setVisibleSidebar(null)}
        position="right"
      >
        <FromToLocations />
      </Sidebar >
      {/* cars */}
       < Sidebar
        style={{ width: "50vw" }}
        visible={visibleSidebar === "cars"}
        onHide={() => setVisibleSidebar(null)}
        position="right"
      >
        <CarSelection />
      </Sidebar >

      {/* Categories Sidebar */}
      < Sidebar
        style={{ width: "50vw" }}
        visible={visibleSidebar === "categories"}
        onHide={() => setVisibleSidebar(null)}
        position="right"
      >
        <Categories />
      </Sidebar >

      {/* Notification Sidebar */}
      < Sidebar
        style={{ width: "70vw" }}
        visible={visibleSidebar === "notification"}
        onHide={() => setVisibleSidebar(null)}
        position="right"
      >
        <Notification />
      </Sidebar >
    </>
  );
};

export default Settings;
