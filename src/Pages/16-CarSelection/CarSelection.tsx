import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import '../../Pages/16-CarSelection/carselection.css'
import { MultiSelect } from "primereact/multiselect";
import { useTranslation } from "react-i18next";
// import { X } from "lucide-react";
import axios from "axios";
import { decryptAPIResponse } from "../../utils";
import Dashboard from "../../component/02-Dashboard/Dashboard";

export const FromToLocations: React.FC = () => {
  const [fromLocations, setFromLocations] = useState<any[]>([]);
  const [toLocations, setToLocations] = useState<any[]>([]);
  const [showFromForm, setShowFromForm] = useState(false);
  const [showToForm, setShowToForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editFromSidebar, setEditFromSidebar] = useState(false);
  const [editToSidebar, setEditToSidebar] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);

  const { t } = useTranslation("global");
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedLocationDelete, setSelectedLocationDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'from' | 'to'>('from');

  const [suggestions, setSuggestions] = useState<any[]>([]);
  // const staticCarBadges = [
  //   { refBadgeId: 1, refBadgeName: "BEST VALUE", refBadgeColor: "#10b981" },
  //   { refBadgeId: 2, refBadgeName: "MOST POPULAR", refBadgeColor: "#fbbf24" },
  //   { refBadgeId: 3, refBadgeName: "TOP CLASS", refBadgeColor: "#8b5cf6" },
  //   { refBadgeId: 4, refBadgeName: "PREMIUM", refBadgeColor: "#ef4444" },
  // ];
  const [inputs, setInputs] = useState({
    refLocation: "",
    refArea: "",
    refStreet: "",
    refCity: "",
    refState: "",
    refCountry: "",
    refPincode: "",

  });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchFromLocations();
    fetchToLocations();
  }, []);

  const fetchFromLocations = async () => {
    try {
      const dummyLocations = [
        {
          id: 1,
          refLocation: "London Heathrow Airport",
          refArea: "Terminal 5",
          refStreet: "Heathrow Airport",
          refCity: "London",
          refState: "England",
          refCountry: "United Kingdom",
          refPincode: "TW6 1EW",
        },
        {
          id: 2,
          refLocation: "Brussels Airport",
          refArea: "Terminal 1",
          refStreet: "Brussels Airport",
          refCity: "Brussels",
          refState: "Brussels",
          refCountry: "Belgium",
          refPincode: "1930",
        },
      ];
      setFromLocations(dummyLocations);
    } catch (error) {
      console.error("Error fetching from locations:", error);
    }
  };

  const fetchToLocations = async () => {
    try {
      const dummyLocations = [
        {
          id: 1,
          refLocation: "Milan Malpensa Airport",
          refArea: "Terminal 1",
          refStreet: "Malpensa Airport",
          refCity: "Milan",
          refState: "Lombardy",
          refCountry: "Italy",
          refPincode: "21010",
        },
      ];
      setToLocations(dummyLocations);
    } catch (error) {
      console.error("Error fetching to locations:", error);
    }
  };

  const searchLocation = (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const dummySuggestions = [
      `${query} Airport, London, United Kingdom`,
      `${query} City Center, London, United Kingdom`,
      `${query} Station, Manchester, United Kingdom`,
      `${query} Airport, Milan, Italy`,
      `${query} Central, Paris, France`,
    ];

    setSuggestions(dummySuggestions);
  };

  const handleLocationSelect = (e: any) => {
    const selected = e.value;
    const parts = selected.split(',').map((s: string) => s.trim());

    setInputs({
      ...inputs,
      refLocation: parts[0] || '',
      refArea: parts[1] || '',
      refCity: parts[1] || '',
      refState: parts.length > 2 ? parts[parts.length - 2] : '',
      refCountry: parts[parts.length - 1] || '',
      refStreet: '',
      refPincode: '',
    });
  };
  // Fetch Car Badges
  // const fetchCarBadges = async () => {
  //   try {
  //     const response = await axios.get(
  //       import.meta.env.VITE_API_URL + "/carsRoutes/listCarBadges",
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

  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);
  //       setCarBadges(data.result);
  //     }
  //   } catch (e) {
  //     console.error("Error fetching badges:", e);
  //   }
  // };

  const addNewLocation = async (type: 'from' | 'to') => {
    if (!inputs.refLocation) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter location name",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const newLocation = {
        id: type === 'from' ? fromLocations.length + 1 : toLocations.length + 1,
        ...inputs
      };

      if (type === 'from') {
        setFromLocations([...fromLocations, newLocation]);
        setShowFromForm(false);
      } else {
        setToLocations([...toLocations, newLocation]);
        setShowToForm(false);
      }

      resetForm();

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Location added successfully",
        life: 3000,
      });

      setSubmitLoading(false);
    } catch (error) {
      console.error("Error adding location:", error);
      setSubmitLoading(false);
    }
  };

  const openEditSidebar = (location: any, type: 'from' | 'to') => {
    setEditingLocation({ ...location, type });
    setInputs({
      refLocation: location.refLocation,
      refArea: location.refArea,
      refStreet: location.refStreet,
      refCity: location.refCity,
      refState: location.refState,
      refCountry: location.refCountry,
      refPincode: location.refPincode,
    });

    if (type === 'from') {
      setEditFromSidebar(true);
    } else {
      setEditToSidebar(true);
    }
  };

  const updateLocation = async () => {
    if (!inputs.refLocation) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter location name",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      if (editingLocation.type === 'from') {
        const updatedLocations = fromLocations.map(loc =>
          loc.id === editingLocation.id ? { ...loc, ...inputs } : loc
        );
        setFromLocations(updatedLocations);
        setEditFromSidebar(false);
      } else {
        const updatedLocations = toLocations.map(loc =>
          loc.id === editingLocation.id ? { ...loc, ...inputs } : loc
        );
        setToLocations(updatedLocations);
        setEditToSidebar(false);
      }

      resetForm();

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Location updated successfully",
        life: 3000,
      });

      setSubmitLoading(false);
    } catch (error) {
      console.error("Error updating location:", error);
      setSubmitLoading(false);
    }
  };

  const deleteLocation = async () => {
    setSubmitLoading(true);

    try {
      if (deleteType === 'from') {
        setFromLocations(fromLocations.filter(loc => loc.id !== selectedLocationDelete.id));
      } else {
        setToLocations(toLocations.filter(loc => loc.id !== selectedLocationDelete.id));
      }

      setVisibleDialog(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Location deleted successfully",
        life: 3000,
      });

      setSubmitLoading(false);
    } catch (error) {
      console.error("Error deleting location:", error);
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setInputs({
      refLocation: "",
      refArea: "",
      refStreet: "",
      refCity: "",
      refState: "",
      refCountry: "",
      refPincode: "",
    });
  };

  const actionTemplate = (rowData: any, type: 'from' | 'to') => (
    <Button
      icon="pi pi-trash"
      severity="danger"
      text
      onClick={() => {
        setSelectedLocationDelete(rowData);
        setDeleteType(type);
        setVisibleDialog(true);
      }}
    />
  );

  const LocationForm = ({ type }: { type: 'from' | 'to' }) => (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-lg mb-3">{type === 'from' ? 'From' : 'To'} {t("dashboard.Location")}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="font-medium block mb-2">{t("dashboard.Search Location")} *</label>
          <AutoComplete
            value={inputs.refLocation}
            suggestions={suggestions}
            completeMethod={(e) => searchLocation(e.query)}
            onChange={(e) => setInputs({ ...inputs, refLocation: e.value })}
            onSelect={handleLocationSelect}
            placeholder="Start typing location name"
            className="w-full"
            inputClassName="w-full p-inputtext-sm"
            dropdown
          />
        </div>

        <div>
          <label className="font-medium block mb-2">{t("dashboard.Area/Locality")}</label>
          <InputText
            value={inputs.refArea}
            onChange={(e) => setInputs({ ...inputs, refArea: e.target.value })}
            placeholder="e.g., Terminal 5"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">{t("dashboard.Street/Road")}</label>
          <InputText
            value={inputs.refStreet}
            onChange={(e) => setInputs({ ...inputs, refStreet: e.target.value })}
            placeholder="e.g., Airport Road"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">{t("dashboard.City")} *</label>
          <InputText
            value={inputs.refCity}
            onChange={(e) => setInputs({ ...inputs, refCity: e.target.value })}
            placeholder="e.g., London"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">{t("dashboard.State/Region")}</label>
          <InputText
            value={inputs.refState}
            onChange={(e) => setInputs({ ...inputs, refState: e.target.value })}
            placeholder="e.g., England"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">{t("dashboard.Country")} *</label>
          <InputText
            value={inputs.refCountry}
            onChange={(e) => setInputs({ ...inputs, refCountry: e.target.value })}
            placeholder="e.g., United Kingdom"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">{t("dashboard.Pincode/Postal Code")}</label>
          <InputText
            value={inputs.refPincode}
            onChange={(e) => setInputs({ ...inputs, refPincode: e.target.value })}
            placeholder="e.g., TW6 1EW"
            className="p-inputtext-sm w-full"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <Button
          label="Cancel"
          severity="secondary"
          onClick={() => {
            if (type === 'from') {
              setShowFromForm(false);
            } else {
              setShowToForm(false);
            }
            resetForm();
          }}
        />
        <Button
          label="Add Location"
          onClick={() => addNewLocation(type)}
          loading={submitLoading}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />

      {/* FROM LOCATIONS TABLE */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#0a5c9c] mb-4">{t("dashboard.From Locations")}</h2>

        {!showFromForm ? (
          <>
            <div className="flex justify-end mb-4">
              <Button
                label="Add New From Location"
                severity="success"
                onClick={() => setShowFromForm(true)}
              />
            </div>

            <DataTable value={fromLocations} tableStyle={{ minWidth: "50rem" }} paginator rows={5}>
              <Column
                header="S.No"
                body={(_, options) => options.rowIndex + 1}
                style={{ width: "3rem" }}
              />

              <Column
                field="refLocation"
                header="Location"
                style={{ width: "15rem" }}
                body={(rowData) => (
                  <div
                    className="text-[#0a5c9c] cursor-pointer underline"
                    onClick={() => openEditSidebar(rowData, 'from')}
                  >
                    {rowData.refLocation}
                  </div>
                )}
              />

              <Column field="refCity" header="City" style={{ width: "10rem" }} />
              <Column field="refState" header="State" style={{ width: "10rem" }} />
              <Column field="refCountry" header="Country" style={{ width: "12rem" }} />
              <Column field="refPincode" header="Pincode" style={{ width: "8rem" }} />

              <Column
                header="Actions"
                body={(rowData) => actionTemplate(rowData, 'from')}
                style={{ width: "8rem" }}
              />
            </DataTable>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Add New From Location</h3>
              <Button
                icon="pi pi-arrow-left"
                label="Back to List"
                severity="secondary"
                onClick={() => {
                  setShowFromForm(false);
                  resetForm();
                }}
              />
            </div>
            <LocationForm type="from" />
          </>
        )}
      </div>

      {/* TO LOCATIONS TABLE */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#0a5c9c] mb-4">{t("dashboard.To Locations")}</h2>

        {!showToForm ? (
          <>
            <div className="flex justify-end mb-4">
              <Button
                label="Add New To Location"
                severity="success"
                onClick={() => setShowToForm(true)}
              />
            </div>

            <DataTable value={toLocations} tableStyle={{ minWidth: "50rem" }} paginator rows={5}>
              <Column
                header="S.No"
                body={(_, options) => options.rowIndex + 1}
                style={{ width: "3rem" }}
              />

              <Column
                field="refLocation"
                header="Location"
                style={{ width: "15rem" }}
                body={(rowData) => (
                  <div
                    className="text-[#0a5c9c] cursor-pointer underline"
                    onClick={() => openEditSidebar(rowData, 'to')}
                  >
                    {rowData.refLocation}
                  </div>
                )}
              />

              <Column field="refCity" header="City" style={{ width: "10rem" }} />
              <Column field="refState" header="State" style={{ width: "10rem" }} />
              <Column field="refCountry" header="Country" style={{ width: "12rem" }} />
              <Column field="refPincode" header="Pincode" style={{ width: "8rem" }} />

              <Column
                header="Actions"
                body={(rowData) => actionTemplate(rowData, 'to')}
                style={{ width: "8rem" }}
              />
            </DataTable>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">{t("dashboard.Add New To Location")}</h3>
              <Button
                icon="pi pi-arrow-left"
                label="Back to List"
                severity="secondary"
                onClick={() => {
                  setShowToForm(false);
                  resetForm();
                }}
              />
            </div>
            <LocationForm type="to" />
          </>
        )}
      </div>

      {/* Edit FROM Sidebar */}
      <Sidebar
        visible={editFromSidebar}
        onHide={() => setEditFromSidebar(false)}
        position="right"
        style={{ width: "600px" }}
      >
        <h2 className="text-xl font-bold mb-6">{t("dashboard.Edit From Location")}</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium block mb-2">{t("dashboard.Location Name")} *</label>
            <InputText
              value={inputs.refLocation}
              onChange={(e) => setInputs({ ...inputs, refLocation: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Area")}</label>
            <InputText
              value={inputs.refArea}
              onChange={(e) => setInputs({ ...inputs, refArea: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Street")}</label>
            <InputText
              value={inputs.refStreet}
              onChange={(e) => setInputs({ ...inputs, refStreet: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.City")} *</label>
            <InputText
              value={inputs.refCity}
              onChange={(e) => setInputs({ ...inputs, refCity: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.State")}</label>
            <InputText
              value={inputs.refState}
              onChange={(e) => setInputs({ ...inputs, refState: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Country")} *</label>
            <InputText
              value={inputs.refCountry}
              onChange={(e) => setInputs({ ...inputs, refCountry: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Pincode")}</label>
            <InputText
              value={inputs.refPincode}
              onChange={(e) => setInputs({ ...inputs, refPincode: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setEditFromSidebar(false)}
            />
            <Button
              label="Update Location"
              onClick={updateLocation}
              loading={submitLoading}
            />
          </div>
        </div>
      </Sidebar>

      {/* Edit TO Sidebar */}
      <Sidebar
        visible={editToSidebar}
        onHide={() => setEditToSidebar(false)}
        position="right"
        style={{ width: "600px" }}
      >
        <h2 className="text-xl font-bold mb-6">{t("dashboard.Edit To Location")}</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium block mb-2">{t("dashboard.Location Name")} *</label>
            <InputText
              value={inputs.refLocation}
              onChange={(e) => setInputs({ ...inputs, refLocation: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Area")}</label>
            <InputText
              value={inputs.refArea}
              onChange={(e) => setInputs({ ...inputs, refArea: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Street")}</label>
            <InputText
              value={inputs.refStreet}
              onChange={(e) => setInputs({ ...inputs, refStreet: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.City")} *</label>
            <InputText
              value={inputs.refCity}
              onChange={(e) => setInputs({ ...inputs, refCity: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.State")}</label>
            <InputText
              value={inputs.refState}
              onChange={(e) => setInputs({ ...inputs, refState: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Country")} *</label>
            <InputText
              value={inputs.refCountry}
              onChange={(e) => setInputs({ ...inputs, refCountry: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">{t("dashboard.Pincode")}</label>
            <InputText
              value={inputs.refPincode}
              onChange={(e) => setInputs({ ...inputs, refPincode: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setEditToSidebar(false)}
            />
            <Button
              label="Update Location"
              onClick={updateLocation}
              loading={submitLoading}
            />
          </div>
        </div>
      </Sidebar>

      {/* Delete Dialog */}
      <Dialog
        header="Confirm Deletion"
        visible={visibleDialog}
        style={{ width: "350px" }}
        modal
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
              loading={submitLoading}
              onClick={deleteLocation}
            />
          </div>
        }
      >
        <p>{t("dashboard.Are you sure you want to delete this location?")}</p>
      </Dialog>
    </div>
  );
};
export const CarSelection: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editSidebar, setEditSidebar] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedCarDelete, setSelectedCarDelete] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [carImage, setCarImage] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const [badges, setBadges] = useState<any[]>([]);
  const [editBadgeId, setEditBadgeId] = useState<number | null>(null);
  const [editBadgeValue, setEditBadgeValue] = useState({ refBadgeName: "", refBadgeColor: "" });
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeColor, setNewBadgeColor] = useState("#10b981");
  const [badgeDialogVisible, setBadgeDialogVisible] = useState(false);
  const [selectedBadgeDelete, setSelectedBadgeDelete] = useState<number | null>(null);

  const [services, setServices] = useState<any[]>([]);
  const [editServiceId, setEditServiceId] = useState<number | null>(null);
  const [editServiceValue, setEditServiceValue] = useState({ refServiceName: "" });
  const [newServiceName, setNewServiceName] = useState("");
  const [serviceDialogVisible, setServiceDialogVisible] = useState(false);
  const [selectedServiceDelete, setSelectedServiceDelete] = useState<number | null>(null);

  const toast = useRef<Toast>(null);

  const [newCar, setNewCar] = useState({
    name: "",
    brand: "",
    price: "",
    specialPrice: "",
    showSpecialPrice: false,
    passengers: "",
    luggage: "",
    mileage: "",
    description: "",
    selectedBadges: [] as any,
    selectedServices: [] as any[]
  });


  useEffect(() => {
    fetchCars();
    fetchServices();
    fetchBadges();
  }, []);


  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transferRoutes/cars`,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
          },
        }
      );

      console.log("ENCRYPTED CASS RESPONSE => ", response.data);
      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED y => ", decrypted);
      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to fetch cars");
      }

      const carsData = decrypted.data?.map((car: any) => ({
        id: car.id,
        name: car.car_name,
        brand: car.car_brand,

        image: car.car_image_base64 ?? car.car_image,

        price: parseFloat(car.price),
        passengers: car.passengers,
        luggage: car.luggage,
        mileage: car.mileage,
        description: car.description,
        selectedBadges: parseBadgeIds(car.car_badges),
        selectedServices: parseServiceIds(car.car_services),
        showSpecialPrice: +car.specialPrice > 0,
        specialPrice: parseFloat(car.specialPrice || 0),
      }));

      setCars(carsData);

    } catch (err: any) {
      console.error("Error fetching cars:", err);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Unable to load cars",
        life: 3000,
      });
    }
  };


  const uploadCarImage = async (event: any) => {
    const file = event.files?.[0];
    if (!file) return;

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("images", file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/carRoutes/uploadImages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const decrypted = decryptAPIResponse(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Upload failed");
      }
      const fullPath = decrypted.filePath;
      const cleanedPath = fullPath.replace(/\\/g, "/");

      setCarImage(cleanedPath);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decrypted.message || "Image uploaded successfully",
      });

    } catch (err: any) {
      console.error("Upload error:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Failed to upload image",
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  const addNewCar = async () => {
    if (
      !newCar.name ||
      !newCar.brand ||
      !newCar.price ||
      !newCar.passengers ||
      !newCar.luggage ||
      !newCar.mileage ||
      !carImage
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all required fields and upload an image",
        life: 3000,
      });
      return;
    }

    if (newCar.showSpecialPrice && !newCar.specialPrice) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter special price",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const badgeIds = Array.isArray(newCar.selectedBadges)
        ? newCar.selectedBadges.map((b: any) => b.refBadgeId)
        : [];

      const serviceIds = Array.isArray(newCar.selectedServices)
        ? newCar.selectedServices.map((s: any) => s.refServiceId)
        : [];

      console.log('CarSelection.tsx / carImage / 999 -------------------  ', carImage);
      const payload = {
        car_name: newCar.name,
        car_brand: newCar.brand,
        car_image: carImage,
        price: newCar.price.toString(),
        passengers: newCar.passengers.toString(),
        luggage: newCar.luggage.toString(),
        // manufacturer_year: newCar.year || "", // ⬅ if you add manufacturer year later
        mileage: newCar.mileage,
        description: newCar.description,
        car_badges: JSON.stringify(badgeIds),
        car_services: JSON.stringify(serviceIds),
        specialPrice: newCar.showSpecialPrice ? newCar.specialPrice.toString() : "",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transferRoutes/addCar`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Encrypted ADD CAR response:", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("Decrypted ADD CAR:", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to add car");
      }

      const saved = decrypted.data;
      console.log('CarSelection.tsx / saved / 1037 -------------------  ', saved);


      await fetchCars()
      resetCarForm();
      setShowForm(false);
      setActiveTab(0);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decrypted.message || "Car added successfully",
        life: 3000,
      });
    } catch (error: any) {
      console.error("Error adding car:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to add car",
        life: 3000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  const parseBadgeIds = (badgesString: string) => {
    try {
      const ids = JSON.parse(badgesString);
      return badges.filter(b => ids.includes(b.refBadgeId));
    } catch {
      return [];
    }
  };

  const parseServiceIds = (servicesString: string) => {
    try {
      const ids = JSON.parse(servicesString);
      return services.filter(s => ids.includes(s.refServiceId));
    } catch {
      return [];
    }
  };


  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transferRoutes/services`,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ENCRYPTED SERVICES RESPONSE => ", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1], // encrypted data
        response.data[0], // encrypted iv
        import.meta.env.VITE_ENCRYPTION_KEY // key
      );

      console.log("DECRYPTED SERVICES => ", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to fetch services");
      }

      const formatted = decrypted.data?.map((item: any) => ({
        refServiceId: item.id,
        refServiceName: item.carService,
      })) || [];

      setServices(formatted);
    } catch (error: any) {
      console.error("Error fetching services:", error);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load services",
        life: 3000,
      });
    }
  };

  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/carBadges`,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ENCRYPTED BADGES RESPONSE => ", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED BADGES => ", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to fetch badges");
      }
      const formatted = decrypted.data?.map((item: any) => ({
        refBadgeId: item.id,
        refBadgeName: item.badgeName,
        refBadgeColor: item.badgeColorCode,
      })) || [];

      setBadges(formatted);
    } catch (error: any) {
      console.error("Error fetching badges:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load badges",
        life: 3000,
      });
    }
  };






  const handleBadgeInputChange = (e: any, field: string) => {
    setEditBadgeValue({
      ...editBadgeValue,
      [field]: e.target.value
    });
  };

  const addNewBadge = async () => {
    if (!newBadgeName.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter a badge name",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        badgeName: newBadgeName.trim(),
        badgeColorCode: newBadgeColor,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/carBadges`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ENCRYPTED ADD BADGE RESPONSE => ", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED ADD BADGE => ", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to create badge");
      }

      const newData = decrypted.data;

      const newBadge = {
        refBadgeId: newData.id,
        refBadgeName: newData.badgeName,
        refBadgeColor: newData.badgeColorCode,
      };

      setBadges([...badges, newBadge]);
      setNewBadgeName("");
      setNewBadgeColor("#10b981");

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decrypted.message,
        life: 3000,
      });
    } catch (error: any) {
      console.error("Error adding badge:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to add badge",
        life: 3000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };


  const updateBadge = async (id: number) => {
    if (!editBadgeValue.refBadgeName.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter a badge name",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        badgeName: editBadgeValue.refBadgeName.trim(),
        badgeColorCode: editBadgeValue.refBadgeColor,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/carBadges/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ENCRYPTED UPDATE BADGE RESPONSE => ", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED UPDATE BADGE => ", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to update badge");
      }

      const updated = decrypted.data;

      const updatedList = badges.map((badge) =>
        badge.refBadgeId === id
          ? {
            refBadgeId: updated.id,
            refBadgeName: updated.badgeName,
            refBadgeColor: updated.badgeColorCode,
          }
          : badge
      );

      setBadges(updatedList);
      setEditBadgeId(null);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decrypted.message,
        life: 3000,
      });
    } catch (error: any) {
      console.error("Error updating badge:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to update badge",
        life: 3000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };


  const deleteBadge = async (id: number) => {
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/carBadges/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ENCRYPTED DELETE BADGE RESPONSE => ", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED DELETE BADGE => ", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to delete badge");
      }

      setBadges(badges.filter((badge) => badge.refBadgeId !== id));
      setBadgeDialogVisible(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decrypted.message,
        life: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting badge:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete badge",
        life: 3000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };



  const badgeActionTemplate = (rowData: any) => (
    <div className="flex gap-2">
      {editBadgeId === rowData.refBadgeId ? (
        <>
          <Button
            icon="pi pi-check"
            severity="success"
            text
            onClick={() => updateBadge(rowData.refBadgeId)}
          />
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            onClick={() => setEditBadgeId(null)}
          />
        </>
      ) : (
        <>
          <Button
            icon="pi pi-pencil"
            severity="info"
            text
            onClick={() => {
              setEditBadgeId(rowData.refBadgeId);
              setEditBadgeValue({
                refBadgeName: rowData.refBadgeName,
                refBadgeColor: rowData.refBadgeColor
              });
            }}
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            onClick={() => {
              setSelectedBadgeDelete(rowData.refBadgeId);
              setBadgeDialogVisible(true);
            }}
          />
        </>
      )}
    </div>
  );

  const handleServiceInputChange = (e: any, field: string) => {
    setEditServiceValue({
      ...editServiceValue,
      [field]: e.target.value
    });
  };
  const addNewService = async () => {
    if (!newServiceName.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter a service name",
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = { carService: newServiceName.trim() };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transferRoutes/addServices`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("RAW ENCRYPTED SERVICE RESPONSE => ", response.data);

      const decryptedData = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED SERVICE RESPONSE => ", decryptedData);

      if (!decryptedData.success) {
        throw new Error(decryptedData.message || "Request failed");
      }

      const newItem = decryptedData.data; // backend returns inside data

      setServices([
        ...services,
        {
          refServiceId: newItem.id,
          refServiceName: newItem.carService,
        },
      ]);

      setNewServiceName("");

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decryptedData.message,
      });

    } catch (error: any) {
      console.error("Error adding service:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to add service",
      });
    } finally {
      setSubmitLoading(false);
    }
  };


  const updateService = async (id: number) => {
    if (!editServiceValue.refServiceName.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter a service name",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = { carService: editServiceValue.refServiceName.trim() };
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/transferRoutes/services/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("UPDATE SERVICE RESPONSE => ", res.data);
      const decryptedData = decryptAPIResponse(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("DECRYPTED SERVICE RESPONSE => ", decryptedData);

      if (!decryptedData.success) {
        throw new Error(decryptedData.message || "Failed to update service");
      }

      const updatedItem = decryptedData.data;

      // Update UI after success
      const updatedServices = services.map(service =>
        service.refServiceId === id
          ? { refServiceId: updatedItem.id, refServiceName: updatedItem.carService }
          : service
      );

      setServices(updatedServices);
      setEditServiceId(null);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decryptedData.message,
        life: 3000,
      });

    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to update service",
        life: 3000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };


  const deleteService = async (id: number) => {
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/transferRoutes/services/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ENCRYPTED DELETE RESPONSE => ", response.data);

      const decryptedData = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED DELETE RESPONSE => ", decryptedData);

      if (!decryptedData.success) {
        throw new Error(decryptedData.message || "Failed to delete");
      }

      setServices(services.filter(service => service.refServiceId !== id));
      setServiceDialogVisible(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decryptedData.message || "Service deleted successfully",
        life: 3000,
      });

    } catch (error: any) {
      console.error("Error deleting service:", error);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete service",
        life: 3000,
      });

    } finally {
      setSubmitLoading(false);
    }
  };


  const serviceActionTemplate = (rowData: any) => (
    <div className="flex gap-2">
      {editServiceId === rowData.refServiceId ? (
        <>
          <Button
            icon="pi pi-check"
            severity="success"
            text
            onClick={() => updateService(rowData.refServiceId)}
          />
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            onClick={() => setEditServiceId(null)}
          />
        </>
      ) : (
        <>
          <Button
            icon="pi pi-pencil"
            severity="info"
            text
            onClick={() => {
              setEditServiceId(rowData.refServiceId);
              setEditServiceValue({
                refServiceName: rowData.refServiceName
              });
            }}
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            onClick={() => {
              setSelectedServiceDelete(rowData.refServiceId);
              setServiceDialogVisible(true);
            }}
          />
        </>
      )}
    </div>
  );



  const openEditSidebar = (car: any) => {
    setEditingCar(car);
    setNewCar({
      name: car.name,
      brand: car.brand || "",
      price: car.price.toString(),
      specialPrice: car.specialPrice ? car.specialPrice.toString() : "",
      showSpecialPrice: car.showSpecialPrice || false,
      passengers: car.passengers.toString(),
      luggage: car.luggage.toString(),
      mileage: car.mileage,
      description: car.description || "",
      selectedBadges: (car.selectedBadges) ? car.selectedBadges : [],
      selectedServices: Array.isArray(car.selectedServices) ? car.selectedServices : []
    });
    setCarImage(car.image);
    setEditSidebar(true);
  };

  const updateCar = async () => {
    if (
      !newCar.name ||
      !newCar.brand ||
      !newCar.price ||
      !newCar.passengers ||
      !newCar.luggage ||
      !newCar.mileage ||
      !carImage
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all required fields and upload an image",
        life: 3000,
      });
      return;
    }

    if (newCar.showSpecialPrice && !newCar.specialPrice) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter special price",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const badgeIds = Array.isArray(newCar.selectedBadges)
        ? newCar.selectedBadges.map((b: any) => b.refBadgeId)
        : [];

      const serviceIds = Array.isArray(newCar.selectedServices)
        ? newCar.selectedServices.map((s: any) => s.refServiceId)
        : [];

      const payload = {
        car_name: newCar.name,
        car_brand: newCar.brand,
        car_image: carImage, // only filename
        price: newCar.price.toString(),
        passengers: newCar.passengers.toString(),
        luggage: newCar.luggage.toString(),
        // manufacturer_year: newCar.year || "",
        mileage: newCar.mileage,
        description: newCar.description,
        car_badges: JSON.stringify(badgeIds),
        car_services: JSON.stringify(serviceIds),
        specialPrice: newCar.showSpecialPrice ? newCar.specialPrice.toString() : "",
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/transferRoutes/cars/${editingCar.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Encrypted Update Car Response:", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("Decrypted Update Car:", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to update car");
      }

      const updatedCar = decrypted.data;
      console.log('CarSelection.tsx / saved / 1037 -------------------  ', updatedCar);


      await fetchCars()
      resetCarForm();
      setEditSidebar(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decrypted.message || "Car updated successfully",
        life: 3000,
      });

    } catch (error: any) {
      console.error("Error updating car:", error);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to update car",
        life: 3000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };
const deleteCar = async (id: number) => {
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/transferRoutes/cars/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token?.replace("Bearer ", "")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ENCRYPTED DELETE CAR RESPONSE => ", response.data);

      const decrypted = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("DECRYPTED DELETE CAR RESPONSE => ", decrypted);

      if (!decrypted.success) {
        throw new Error(decrypted.message || "Failed to delete car");
      }
      setCars((prev) => prev.filter((car) => car.id !== id));

      setVisibleDialog(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: decrypted.message || "Car deleted successfully",
        life: 3000,
      });

    } catch (error: any) {
      console.error("Error deleting car:", error);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete car",
        life: 3000,
      });

    } finally {
      setSubmitLoading(false);
    }
  };

  const resetCarForm = () => {
    setNewCar({
      name: "",
      brand: "",
      price: "",
      specialPrice: "",
      showSpecialPrice: false,
      passengers: "",
      luggage: "",
      mileage: "",
      description: "",
      selectedBadges: [],
      selectedServices: []
    });
    setCarImage("");
  };

  const actionTemplate = (rowData: any) => (
    <Button
      icon="pi pi-trash"
      severity="danger"
      text
      onClick={() => {
        setSelectedCarDelete(rowData.id);
        setVisibleDialog(true);
      }}
    />
  );

  const imageBodyTemplate = (rowData: any) => (
    <img
      src={rowData.image}
      alt={rowData.name}
      style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
    />
  );

  const { t } = useTranslation("global");
  const priceBodyTemplate = (rowData: any) => (

    <div style={{ textAlign: 'right' }}>
      {rowData.showSpecialPrice && rowData.specialPrice > 0 ? (
        <div>
          <div style={{
            textDecoration: 'line-through',
            color: '#999',
            fontSize: '12px',
            marginBottom: '4px'
          }}>
            CHF {rowData.price.toFixed(2)}
          </div>
          <div style={{
            color: '#dc2626',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            CHF {rowData.specialPrice.toFixed(2)}
          </div>
          <div style={{
            fontSize: '10px',
            color: '#666',
            marginTop: '2px'
          }}>
            {t("dashboard.Total price")}
          </div>
        </div>
      ) : (
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333'
        }}>
          {rowData.price.toFixed(2)}
        </div>
      )}
    </div>
  );

  const badgesBodyTemplate = (rowData: any) => {
    console.log("Row data badges:", rowData.selectedBadges); // Add this for debugging

    return (
      <div className="flex gap-1 flex-wrap">
        {Array.isArray(rowData.selectedBadges) && rowData.selectedBadges.length > 0 ? (
          rowData.selectedBadges.map((badge: any) => (
            <span
              key={badge.refBadgeId}
              style={{
                backgroundColor: badge.refBadgeColor,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              {badge.refBadgeName}
            </span>
          ))
        ) : (
          <span style={{ color: '#999', fontSize: '12px' }}>{t("dashboard.No badges")}</span>
        )}
      </div>
    );
  };
  const customHeader = (
    <div className="flex align-items-center gap-2">
      <h2 className="text-xl font-bold text-[#0a5c9c]">{editSidebar ? 'Edit Car' : 'Add Cab Rental'}</h2>

    </div>
  );
  // const servicesBodyTemplate = (rowData: any) => (
  //   <div className="flex gap-1 flex-wrap">
  //     {Array.isArray(rowData.selectedServices) && rowData.selectedServices.length > 0 ? (
  //       rowData.selectedServices.map((service: any, index: number) => (
  //         <span
  //           key={index}
  //           style={{
  //             color: '#3b82f6',
  //             padding: '4px 8px',
  //             borderRadius: '4px',
  //             fontSize: '10px',
  //             whiteSpace: 'nowrap'
  //           }}
  //         >
  //           {service.refServiceName}
  //         </span>
  //       ))
  //     ) : (
  //       <span style={{ color: '#999', fontSize: '12px' }}>{t("dashboard.No services")}</span>
  //     )}
  //   </div>
  // );
  // CONTINUE FROM PART 1 - Replace the return null; with this complete return statement

  // const CarSelectionStyles = `
  //   .overflow-x-auto {
  //     overflow-x: auto;
  //     overflow-y: visible;
  //   }
  // `;

  return (
    <div>
      {/* <style>{CarSelectionStyles}</style> */}
      <Toast ref={toast} />

      {!showForm && (
        <div className="w-full">

          <div className="justify-center sticky top-0 mb-1">
            <Button label={t("dashboard.add_new_car")} severity="success" onClick={() => setShowForm(true)} />
          </div>

          <div className="table-scroll-container">
            <DataTable value={cars} scrollable scrollHeight="350px" style={{ minWidth: "1400px" }} paginator rows={5}>
              <Column header={t("dashboard.S.No")} body={(_, options) => options.rowIndex + 1} style={{ minWidth: "60px" }} frozen />
              <Column header={t("dashboard.image")} body={imageBodyTemplate} style={{ minWidth: "100px" }} />
              <Column field="name" header={t("dashboard.Car Name")} style={{ minWidth: "150px" }} body={(rowData) => (
                <div className="text-[#0a5c9c] cursor-pointer underline" onClick={() => openEditSidebar(rowData)}>
                  {rowData.name}
                </div>
              )} />
              <Column field="brand" header={t("dashboard.brand")} style={{ minWidth: "120px" }} />
              <Column header={t("dashboard.price")} body={priceBodyTemplate} style={{ minWidth: "120px" }} />
              <Column field="description" header={t("dashboard.description")} style={{ minWidth: "200px" }} />
              <Column header={t("dashboard.capacity")} body={(rowData) => `${rowData.passengers} pax, ${rowData.luggage} bags`} style={{ minWidth: "150px" }} />
              <Column field="mileage" header={t("dashboard.mileage")} style={{ minWidth: "120px" }} />
              <Column header={t("dashboard.badges")} body={badgesBodyTemplate} style={{ minWidth: "150px" }} />
              <Column header={t("dashboard.Actions")} body={actionTemplate} style={{ minWidth: "150px" }} frozen alignFrozen="right" />
            </DataTable>
          </div>
        </div>
      )}
      <Sidebar header={customHeader} visible={showForm || editSidebar} onHide={() => { setShowForm(false); setEditSidebar(false); resetCarForm(); setActiveTab(0); }} position="right" style={{ width: "75vw" }}>
        <Toast ref={toast} position="top-right" />
        <p className="sticky top-0 bg-white z-20" style={{ color: "red", fontSize: "15px" }}>{t("dashboard.Please fill in the details below in English.")} *</p>

        <div className="mb-6 mt-4 top-[28px] sticky  bg-white z-10">
          <div className="flex gap-4 border-b-2 border-gray-200">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab(1)}
            >
              {t("dashboard.Add Services")}
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab(2)}
            >
              {t("dashboard.Add Badges")}
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab(0)}
            >
              {t("dashboard.Car Details")}
            </button>
          </div>
        </div>
        {/* Car Details Tab */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-4 p-4 pt-[-25px] bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium block mb-2">{t("dashboard.Car Name")} *</label>
              <InputText value={newCar.name} onChange={(e) => setNewCar({ ...newCar, name: e.target.value })} placeholder="e.g., Economy" className="p-inputtext-sm w-full" />
            </div>
            <div>
              <label className="font-medium block mb-2">{t("dashboard.Car Brand")} *</label>
              <InputText value={newCar.brand} onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })} placeholder="e.g., Toyota" className="p-inputtext-sm w-full" />
            </div>
            <div className="flex flex-row gap-3">
              <div>
                <label className="font-medium block mb-2">{t("dashboard.Regular Price")} (CHF) *</label>
                <InputText type="number" value={newCar.price} onChange={(e) => {
                  const val = e.target.value;
                  if (Number(val) >= 0) {
                    setNewCar({ ...newCar, price: e.target.value });
                  }
                }} placeholder="e.g., 66.00" className="p-inputtext-sm w-full" />
              </div>
              <div>
                <label className="font-medium block mb-2">
                  {t("dashboard.Special Price")} (CHF)
                </label>

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={newCar.showSpecialPrice}
                    onChange={(e) =>
                      setNewCar({ ...newCar, showSpecialPrice: e.target.checked })
                    }
                    style={{ width: "18px", height: "18px" }}
                  />

                  <InputText
                    type="number"
                    value={newCar.specialPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      const numVal = Number(val);
                      if (numVal >= 0 && numVal <= Number(newCar.price)) {
                        setNewCar({ ...newCar, specialPrice: val });
                      }
                    }}
                    placeholder="e.g., 60.00"
                    className="p-inputtext-sm flex-1"
                    disabled={!newCar.showSpecialPrice}
                    min="0"
                    max={newCar.price}
                  />
                </div>

                {/* Message */}
                <small className="text-gray-500">
                  {t("dashboard.Enable to show strikethrough price")}
                </small>

                {/* Validation Error Message */}
                {newCar.specialPrice && Number(newCar.specialPrice) > Number(newCar.price) && (
                  <small className="text-red-500 block mt-1">
                    {t("dashboard.Special price should not exceed regular price")}
                  </small>
                )}
              </div>

            </div>
            <div className="flex flex-row gap-3">
              <div>
                <label className="font-medium block mb-2">{t("dashboard.Passengers")} *</label>
                <InputText
                  type="number"
                  value={newCar.passengers}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (Number(val) >= 0) {
                      setNewCar({ ...newCar, passengers: val });
                    }
                  }}
                  placeholder="e.g., 3"
                  className="p-inputtext-sm w-full"
                  min="0"
                />              </div>
              <div>
                <label className="font-medium block mb-2">{t("dashboard.Luggage")} *</label>
                <InputText
                  type="number"
                  value={newCar.luggage}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (Number(val) >= 0) {
                      setNewCar({ ...newCar, luggage: val });
                    }
                  }}
                  placeholder="e.g., 3"
                  className="p-inputtext-sm w-full"
                  min="0"
                />
              </div>
              <div>
                <label className="font-medium block mb-2">{t("dashboard.mileage")} *</label>
                <InputText value={newCar.mileage} onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })} placeholder="e.g., 6km/l" className="p-inputtext-sm w-full" />
              </div>
            </div>
            <div>
              <label className="font-medium block mb-2">{t("dashboard.description")}</label>
              <InputTextarea value={newCar.description} onChange={(e) => setNewCar({ ...newCar, description: e.target.value })} placeholder="e.g., or similar" className="p-inputtext-sm w-full" rows={3} />
            </div>
            <div>
              <label className="font-medium block mb-2">{t("dashboard.car_badges")}</label>
              <Dropdown
                value={newCar.selectedBadges[0] || null}
                onChange={(e) => setNewCar({ ...newCar, selectedBadges: e.value ? [e.value] : [] })}
                options={badges}
                optionLabel="refBadgeName"
                dataKey="refBadgeId"
                placeholder="Select a badge"
                className="w-full"
                showClear
              />
            </div>
            <div>
              <label className="font-medium block mb-2">{t("dashboard.car_services")}</label>
              <MultiSelect value={newCar.selectedServices} onChange={(e) => setNewCar({ ...newCar, selectedServices: e.value })} options={services} optionLabel="refServiceName" display="chip" placeholder="Select services" className="w-full" />
            </div>
            <div>
              <label className="font-medium block mb-2 ">{t("dashboard.Car Image")} *</label>
              <FileUpload name="carImage" accept="image/*" maxFileSize={5000000} customUpload uploadHandler={uploadCarImage} emptyTemplate={<p className="m-0">{t("dashboard.Drag and drop image (Max 5MB)")}</p>} />
              {/* {carImage && <img src={carImage} alt="Preview" style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }} />} */}
            </div>
            <div className="flex gap-2 justify-end mb-3">
              <Button label={t("dashboard.Cancel")} severity="secondary" onClick={() => { setShowForm(false); setEditSidebar(false); resetCarForm(); }} />
              <Button
                label={editSidebar ? t("dashboard.update_car") : t("dashboard.add_car")}
                onClick={editSidebar ? updateCar : addNewCar}
                loading={submitLoading}
              />
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">{t("dashboard.car_services")}</h4>
            <div className="flex gap-2">
              <InputText value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} placeholder="Enter service name" className="p-inputtext-sm flex-1" />
              <Button icon="pi pi-plus" label="Add" size="small" onClick={addNewService} />
            </div>
            <DataTable value={services} className="p-datatable-sm">
              <Column body={(_, options) => options.rowIndex + 1} header={t("dashboard.S.No")} style={{ width: "80px" }} />
              <Column field="refServiceName" header={t("dashboard.service_name")} body={(rowData) => editServiceId === rowData.refServiceId ? <InputText value={editServiceValue.refServiceName} onChange={(e) => handleServiceInputChange(e, "refServiceName")} /> : rowData.refServiceName} />
              <Column body={serviceActionTemplate} header={t("dashboard.Actions")} style={{ width: "150px" }} />
            </DataTable>
          </div>
        )}
        {/* Badges Tab */}
        {activeTab === 2 && (
          <div className="flex flex-col gap-4 p-3 mt-[-18px] bg-gray-50 rounded-lg">
            <h4 className="font-semibold">{t("dashboard.car_badges")}</h4>
            <div className="flex gap-2">
              <InputText value={newBadgeName} onChange={(e) => setNewBadgeName(e.target.value)} placeholder="Badge name" className="p-inputtext-sm flex-1" />
              <input type="color" value={newBadgeColor} onChange={(e) => setNewBadgeColor(e.target.value)} style={{ width: "60px", height: "38px", cursor: "pointer" }} />
              <Button icon="pi pi-plus" label={t("dashboard.add")} size="small" onClick={addNewBadge} />
            </div>
            <DataTable value={badges} className="p-datatable-sm">
              <Column body={(_, options) => options.rowIndex + 1} header={t("dashboard.S.No")} style={{ width: "80px" }} />
              <Column field="refBadgeName" header={t("dashboard.badge_name")} body={(rowData) => editBadgeId === rowData.refBadgeId ? <InputText value={editBadgeValue.refBadgeName} onChange={(e) => handleBadgeInputChange(e, "refBadgeName")} /> : rowData.refBadgeName} />
              <Column field="refBadgeColor" header={t("dashboard.color")} body={(rowData) => editBadgeId === rowData.refBadgeId ? <input type="color" value={editBadgeValue.refBadgeColor} onChange={(e) => handleBadgeInputChange(e, "refBadgeColor")} /> : <div style={{ width: "30px", height: "30px", backgroundColor: rowData.refBadgeColor, borderRadius: "4px" }}></div>} />
              <Column body={badgeActionTemplate} header={t("dashboard.Actions")} style={{ width: "150px" }} />
            </DataTable>
          </div>
        )}
      </Sidebar>
      <Dialog header={t("dashboard.Confirm Deletion")} visible={visibleDialog} style={{ width: "350px" }} modal onHide={() => setVisibleDialog(false)} footer={<div className="flex justify-end gap-2"><Button label={t("dashboard.no")} icon="pi pi-times" className="p-button-text" onClick={() => setVisibleDialog(false)} /><Button label={t("dashboard.yes")} icon="pi pi-check" className="p-button-danger" loading={submitLoading} onClick={() => { if (selectedCarDelete !== null) { deleteCar(selectedCarDelete); } }} /></div>}><p>{t("dashboard.Are you sure you want to delete this car?")}</p></Dialog>

      <Dialog header={t("dashboard.Confirm Deletion")} visible={serviceDialogVisible} style={{ width: "350px" }} modal onHide={() => setServiceDialogVisible(false)} footer={<div className="flex justify-end gap-2"><Button label={t("dashboard.no")} icon="pi pi-times" className="p-button-text" onClick={() => setServiceDialogVisible(false)} /><Button label={t("dashboard.yes")} icon="pi pi-check" className="p-button-danger" loading={submitLoading} onClick={() => { if (selectedServiceDelete !== null) { deleteService(selectedServiceDelete); } }} /></div>}><p>{t("dashboard.Are you sure you want to delete this service?")}</p></Dialog>

      <Dialog header={t("dashboard.Confirm Deletion")} visible={badgeDialogVisible} style={{ width: "350px" }} modal onHide={() => setBadgeDialogVisible(false)} footer={<div className="flex justify-end gap-2"><Button label={t("dashboard.no")} icon="pi pi-times" className="p-button-text" onClick={() => setBadgeDialogVisible(false)} /><Button label={t("dashboard.yes")} icon="pi pi-check" className="p-button-danger" onClick={() => { if (selectedBadgeDelete !== null) { deleteBadge(selectedBadgeDelete); } }} /></div>}><p>{t("dashboard.Are you sure you want to delete this badge?")}</p></Dialog>
    </div>
  );

};

export default CarSelection;



