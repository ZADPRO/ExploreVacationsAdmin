import React, { useState, useEffect } from "react";
import axios from "axios";
import { decryptAPIResponse } from "../../utils";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";

interface ParkingUpdateProps {
  closeParkingupdatesidebar: () => void;
  refCarParkingId: string;
}
const Updateparking: React.FC<ParkingUpdateProps> = ({
  closeParkingupdatesidebar,
  refCarParkingId,
}) => {
  const [inputs, setInputs] = useState({
    refCarParkingId: refCarParkingId,
    refParkingTypeId: "",
    refParkingName: "",
    refAssociatedAirport: "",
    refLocation: "",
    refAvailability: "",
    refOperatingHours: "",
    refBookingType: "",
    pricePerHourORday: "",
    refPrice: "",
    refWeeklyDiscount: "",
    refExtraCharges: "",
    MinimumBookingDuration: null,
    MaximumBookingDuration: null,
    isCancellationAllowed: false,
    isRescheduleAllowed: false,
    ServiceFeatures: "",
    instructions: "",
    description: "",
    parkingSlotImage: "",
    refStatus: false,
  });
  const [carType, setCarType] = useState<any[]>([]);
  const [selectedVechileType, setSelectedVechileType] = useState(null);
  const [vechileType, setVechileType] = useState<any[]>([]);
  const [service, setService] = useState<any[]>([]);
  const [parking, setParking] = useState<any[]>([]);
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [parkingImg, setParkingImg] = useState("");
  const [serviceOption, setServiceOption] = useState<any[]>([]);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const [selectService, setSelectService] = useState<any[]>([]);

  const fetchSingleIDParkingdataForm = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/getCarParking",
        {
          refCarParkingId: refCarParkingId,
        },
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

      console.log("fetchSingleIDParkingdataForm----------------", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setInputs(data.result[0]);
        setSelectedCarType(data.result[0].refParkingTypeId);
        setSelectedVechileType(data.result[0].refCarParkingTypeId);
        setSelectService(data.result[0].ServiceFeature);
      }
    } catch (e) {
      console.error("Error fetching Parking data:", e);
    }
  };
  const fetchCarType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/getCarType",
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
      console.log("data car details", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchCarType--------->", data);
        setCarType(data.Data);
        // setVechileType(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };
  const fetchParking = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/listCarParking",
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
      console.log("get parking", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("parking data--------->", data);
        setParking(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching :", e);
    }
  };

  const fetchVechileType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/getCarParkingType",
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
      console.log("data car details", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchVechileType--------->", data);
        setVechileType(data.vehicleType);
        console.log("fetchVechileType array--------->", data.vehicleType);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  useEffect(() => {
    fetchService();
    fetchCarType();
    fetchParking();
    fetchVechileType();
    fetchSingleIDParkingdataForm();
  }, []);

  const Updateparking = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/updateCarParking",
        {
          refCarParkingTypeId: selectedVechileType,
          refCarParkingId: inputs.refCarParkingId,
          refParkingTypeId: selectedCarType,
          refParkingName: inputs.refParkingName,
          refAssociatedAirport: inputs.refAssociatedAirport,
          refLocation: inputs.refLocation,
          refAvailability: inputs.refAvailability,
          refOperatingHours: inputs.refOperatingHours,
          refBookingType: inputs.refBookingType,
          pricePerHourORday: inputs.pricePerHourORday,
          refPrice: inputs.refPrice,
          refWeeklyDiscount: inputs.refWeeklyDiscount,
          refExtraCharges: inputs.refExtraCharges,
          MinimumBookingDuration: inputs.MinimumBookingDuration,
          MaximumBookingDuration: inputs.MaximumBookingDuration,
          isCancellationAllowed: inputs.isCancellationAllowed,
          isRescheduleAllowed: inputs.isRescheduleAllowed,
          // ServiceFeatures: inputs.ServiceFeatures,
          ServiceFeatures: selectService.map((exc: number) => exc.toString()),

          instructions: inputs.instructions,
          description: inputs.description,
          parkingSlotImage:
            parkingImg === "" ? inputs.parkingSlotImage : parkingImg,
          refStatus: inputs.refStatus,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("token line 126======", token);

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      setSubmitLoading(false);
      console.log("data---------->Parking data", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
      }
    } catch (e) {
      console.log("Error adding staff:", e);
      setSubmitLoading(false);
    }
  };

  const fetchService = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/listServiceFeatures",
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
      console.log("data-------------->service", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setService(data.result);
        setServiceOption(data.result);
        console.log("Service------", data.result);
      }
    } catch (e: any) {
      console.log("Error fetching service:", e);
    }
  };

  const parkingImage = async (event: any) => {
    console.table("event", event);
    const file = event.files[0]; // Assuming single file upload
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    for (let pair of formData.entries()) {
      console.log("-------->______________", pair[0] + ":", pair[1]);
    }

    console.log("formData------------>", formData);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carParkingRoutes/uploadParkingImage",

        formData,

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("token", "Bearer " + data.token);
      console.log("data==============", data);

      if (data.success) {
        console.log("data+", data);
        handleUploadSuccessMap(data);
      } else {
        console.log("data-", data);
        handleUploadFailure(data);
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };

  const handleUploadSuccessMap = (response: any) => {
    console.log("Upload Successful:", response);
    setParkingImg(response.files[0].fileName);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleValue = (e: any) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDropdownChange = (e: DropdownChangeEvent) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">
          Update New Parking Package ID: {refCarParkingId}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            Updateparking();
          }}
          method="post"
        >
          <InputText
            name="refParkingName"
            value={inputs.refParkingName}
            onChange={handleInput}
            placeholder="Enter Parking Name"
            className="w-full mt-4"
          />

          <div className="flex flex-row gap-3 mt-3">
            <Dropdown
              value={selectedCarType}
              onChange={(e: DropdownChangeEvent) => {
                setSelectedCarType(e.value);
              }}
              options={carType}
              optionValue="refCarTypeId"
              optionLabel="refCarTypeName"
              placeholder="Choose Car Type"
              className="w-full"
              required
            />

            <Dropdown
              value={selectedVechileType}
              onChange={(e: DropdownChangeEvent) => {
                setSelectedVechileType(e.value);
              }}
              options={vechileType}
              optionValue="refCarParkingTypeId"
              optionLabel="refCarParkingTypeName"
              placeholder="Choose Vechile Type"
              className="w-full"
              dataKey="refParkingTypeId"
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refAssociatedAirport"
              value={inputs.refAssociatedAirport}
              onChange={handleInput}
              placeholder="Nearby AssociatedAirport"
              className="w-full"
              required
            />
          </div>

          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refLocation"
              value={inputs.refLocation}
              onChange={handleInput}
              placeholder="Enter Location"
              className="w-full"
              required
            />
            <InputText
              name="refAvailability"
              value={inputs.refAvailability}
              onChange={handleInput}
              placeholder="Enter Availability"
              className="w-full"
              required
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refOperatingHours"
              value={inputs.refOperatingHours}
              onChange={handleInput}
              placeholder="Enter OperatingHours"
              className="w-full"
              required
            />
            <InputText
              name="refBookingType"
              value={inputs.refBookingType}
              onChange={handleInput}
              placeholder="Enter BookingType (Online/Offline)"
              className="w-full"
              required
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="pricePerHourORday"
              value={inputs.pricePerHourORday}
              onChange={handleInput}
              placeholder="Price Per Hour/Day"
              className="w-full"
              required
            />
            <InputText
              name="refPrice"
              value={inputs.refPrice}
              onChange={handleInput}
              placeholder="Enter Price"
              className="w-full"
              required
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refWeeklyDiscount"
              value={inputs.refWeeklyDiscount}
              onChange={handleInput}
              placeholder="Enter Weekly Discount"
              className="w-full"
              required
            />
            <InputText
              name="refExtraCharges"
              value={inputs.refExtraCharges}
              onChange={handleInput}
              placeholder="Enter Extra Charges"
              className="w-full"
              required
            />
          </div>

          <div className="flex flex-row gap-3 mt-3">
            {/* <Calendar
                                name="MinimumBookingDuration"
                                value={inputs.MinimumBookingDuration}
                                onChange={handleInput}
                                placeholder="Min Booking Duration"
                                className="w-full"
                                required
                              /> */}
            {/* <Calendar
                                name="MaximumBookingDuration"
                                value={inputs.MaximumBookingDuration}
                                onChange={handleInput}
                                placeholder="Max Booking Duration"
                                className="w-full"
                                required
                              /> */}
            <Calendar
              name="MinimumBookingDuration"
              value={inputs.MinimumBookingDuration}
              placeholder="Min Booking Duration"
              onChange={handleValue}
            />
            <Calendar
              name="MaximumBookingDuration"
              value={inputs.MaximumBookingDuration}
              placeholder="Min Booking Duration"
              onChange={handleValue}
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <Dropdown
              name="isCancellationAllowed"
              value={inputs.isCancellationAllowed}
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              onChange={handleDropdownChange}
              className="w-[48%]"
              placeholder="Cancellation"
            />
            <Dropdown
              name="isRescheduleAllowed"
              value={inputs.isRescheduleAllowed}
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              onChange={handleDropdownChange}
              className="w-[48%]"
              placeholder="Reschedule "
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="instructions"
              value={inputs.instructions}
              onChange={handleInput}
              placeholder="Enter instructions"
              className="w-full"
              required
            />
            <InputText
              name="description"
              value={inputs.description}
              onChange={handleInput}
              placeholder="Enter description"
              className="w-full"
              required
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <MultiSelect
              value={selectService}
              onChange={(e) => {
                setSelectService(e.value);
                console.log("service-->", e.value);
              }}
              options={serviceOption}
              optionLabel="refServiceFeatures"
              optionValue="refServiceFeaturesId"
              display="chip"
              placeholder="Select Service Features"
              maxSelectedLabels={1}
              className="w-full md:w-20rem"
              required
            />

            <Dropdown
              name="refStatus"
              value={inputs.refStatus}
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              onChange={handleDropdownChange}
              className="w-[48%]"
              placeholder="Status "
            />
          </div>

          {/* Parking Image upload */}

          <div>
            <h2 className="mt-3">Upload Parking Image </h2>
            <FileUpload
              name="logo"
              customUpload
              className="mt-3"
              uploadHandler={parkingImage}
              accept="image/*"
              maxFileSize={10000000}
              emptyTemplate={
                <p className="m-0">Drag and drop your Map here to upload.</p>
              }
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="submit" label="Submit" />
          </div>
        </form>

        <div></div>
      </div>
    </div>
  );
};

export default Updateparking;
