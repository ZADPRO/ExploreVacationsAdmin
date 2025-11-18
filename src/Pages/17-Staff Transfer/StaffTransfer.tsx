import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface DriverDetails {
  refDriverId: string;
  refFirstLastName: string;
  refDOB: string;
  refNationality: string;
  refAddress: string;
  refPhoneWhatsApp: string;
  refEmail: string;
  refDrivingLicenseCategory: string;
  refDrivingLicenseNumber: string;
  refDrivingLicenseExpiryDate: string;
  refIssuingCountry: string;
  refIDPassportNumber: string;
  refIDPassportExpiryDate: string;
  refEmploymentType: string;
  refStartDate: string;
  refNotes: string;
}

const StaffTransfer: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<DriverDetails[]>([
    {
      refDriverId: "DRV001",
      refFirstLastName: "Ahmed Hassan",
      refDOB: "1988-05-15",
      refNationality: "Saudi Arabian",
      refAddress: "Al Malaz District, Riyadh, Saudi Arabia",
      refPhoneWhatsApp: "+966501234567",
      refEmail: "ahmed.hassan@example.com",
      refDrivingLicenseCategory: "C",
      refDrivingLicenseNumber: "DL8812345",
      refDrivingLicenseExpiryDate: "2026-08-20",
      refIssuingCountry: "Saudi Arabia",
      refIDPassportNumber: "1088123456",
      refIDPassportExpiryDate: "2028-05-15",
      refEmploymentType: "Full Time",
      refStartDate: "2022-03-10",
      refNotes: "Experienced driver with clean record",
    },
    {
      refDriverId: "DRV002",
      refFirstLastName: "Mohammed Ali",
      refDOB: "1990-11-22",
      refNationality: "Egyptian",
      refAddress: "Al Aziziyah, Jeddah, Saudi Arabia",
      refPhoneWhatsApp: "+966509876543",
      refEmail: "mohammed.ali@example.com",
      refDrivingLicenseCategory: "D",
      refDrivingLicenseNumber: "DL9087654",
      refDrivingLicenseExpiryDate: "2025-12-31",
      refIssuingCountry: "Saudi Arabia",
      refIDPassportNumber: "A12345678",
      refIDPassportExpiryDate: "2027-11-22",
      refEmploymentType: "Full Time",
      refStartDate: "2021-07-15",
      refNotes: "Bus driver, professional and punctual",
    },
    {
      refDriverId: "DRV003",
      refFirstLastName: "Rajesh Kumar",
      refDOB: "1985-03-08",
      refNationality: "Indian",
      refAddress: "Al Khobar, Eastern Province, Saudi Arabia",
      refPhoneWhatsApp: "+966551234567",
      refEmail: "rajesh.kumar@example.com",
      refDrivingLicenseCategory: "B",
      refDrivingLicenseNumber: "DL8512345",
      refDrivingLicenseExpiryDate: "2026-03-08",
      refIssuingCountry: "Saudi Arabia",
      refIDPassportNumber: "P9876543",
      refIDPassportExpiryDate: "2029-03-08",
      refEmploymentType: "Part Time",
      refStartDate: "2023-01-20",
      refNotes: "Available weekends and evenings",
    },
    {
      refDriverId: "DRV004",
      refFirstLastName: "Yusuf Abdullah",
      refDOB: "1992-09-12",
      refNationality: "Yemeni",
      refAddress: "Al Hamra, Riyadh, Saudi Arabia",
      refPhoneWhatsApp: "+966558765432",
      refEmail: "yusuf.abdullah@example.com",
      refDrivingLicenseCategory: "C",
      refDrivingLicenseNumber: "DL9212345",
      refDrivingLicenseExpiryDate: "2027-09-12",
      refIssuingCountry: "Saudi Arabia",
      refIDPassportNumber: "Y8765432",
      refIDPassportExpiryDate: "2028-09-12",
      refEmploymentType: "Contract",
      refStartDate: "2023-06-01",
      refNotes: "6-month contract, renewable",
    },
    {
      refDriverId: "DRV005",
      refFirstLastName: "Carlos Santos",
      refDOB: "1987-07-25",
      refNationality: "Filipino",
      refAddress: "Al Sulaymaniyah, Jeddah, Saudi Arabia",
      refPhoneWhatsApp: "+966507654321",
      refEmail: "carlos.santos@example.com",
      refDrivingLicenseCategory: "B",
      refDrivingLicenseNumber: "DL8712345",
      refDrivingLicenseExpiryDate: "2026-07-25",
      refIssuingCountry: "Saudi Arabia",
      refIDPassportNumber: "PH1234567",
      refIDPassportExpiryDate: "2027-07-25",
      refEmploymentType: "Full Time",
      refStartDate: "2020-11-05",
      refNotes: "Multilingual driver - English, Arabic, Tagalog",
    },
  ]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  // Form inputs state
  const [inputs, setInputs] = useState({
    refFirstLastName: "",
    refDOB: null as Date | null,
    refNationality: "",
    refAddress: "",
    refPhoneWhatsApp: "",
    refEmail: "",
    refDrivingLicenseCategory: "",
    refDrivingLicenseNumber: "",
    refDrivingLicenseExpiryDate: null as Date | null,
    refIssuingCountry: "",
    refIDPassportNumber: "",
    refIDPassportExpiryDate: null as Date | null,
    refEmploymentType: "",
    refStartDate: null as Date | null,
    refNotes: "",
  });

  // Dropdown options
  const employmentTypeOptions = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Contract", value: "Contract" },
    { label: "Temporary", value: "Temporary" },
  ];

  const licenseCategoryOptions = [
    { label: "Category A - Motorcycle", value: "A" },
    { label: "Category B - Car", value: "B" },
    { label: "Category C - Truck", value: "C" },
    { label: "Category D - Bus", value: "D" },
    { label: "Category E - Trailer", value: "E" },
  ];

  const openEditSidebar = (driver: DriverDetails) => {
    setIsEditMode(true);
    setEditingDriverId(driver.refDriverId);
    setInputs({
      refFirstLastName: driver.refFirstLastName,
      refDOB: driver.refDOB ? new Date(driver.refDOB) : null,
      refNationality: driver.refNationality,
      refAddress: driver.refAddress,
      refPhoneWhatsApp: driver.refPhoneWhatsApp,
      refEmail: driver.refEmail,
      refDrivingLicenseCategory: driver.refDrivingLicenseCategory,
      refDrivingLicenseNumber: driver.refDrivingLicenseNumber,
      refDrivingLicenseExpiryDate: driver.refDrivingLicenseExpiryDate
        ? new Date(driver.refDrivingLicenseExpiryDate)
        : null,
      refIssuingCountry: driver.refIssuingCountry,
      refIDPassportNumber: driver.refIDPassportNumber,
      refIDPassportExpiryDate: driver.refIDPassportExpiryDate
        ? new Date(driver.refIDPassportExpiryDate)
        : null,
      refEmploymentType: driver.refEmploymentType,
      refStartDate: driver.refStartDate ? new Date(driver.refStartDate) : null,
      refNotes: driver.refNotes,
    });
    setVisible(true);
  };

  const addNewDriver = () => {
    setSubmitLoading(true);

    setTimeout(() => {
      if (isEditMode && editingDriverId) {
        // Update existing driver
        const updatedDrivers = drivers.map((driver) =>
          driver.refDriverId === editingDriverId
            ? {
                ...driver,
                refFirstLastName: inputs.refFirstLastName,
                refDOB: inputs.refDOB
                  ? inputs.refDOB.toISOString().split("T")[0]
                  : "",
                refNationality: inputs.refNationality,
                refAddress: inputs.refAddress,
                refPhoneWhatsApp: inputs.refPhoneWhatsApp,
                refEmail: inputs.refEmail,
                refDrivingLicenseCategory: inputs.refDrivingLicenseCategory,
                refDrivingLicenseNumber: inputs.refDrivingLicenseNumber,
                refDrivingLicenseExpiryDate: inputs.refDrivingLicenseExpiryDate
                  ? inputs.refDrivingLicenseExpiryDate
                      .toISOString()
                      .split("T")[0]
                  : "",
                refIssuingCountry: inputs.refIssuingCountry,
                refIDPassportNumber: inputs.refIDPassportNumber,
                refIDPassportExpiryDate: inputs.refIDPassportExpiryDate
                  ? inputs.refIDPassportExpiryDate.toISOString().split("T")[0]
                  : "",
                refEmploymentType: inputs.refEmploymentType,
                refStartDate: inputs.refStartDate
                  ? inputs.refStartDate.toISOString().split("T")[0]
                  : "",
                refNotes: inputs.refNotes,
              }
            : driver
        );
        setDrivers(updatedDrivers);

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Driver Successfully Updated",
          life: 3000,
        });
      } else {
        // Add new driver
        const newDriverId = `DRV${String(drivers.length + 1).padStart(3, "0")}`;

        const newDriver: DriverDetails = {
          refDriverId: newDriverId,
          refFirstLastName: inputs.refFirstLastName,
          refDOB: inputs.refDOB
            ? inputs.refDOB.toISOString().split("T")[0]
            : "",
          refNationality: inputs.refNationality,
          refAddress: inputs.refAddress,
          refPhoneWhatsApp: inputs.refPhoneWhatsApp,
          refEmail: inputs.refEmail,
          refDrivingLicenseCategory: inputs.refDrivingLicenseCategory,
          refDrivingLicenseNumber: inputs.refDrivingLicenseNumber,
          refDrivingLicenseExpiryDate: inputs.refDrivingLicenseExpiryDate
            ? inputs.refDrivingLicenseExpiryDate.toISOString().split("T")[0]
            : "",
          refIssuingCountry: inputs.refIssuingCountry,
          refIDPassportNumber: inputs.refIDPassportNumber,
          refIDPassportExpiryDate: inputs.refIDPassportExpiryDate
            ? inputs.refIDPassportExpiryDate.toISOString().split("T")[0]
            : "",
          refEmploymentType: inputs.refEmploymentType,
          refStartDate: inputs.refStartDate
            ? inputs.refStartDate.toISOString().split("T")[0]
            : "",
          refNotes: inputs.refNotes,
        };

        setDrivers([...drivers, newDriver]);

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Driver Successfully Added",
          life: 3000,
        });
      }

      setSubmitLoading(false);
      setVisible(false);
      resetForm();
    }, 1000);
  };

  const deleteDriver = (id: string) => {
    const updatedDrivers = drivers.filter(
      (driver) => driver.refDriverId !== id
    );
    setDrivers(updatedDrivers);

    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Driver Successfully Deleted",
      life: 3000,
    });
  };

  const actionDeleteDriver = (rowData: any) => {
    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => {
          setSelectedDriverId(rowData.refDriverId);
          setVisibleDialog(true);
        }}
      />
    );
  };

  useEffect(() => {
    // Static data is already loaded in state
  }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setInputs({
      refFirstLastName: "",
      refDOB: null,
      refNationality: "",
      refAddress: "",
      refPhoneWhatsApp: "",
      refEmail: "",
      refDrivingLicenseCategory: "",
      refDrivingLicenseNumber: "",
      refDrivingLicenseExpiryDate: null,
      refIssuingCountry: "",
      refIDPassportNumber: "",
      refIDPassportExpiryDate: null,
      refEmploymentType: "",
      refStartDate: null,
      refNotes: "",
    });
    setIsEditMode(false);
    setEditingDriverId(null);
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="p-4 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold"> </h2>
          <Button
            label="Add New Driver"
            severity="success"
            onClick={() => {
              setIsEditMode(false);
              setEditingDriverId(null);
              resetForm();
              setVisible(true);
            }}
          />
        </div>

        <div className="mt-3 p-2">
          <h3 className="text-lg font-bold">Registered Drivers</h3>
          <DataTable
            value={drivers}
            tableStyle={{ minWidth: "50rem" }}
            scrollable
            scrollHeight="500px"
            paginator
            rows={10}
          >
            <Column
              header="S.No"
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            <Column
              field="refDriverId"
              header="Driver ID"
              headerStyle={{ width: "10rem" }}
              className="underline text-[#0a5c9c] cursor-pointer"
              body={(rowData) => (
                <div onClick={() => openEditSidebar(rowData)}>
                  {rowData.refDriverId}
                </div>
              )}
            />
            <Column
              field="refFirstLastName"
              header="Name"
              headerStyle={{ width: "15rem" }}
            />
            <Column
              field="refDOB"
              header="Date of Birth"
              body={(rowData) => rowData.refDOB?.split("T")[0]}
              headerStyle={{ width: "10rem" }}
            />
            <Column
              field="refNationality"
              header="Nationality"
              headerStyle={{ width: "10rem" }}
            />
            <Column
              field="refPhoneWhatsApp"
              header="Phone/WhatsApp"
              headerStyle={{ width: "12rem" }}
            />
            <Column
              field="refEmail"
              header="Email"
              headerStyle={{ width: "15rem" }}
            />
            <Column
              field="refDrivingLicenseNumber"
              header="License Number"
              headerStyle={{ width: "12rem" }}
            />
            <Column
              field="refEmploymentType"
              header="Employment Type"
              headerStyle={{ width: "12rem" }}
            />
            <Column
              field="refStartDate"
              header="Start Date"
              body={(rowData) => rowData.refStartDate?.split("T")[0]}
              headerStyle={{ width: "10rem" }}
            />
            <Column body={actionDeleteDriver} header="Delete" />
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
                  onClick={() => {
                    if (selectedDriverId !== null) {
                      deleteDriver(selectedDriverId);
                    }
                    setVisibleDialog(false);
                  }}
                />
              </div>
            }
          >
            <p>Are you sure you want to delete this driver?</p>
          </Dialog>
        </div>

        <Sidebar
          visible={visible}
          style={{ width: "60%" }}
          onHide={() => {
            setVisible(false);
            resetForm();
          }}
          position="right"
        >
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? "Edit Driver" : "Driver Registration Form"}
          </h2>
          <p className="text-sm text-[#f60000] mb-3">
            Fill the fields below. Dropdowns available where applicable.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewDriver();
            }}
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* First & Last Name */}
              <InputText
                name="refFirstLastName"
                value={inputs.refFirstLastName}
                onChange={handleInput}
                placeholder="First & Last Name *"
                required
              />

              {/* Date of Birth */}
              <Calendar
                value={inputs.refDOB}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, refDOB: e.value }))
                }
                placeholder="Date of Birth *"
                dateFormat="dd/mm/yy"
                showIcon
                required
                className="w-full"
              />

              {/* Nationality */}
              <InputText
                name="refNationality"
                value={inputs.refNationality}
                onChange={handleInput}
                placeholder="Nationality *"
                required
              />

              {/* Phone / WhatsApp */}
              <InputText
                name="refPhoneWhatsApp"
                value={inputs.refPhoneWhatsApp}
                onChange={handleInput}
                placeholder="Phone / WhatsApp *"
                required
              />

              {/* Email */}
              <InputText
                name="refEmail"
                type="email"
                value={inputs.refEmail}
                onChange={handleInput}
                placeholder="Email *"
                required
                className="col-span-2"
              />

              {/* Address */}
              <InputTextarea
                name="refAddress"
                value={inputs.refAddress}
                onChange={handleInput}
                placeholder="Address *"
                rows={3}
                required
                className="col-span-2"
              />

              {/* Driving License Category */}
              <Dropdown
                value={inputs.refDrivingLicenseCategory}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    refDrivingLicenseCategory: e.value,
                  }))
                }
                options={licenseCategoryOptions}
                placeholder="Driving License Category *"
                required
                className="w-full"
              />

              {/* Driving License Number */}
              <InputText
                name="refDrivingLicenseNumber"
                value={inputs.refDrivingLicenseNumber}
                onChange={handleInput}
                placeholder="Driving License Number *"
                required
              />

              {/* Driving License Expiry Date */}
              <Calendar
                value={inputs.refDrivingLicenseExpiryDate}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    refDrivingLicenseExpiryDate: e.value,
                  }))
                }
                placeholder="License Expiry Date *"
                dateFormat="dd/mm/yy"
                showIcon
                required
                className="w-full"
              />

              {/* Issuing Country */}
              <InputText
                name="refIssuingCountry"
                value={inputs.refIssuingCountry}
                onChange={handleInput}
                placeholder="Issuing Country *"
                required
              />

              {/* ID/Passport Number */}
              <InputText
                name="refIDPassportNumber"
                value={inputs.refIDPassportNumber}
                onChange={handleInput}
                placeholder="ID/Passport Number *"
                required
              />

              {/* ID/Passport Expiry Date */}
              <Calendar
                value={inputs.refIDPassportExpiryDate}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    refIDPassportExpiryDate: e.value,
                  }))
                }
                placeholder="ID/Passport Expiry Date *"
                dateFormat="dd/mm/yy"
                showIcon
                required
                className="w-full"
              />

              {/* Employment Type */}
              <Dropdown
                value={inputs.refEmploymentType}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    refEmploymentType: e.value,
                  }))
                }
                options={employmentTypeOptions}
                placeholder="Employment Type *"
                required
                className="w-full"
              />

              {/* Start Date */}
              <Calendar
                value={inputs.refStartDate}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, refStartDate: e.value }))
                }
                placeholder="Start Date (First day at work) *"
                dateFormat="dd/mm/yy"
                showIcon
                required
                className="w-full"
              />

              {/* Notes */}
              <InputTextarea
                name="refNotes"
                value={inputs.refNotes}
                onChange={handleInput}
                placeholder="Notes (Optional)"
                rows={4}
                className="col-span-2"
              />

              {/* Submit Button */}
              <div className="col-span-2">
                <Button
                  type="submit"
                  label={isEditMode ? "Update Driver" : "Add Driver"}
                  loading={submitLoading}
                  className="w-full"
                />
              </div>
            </div>
          </form>
        </Sidebar>
      </div>
    </div>
  );
};
``
export default StaffTransfer;