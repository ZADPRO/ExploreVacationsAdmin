import React, { useState } from "react";
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
import { FaArrowRight } from "react-icons/fa";
import Destination from "../../Pages/00-Destination/Destination";
import Location from "../../Pages/01-Location/Location";
import Activities from "../../Pages/02-Activities/Activities";
import Categories from "../../Pages/03-Categories/Categories";

const Settings: React.FC = () => {
    const [visibleSidebar, setVisibleSidebar] = useState<string | null>(null);

    return (
        <>
            <div>
                <div className="text-2xl font-semibold p-3">Settings</div>
                <div className="flex flex-row justify-evenly">
                    {/* Destination */}
                    <div className="text-[#0a5c9c]">
                        <Card style={{ color: "#0a5c9c" }} title="Destination">
                            <div className="w-[100%] flex justify-end ">
                                <FaArrowRight className="cursor-pointer" onClick={() => setVisibleSidebar("destination")} />
                            </div>
                        </Card>
                    </div>

                    {/* Location */}
                    <div>
                        <Card style={{ color: "#0a5c9c" }} title="Location">
                            <div className="w-[100%] flex justify-end ">
                                <FaArrowRight className="cursor-pointer" onClick={() => setVisibleSidebar("location")} />
                            </div>
                        </Card>
                    </div>

                    {/* Activities */}
                    <div>
                        <Card style={{ color: "#0a5c9c" }} title="Activities">
                            <div className="w-[100%] flex justify-end ">
                                <FaArrowRight className="cursor-pointer" onClick={() => setVisibleSidebar("activities")} />
                            </div>
                        </Card>
                    </div>

                    {/* Categories */}
                    <div>
                        <Card style={{ color: "#0a5c9c" }} title="Categories">
                            <div className="w-[100%] flex justify-end ">
                                <FaArrowRight className="cursor-pointer" onClick={() => setVisibleSidebar("categories")} />
                            </div>
                        </Card>
                    </div>
                    
                </div>
            </div>


            {/* Destination Sidebar */}
            <Sidebar style={{ width: "50vw" }} visible={visibleSidebar === "destination"} onHide={() => setVisibleSidebar(null)} position="right">
            <Destination />
            </Sidebar>

            {/* Location Sidebar */}
            <Sidebar style={{ width: "50vw" }} visible={visibleSidebar === "location"} onHide={() => setVisibleSidebar(null)} position="right">
             <Location/>
            </Sidebar>

            {/* Activities Sidebar */}
            <Sidebar style={{ width: "50vw" }} visible={visibleSidebar === "activities"} onHide={() => setVisibleSidebar(null)} position="right">
            <Activities/>
            </Sidebar>

            {/* Categories Sidebar */}
            <Sidebar style={{ width: "50vw" }} visible={visibleSidebar === "categories"} onHide={() => setVisibleSidebar(null)} position="right">
              <Categories/>
            </Sidebar>
        </>
    );
};

export default Settings;
