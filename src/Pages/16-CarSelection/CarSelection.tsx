import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { AutoComplete } from "primereact/autocomplete";
import { InputTextarea } from "primereact/inputtextarea";

// ==================== COMPONENT 1: SEPARATE FROM/TO LOCATIONS ====================
export const FromToLocations: React.FC = () => {
  const [fromLocations, setFromLocations] = useState<any[]>([]);
  const [toLocations, setToLocations] = useState<any[]>([]);
  const [showFromForm, setShowFromForm] = useState(false);
  const [showToForm, setShowToForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editFromSidebar, setEditFromSidebar] = useState(false);
  const [editToSidebar, setEditToSidebar] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedLocationDelete, setSelectedLocationDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'from' | 'to'>('from');

  const [suggestions, setSuggestions] = useState<any[]>([]);

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
      // TODO: Replace with your API endpoint
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
      // TODO: Replace with your API endpoint
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
      <h3 className="font-semibold text-lg mb-3">{type === 'from' ? 'From' : 'To'} Location</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="font-medium block mb-2">Search Location *</label>
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
          <label className="font-medium block mb-2">Area/Locality</label>
          <InputText
            value={inputs.refArea}
            onChange={(e) => setInputs({ ...inputs, refArea: e.target.value })}
            placeholder="e.g., Terminal 5"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Street/Road</label>
          <InputText
            value={inputs.refStreet}
            onChange={(e) => setInputs({ ...inputs, refStreet: e.target.value })}
            placeholder="e.g., Airport Road"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">City *</label>
          <InputText
            value={inputs.refCity}
            onChange={(e) => setInputs({ ...inputs, refCity: e.target.value })}
            placeholder="e.g., London"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">State/Region</label>
          <InputText
            value={inputs.refState}
            onChange={(e) => setInputs({ ...inputs, refState: e.target.value })}
            placeholder="e.g., England"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Country *</label>
          <InputText
            value={inputs.refCountry}
            onChange={(e) => setInputs({ ...inputs, refCountry: e.target.value })}
            placeholder="e.g., United Kingdom"
            className="p-inputtext-sm w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Pincode/Postal Code</label>
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
        <h2 className="text-xl font-bold text-[#0a5c9c] mb-4">From Locations</h2>

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
        <h2 className="text-xl font-bold text-[#0a5c9c] mb-4">To Locations</h2>

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
              <h3 className="text-lg font-semibold">Add New To Location</h3>
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
        <h2 className="text-xl font-bold mb-6">Edit From Location</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium block mb-2">Location Name *</label>
            <InputText
              value={inputs.refLocation}
              onChange={(e) => setInputs({ ...inputs, refLocation: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Area</label>
            <InputText
              value={inputs.refArea}
              onChange={(e) => setInputs({ ...inputs, refArea: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Street</label>
            <InputText
              value={inputs.refStreet}
              onChange={(e) => setInputs({ ...inputs, refStreet: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">City *</label>
            <InputText
              value={inputs.refCity}
              onChange={(e) => setInputs({ ...inputs, refCity: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">State</label>
            <InputText
              value={inputs.refState}
              onChange={(e) => setInputs({ ...inputs, refState: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Country *</label>
            <InputText
              value={inputs.refCountry}
              onChange={(e) => setInputs({ ...inputs, refCountry: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Pincode</label>
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
        <h2 className="text-xl font-bold mb-6">Edit To Location</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium block mb-2">Location Name *</label>
            <InputText
              value={inputs.refLocation}
              onChange={(e) => setInputs({ ...inputs, refLocation: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Area</label>
            <InputText
              value={inputs.refArea}
              onChange={(e) => setInputs({ ...inputs, refArea: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Street</label>
            <InputText
              value={inputs.refStreet}
              onChange={(e) => setInputs({ ...inputs, refStreet: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">City *</label>
            <InputText
              value={inputs.refCity}
              onChange={(e) => setInputs({ ...inputs, refCity: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">State</label>
            <InputText
              value={inputs.refState}
              onChange={(e) => setInputs({ ...inputs, refState: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Country *</label>
            <InputText
              value={inputs.refCountry}
              onChange={(e) => setInputs({ ...inputs, refCountry: e.target.value })}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Pincode</label>
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
        <p>Are you sure you want to delete this location?</p>
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

  const toast = useRef<Toast>(null);

  const [newCar, setNewCar] = useState({
    name: "",
    price: "",
    passengers: "",
    luggage: "",
    mileage: "",
    description: "",
  });

  const dummyCars = [
    {
      id: 1,
      name: "Economy",
      image: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Economy",
      price: 1920.24,
      passengers: 3,
      luggage: 3,
      mileage: "6km/l",
    },
    {
      id: 2,
      name: "Standard",
      image: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Standard",
      price: 3174.91,
      passengers: 3,
      luggage: 3,
      mileage: "5km/l",
    },
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      // TODO: Replace with your API endpoint
      setCars(dummyCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const uploadCarImage = async (event: any) => {
    const file = event.files[0];
    const formData = new FormData();
    formData.append("Image", file);

    try {
      // TODO: Replace with your image upload API
      const imageUrl = URL.createObjectURL(file);
      setCarImage(imageUrl);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Image uploaded successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const addNewCar = async () => {
    if (
      !newCar.name ||
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

    setSubmitLoading(true);

    try {
      // TODO: Replace with your API endpoint
      const carToAdd = {
        id: cars.length + 1,
        name: newCar.name,
        image: carImage,
        price: parseFloat(newCar.price),
        passengers: parseInt(newCar.passengers),
        luggage: parseInt(newCar.luggage),
        mileage: newCar.mileage,
      };

      setCars([...cars, carToAdd]);
      resetCarForm();
      setShowForm(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Car added successfully",
        life: 3000,
      });

      setSubmitLoading(false);
    } catch (error) {
      console.error("Error adding car:", error);
      setSubmitLoading(false);
    }
  };

  const openEditSidebar = (car: any) => {
    setEditingCar(car);
    setNewCar({
      name: car.name,
      price: car.price.toString(),
      passengers: car.passengers.toString(),
      luggage: car.luggage.toString(),
      mileage: car.mileage,
      description: car.description,
    });
    setCarImage(car.image);
    setEditSidebar(true);
  };

  const updateCar = async () => {
    if (
      !newCar.name ||
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

    setSubmitLoading(true);

    try {
      // TODO: Replace with your API endpoint
      const updatedCars = cars.map(car =>
        car.id === editingCar.id
          ? {
            ...car,
            name: newCar.name,
            image: carImage,
            price: parseFloat(newCar.price),
            passengers: parseInt(newCar.passengers),
            luggage: parseInt(newCar.luggage),
            mileage: newCar.mileage,
          }
          : car
      );

      setCars(updatedCars);
      resetCarForm();
      setEditSidebar(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Car updated successfully",
        life: 3000,
      });

      setSubmitLoading(false);
    } catch (error) {
      console.error("Error updating car:", error);
      setSubmitLoading(false);
    }
  };

  const deleteCar = async (id: number) => {
    setSubmitLoading(true);

    try {
      // TODO: Replace with your API endpoint
      setCars(cars.filter((car) => car.id !== id));
      setVisibleDialog(false);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Car deleted successfully",
        life: 3000,
      });

      setSubmitLoading(false);
    } catch (error) {
      console.error("Error deleting car:", error);
      setSubmitLoading(false);
    }
  };

  const resetCarForm = () => {
    setNewCar({
      name: "",
      price: "",
      passengers: "",
      luggage: "",
      mileage: "",
      description: "",
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

  return (
    <div>
      <Toast ref={toast} />

      {!showForm ? (
        <>
          {/* List View */}
          <h2 className="text-xl font-bold text-[#0a5c9c] mb-4">Car Management</h2>

          <div className="flex justify-end mb-4">
            <Button
              label="Add New Car"
              severity="success"
              onClick={() => setShowForm(true)}
            />
          </div>

          <DataTable value={cars} tableStyle={{ minWidth: "50rem" }} paginator rows={5}>
            <Column
              header="S.No"
              body={(_, options) => options.rowIndex + 1}
              style={{ width: "3rem" }}
            />

            <Column
              header="Image"
              body={imageBodyTemplate}
              style={{ width: "8rem" }}
            />

            <Column
              field="name"
              header="Car Name"
              style={{ width: "10rem" }}
              body={(rowData) => (
                <div
                  className="text-[#0a5c9c] cursor-pointer underline"
                  onClick={() => openEditSidebar(rowData)}
                >
                  {rowData.name}
                </div>
              )}
            />

            <Column
              field="price"
              header="Price (€)"
              body={(rowData) => `€${rowData.price}`}
              style={{ width: "8rem" }}
            />
            <Column
              field="description"
              header="Description"
              body={(rowData) => `${rowData.description}`}
              style={{ width: "8rem" }}
            />

            <Column
              header="Capacity"
              body={(rowData) => `${rowData.passengers} pax, ${rowData.luggage} bags`}
              style={{ width: "12rem" }}
            />

            <Column
              field="mileage"
              header="Mileage"
              style={{ width: "8rem" }}
            />

            <Column
              header="Actions"
              body={actionTemplate}
              style={{ width: "8rem" }}
            />
          </DataTable>
        </>
      ) : (
        <>
          {/* Add Car Form */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0a5c9c]">Add New Car</h2>
            <Button
              icon="pi pi-arrow-left"
              label="Back to List"
              severity="secondary"
              onClick={() => {
                setShowForm(false);
                resetCarForm();
              }}
            />
          </div>

          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium block mb-2">Car Name *</label>
              <InputText
                value={newCar.name}
                onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                placeholder="e.g., Economy, Standard, Van"
                className="p-inputtext-sm w-full"
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Car Image *</label>
              <FileUpload
                name="carImage"
                accept="image/*"
                maxFileSize={5000000}
                customUpload
                uploadHandler={uploadCarImage}
                emptyTemplate={
                  <p className="m-0">Drag and drop your car image here or click to browse (Max 5MB)</p>
                }
              />
              {/* {carImage && (
                <div className="mt-2">
                  <img
                    src={carImage}
                    alt="Preview"
                    style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
              )} */}
            </div>

            <div>
              <label className="font-medium block mb-2">Price (€) *</label>
              <InputText
                type="number"
                value={newCar.price}
                onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                placeholder="e.g., 1920.24"
                className="p-inputtext-sm w-full"
              />
            </div>

            {/* <div className="grid grid-cols-2 gap-4"> */}
              {/* <div>
                <label className="font-medium block mb-2">Passengers *</label>
                <InputText
                  type="number"
                  value={newCar.passengers}
                  onChange={(e) => setNewCar({ ...newCar, passengers: e.target.value })}
                  placeholder="e.g., 3"
                  className="p-inputtext-sm w-full"
                />
              </div> */}

              <div>
                <label className="font-medium block mb-2">Luggage *</label>
                <InputText
                  type="number"
                  value={newCar.luggage}
                  onChange={(e) => setNewCar({ ...newCar, luggage: e.target.value })}
                  placeholder="e.g., 3"
                  className="p-inputtext-sm w-full"
                />
              </div>
            {/* </div> */}

            <div>
              <label className="font-medium block mb-2">Mileage *</label>
              <InputText
                value={newCar.mileage}
                onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })}
                placeholder="e.g., 6km/l"
                className="p-inputtext-sm w-full"
              />
            </div>

            {/* <div className="grid grid-cols-2 gap-4"> */}
              <div>
                <label className="font-medium block mb-2">Passengers *</label>
                <InputText
                  type="number"
                  value={newCar.passengers}
                  onChange={(e) => setNewCar({ ...newCar, passengers: e.target.value })}
                  placeholder="e.g., 3"
                  className="p-inputtext-sm w-full"
                />
              </div>

              <div>
                <label className="font-medium block mb-2">Description</label>
                <InputText

                  value={newCar.description}
                  onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                  placeholder="similar to this car "
                  className="p-inputtext-sm w-full"
                />
              </div>
            

            <div className="flex gap-2 justify-end mt-6">
              <Button
                label="Cancel"
                severity="secondary"
                onClick={() => {
                  setShowForm(false);
                  resetCarForm();
                }}
              />
              <Button
                label="Add Car"
                onClick={addNewCar}
                loading={submitLoading}
              />
            </div>
          </div>
        </>
      )}

      {/* Edit Sidebar */}
      <Sidebar
        visible={editSidebar}
        onHide={() => setEditSidebar(false)}
        position="right"
        style={{ width: "500px" }}
      >
        <h2 className="text-xl font-bold mb-6">Edit Car</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium block mb-2">Car Name *</label>
            <InputText
              value={newCar.name}
              onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
              placeholder="e.g., Economy, Standard, Van"
              className="p-inputtext-sm w-full"
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Car Image *</label>
            <FileUpload
              name="carImage"
              accept="image/*"
              maxFileSize={5000000}
              customUpload
              uploadHandler={uploadCarImage}
              emptyTemplate={
                <p className="m-0">Drag and drop your car image here or click to browse (Max 5MB)</p>
              }
            />
            {carImage && (
              <div className="mt-2">
                <img
                  src={carImage}
                  alt="Preview"
                  style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-medium block mb-2">Price (€) *</label>
            <InputText
              type="number"
              value={newCar.price}
              onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
              placeholder="e.g., 1920.24"
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium block mb-2">Passengers *</label>
              <InputText
                type="number"
                value={newCar.passengers}
                onChange={(e) => setNewCar({ ...newCar, passengers: e.target.value })}
                placeholder="e.g., 3"
                className="p-inputtext-sm w-full"
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Luggage *</label>
              <InputText
                type="number"
                value={newCar.luggage}
                onChange={(e) => setNewCar({ ...newCar, luggage: e.target.value })}
                placeholder="e.g., 3"
                className="p-inputtext-sm w-full"
              />
            </div>
          </div>

          <div>
            <label className="font-medium block mb-2">Mileage *</label>
            <InputText
              value={newCar.mileage}
              onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })}
              placeholder="e.g., 6km/l"
              className="p-inputtext-sm w-full"
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <label className="font-medium block mb-2">Passengers *</label>
              <InputText
                type="number"
                value={newCar.passengers}
                onChange={(e) => setNewCar({ ...newCar, passengers: e.target.value })}
                placeholder="e.g., 3"
                className="p-inputtext-sm w-full"
              />
            </div> */}

            <div>
              <label className="font-medium block mb-2">Description</label>
              <InputText

                value={newCar.description}
                onChange={(e) => setNewCar({ ...newCar, luggage: e.target.value })}
                placeholder="similar to the car"
                className="p-inputtext-sm w-full"
              />
            </div>
          </div>


          <div className="flex gap-2 justify-end mt-6">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setEditSidebar(false)}
            />
            <Button
              label="Update Car"
              onClick={updateCar}
              loading={submitLoading}
            />
          </div>
        </div>
      </Sidebar>

      {/* Delete Confirmation Dialog */}
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
              onClick={() => {
                if (selectedCarDelete !== null) {
                  deleteCar(selectedCarDelete);
                }
              }}
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this car?</p>
      </Dialog>
    </div>
  );
};