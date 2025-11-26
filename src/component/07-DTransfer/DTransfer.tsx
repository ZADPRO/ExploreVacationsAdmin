import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";

// Type Definitions
interface Booking {
  id: number;
  refCustId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fromLocation: string;
  toLocation: string;
  carType: string;
  carImage: string;
  passengers: number;
  luggage: number;
  price: number;
  pickupDate: string;
  pickupTime: string;
  returnDate: string | null;
  returnTime: string | null;
  status: "Pending" | "In Progress" | "Completed";
  allocatedDriver: number;
  bookingDate: string;
}

interface StatusOption {
  label: string;
  value: "Pending" | "In Progress" | "Completed";
}

interface StatusColors {
  Pending: string;
  "In Progress": string;
  Completed: string;
}

const DriverDashboard = () => {
  const { t } = useTranslation("global");
  const toast = useRef<Toast>(null);

  // Get logged-in driver ID from localStorage
  const loggedInDriverId = 1; // TODO: Get from localStorage.getItem("driverId") or from auth context

  const [allocatedBookings, setAllocatedBookings] = useState<Booking[]>([]);
  const [viewDetailsSidebar, setViewDetailsSidebar] = useState<boolean>(false);
  const [viewMobileDialog, setViewMobileDialog] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  const statusOptions: StatusOption[] = [
    { label: t("dashboard.Pending"), value: "Pending" },
    { label: t("dashboard.In Progress"), value: "In Progress" },
    { label: t("dashboard.Completed"), value: "Completed" }
  ];

  // Dummy data - bookings allocated to logged-in driver
  const DUMMY_ALLOCATED_BOOKINGS: Booking[] = [
    {
      id: 1,
      refCustId: "BK001",
      customerName: "Alice Cooper",
      customerEmail: "alice@example.com",
      customerPhone: "+44 7000 111111",
      fromLocation: "London Heathrow Airport",
      toLocation: "Milan Malpensa Airport",
      carType: "Economy",
      carImage: "https://via.placeholder.com/50/FF5733/FFFFFF?text=Car",
      passengers: 3,
      luggage: 3,
      price: 1920.24,
      pickupDate: "2024-01-15",
      pickupTime: "10:30 AM",
      returnDate: "2024-01-20",
      returnTime: "02:00 PM",
      status: "Pending",
      allocatedDriver: 1,
      bookingDate: "2024-01-10"
    },
    {
      id: 2,
      refCustId: "BK004",
      customerName: "David Brown",
      customerEmail: "david@example.com",
      customerPhone: "+44 7000 444444",
      fromLocation: "Manchester Airport",
      toLocation: "Edinburgh Airport",
      carType: "Standard",
      carImage: "https://via.placeholder.com/50/33FF57/FFFFFF?text=Car",
      passengers: 3,
      luggage: 3,
      price: 2500.00,
      pickupDate: "2024-01-18",
      pickupTime: "08:00 AM",
      returnDate: null,
      returnTime: null,
      status: "In Progress",
      allocatedDriver: 1,
      bookingDate: "2024-01-13"
    },
    {
      id: 3,
      refCustId: "BK007",
      customerName: "Emma Wilson",
      customerEmail: "emma@example.com",
      customerPhone: "+44 7000 777777",
      fromLocation: "Birmingham Airport",
      toLocation: "London City Airport",
      carType: "Van",
      carImage: "https://via.placeholder.com/50/FFA500/FFFFFF?text=Van",
      passengers: 6,
      luggage: 6,
      price: 3200.50,
      pickupDate: "2024-01-20",
      pickupTime: "03:00 PM",
      returnDate: "2024-01-25",
      returnTime: "09:00 AM",
      status: "Pending",
      allocatedDriver: 1,
      bookingDate: "2024-01-14"
    }
  ];

  useEffect(() => {
    fetchAllocatedBookings();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAllocatedBookings = async () => {
    try {
      const driverBookings = DUMMY_ALLOCATED_BOOKINGS.filter(
        booking => booking.allocatedDriver === loggedInDriverId
      );
      setAllocatedBookings(driverBookings);
    } catch (error) {
      console.error("Error fetching allocated bookings:", error);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: "Pending" | "In Progress" | "Completed") => {
    try {
      const updatedBookings = allocatedBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      setAllocatedBookings(updatedBookings);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: `Status updated to ${newStatus}`,
        life: 3000
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update status",
        life: 3000
      });
    }
  };

  const handleRowClick = (rowData: Booking) => {
    setSelectedBooking(rowData);
    if (isMobile) {
      setViewMobileDialog(true);
    } else {
      setViewDetailsSidebar(true);
    }
  };

  const bookingIdTemplate = (rowData: Booking) => (
    <span 
      style={{ 
        fontWeight: "600", 
        color: "#0a5c9c", 
        cursor: "pointer",
        textDecoration: "underline"
      }}
      onClick={() => handleRowClick(rowData)}
    >
      {rowData.refCustId}
    </span>
  );

  const viewDetailsAction = (rowData: Booking) => (
    <Button
      icon="pi pi-eye"
      severity="info"
      text
      onClick={() => handleRowClick(rowData)}
    />
  );

  const statusBodyTemplate = (rowData: Booking) => {
    const statusColors: StatusColors = {
      Pending: "#ff9800",
      "In Progress": "#2196F3",
      Completed: "#4CAF50"
    };

    // Mobile: just show status badge (not clickable)
    if (isMobile) {
      return (
        <span
          style={{
            backgroundColor: statusColors[rowData.status],
            color: "white",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: "500",
            display: "inline-block"
          }}
        >
          {rowData.status}
        </span>
      );
    }

    // Desktop: dropdown to change status
    return (
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        onChange={(e) => updateBookingStatus(rowData.id, e.value)}
        style={{
          backgroundColor: statusColors[rowData.status],
          color: "white",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "500",
          border: "none",
          minWidth: "140px"
        }}
      />
    );
  };

  const carBodyTemplate = (rowData: Booking) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src={rowData.carImage}
        alt={rowData.carType}
        style={{ width: "40px", height: "30px", objectFit: "cover", borderRadius: "4px" }}
      />
      <span>{rowData.carType}</span>
    </div>
  );
 const customHeader = (

    <div className="flex align-items-center gap-2">

    <h2 style={{ fontSize: "20px", fontWeight: "600"}}>
            {t("dashboard.Booking Details")}
          </h2>
    </div>
  );
  const renderDetailsContent = () => {
    if (!selectedBooking) return null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Booking Summary */}
        <div style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontWeight: "500" }}>{t("dashboard.Booking ID")}:</span>
            <span style={{ fontWeight: "600", color: "#0a5c9c" }}>{selectedBooking.refCustId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontWeight: "500" }}>{t("dashboard.Status")}:</span>
            <Dropdown
              value={selectedBooking.status}
              options={statusOptions}
              onChange={(e) => {
                updateBookingStatus(selectedBooking.id, e.value);
                setSelectedBooking({ ...selectedBooking, status: e.value });
              }}
              style={{ width: "150px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "500" }}>{t("dashboard.Total price")}:</span>
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#2196F3" }}>
              €{selectedBooking.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>{t("dashboard.Customer Details")}</h3>
          <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
            <div><strong>{t("dashboard.name")}:</strong> {selectedBooking.customerName}</div>
            <div><strong>{t("dashboard.Email")}:</strong> {selectedBooking.customerEmail}</div>
            <div>
              <strong>{t("dashboard.Phone Number")}:</strong>{" "}
              <a href={`tel:${selectedBooking.customerPhone}`} style={{ color: "#2196F3" }}>
                {selectedBooking.customerPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Journey Details */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>{t("dashboard.Journey Details")}</h3>
          <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
            <div><strong>{t("dashboard.From")}:</strong> {selectedBooking.fromLocation}</div>
            <div><strong>{t("dashboard.To")}:</strong> {selectedBooking.toLocation}</div>
          </div>
        </div>

        {/* Pickup Details */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>{t("dashboard.Pickup Details")}</h3>
          <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
            <div><strong>{t("dashboard.Date")}:</strong> {selectedBooking.pickupDate}</div>
            <div><strong>{t("dashboard.Time")}:</strong> {selectedBooking.pickupTime}</div>
          </div>
        </div>

        {/* Return Details */}
        {selectedBooking.returnDate && (
          <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>{t("dashboard.Return Details")}</h3>
            <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
              <div><strong>{t("dashboard.Date")}:</strong> {selectedBooking.returnDate}</div>
              <div><strong>{t("dashboard.Time")}:</strong> {selectedBooking.returnTime}</div>
            </div>
          </div>
        )}

        {/* Car Details */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>{t("dashboard.Vehicle Details")}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <img
              src={selectedBooking.carImage}
              alt={selectedBooking.carType}
              style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
            />
            <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
              <div><strong>{t("dashboard.Type")}:</strong> {selectedBooking.carType}</div>
              <div><strong>{t("dashboard.passengers")}:</strong> {selectedBooking.passengers}</div>
              <div><strong>{t("dashboard.Luggage")}:</strong> {selectedBooking.luggage}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Button
              label="Call Customer"
              icon="pi pi-phone"
              severity="success"
              onClick={() => window.location.href = `tel:${selectedBooking.customerPhone}`}
              style={{ width: "100%" }}
            />
            <Button
              label="Navigate to Location"
              icon="pi pi-map-marker"
              severity="info"
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBooking.fromLocation)}`);
              }}
              style={{ width: "100%" }}
            />
          </div>
        </div> */}
      </div>
    );
  };

  return (
    <div className="p-4 mt-2">
      <Toast ref={toast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: "600", margin: "0" }}>
            {t("dashboard.My Allocated Bookings")}
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
            {t("dashboard.Total Bookings")}: {allocatedBookings.length}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "#fff3cd", padding: "16px", borderRadius: "8px", border: "1px solid #ffc107" }}>
          <div style={{ fontSize: "14px", color: "#856404", marginBottom: "4px" }}>{t("dashboard.Pending")}</div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#856404" }}>
            {allocatedBookings.filter(b => b.status === "Pending").length}
          </div>
        </div>

        <div style={{ backgroundColor: "#cfe2ff", padding: "16px", borderRadius: "8px", border: "1px solid #0d6efd" }}>
          <div style={{ fontSize: "14px", color: "#084298", marginBottom: "4px" }}>{t("dashboard.In Progress")}</div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#084298" }}>
            {allocatedBookings.filter(b => b.status === "In Progress").length}
          </div>
        </div>

        <div style={{ backgroundColor: "#d1e7dd", padding: "16px", borderRadius: "8px", border: "1px solid #198754" }}>
          <div style={{ fontSize: "14px", color: "#0a3622", marginBottom: "4px" }}>{t("dashboard.Completed")}</div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#0a3622" }}>
            {allocatedBookings.filter(b => b.status === "Completed").length}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: isMobile ? "8px" : "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
          {t("dashboard.All Allocated Bookings")}
        </h3>
        
        {/* Mobile View - Only 4 columns */}
        {isMobile ? (
          <DataTable
            value={allocatedBookings}
            tableStyle={{ minWidth: "100%" }}
            scrollable
            scrollHeight="400px"
            emptyMessage={t("dashboard.No bookings allocated yet")}
          >
            <Column
              header={t("dashboard.S.No")}
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            
            <Column
              field="refCustId"
              header={t("dashboard.Booking ID")}
              headerStyle={{ width: "7rem" }}
              body={bookingIdTemplate}
            />
            
            <Column
              field="customerName"
              header={t("dashboard.name")}
              headerStyle={{ width: "10rem" }}
              style={{ fontSize: "13px" }}
            />
            
            <Column
              header={t("dashboard.Status")}
              headerStyle={{ width: "8rem" }}
              body={statusBodyTemplate}
            />
          </DataTable>
        ) : (
          // Desktop View - All columns
          <DataTable
            value={allocatedBookings}
            tableStyle={{ minWidth: "100%" }}
            scrollable
            scrollHeight="500px"
            paginator
            rows={10}
            emptyMessage="No bookings allocated yet"
          >
            <Column
              header={t("dashboard.S.No")}
              headerStyle={{ width: "3rem" }}
              body={(_, options) => options.rowIndex + 1}
            />
            
            <Column
              field="refCustId"
              header={t("dashboard.Booking ID")}
              headerStyle={{ width: "8rem" }}
              style={{ fontWeight: "600", color: "#0a5c9c" }}
            />
            
            <Column
              field="customerName"
              header={t("dashboard.Customer Name")}
              headerStyle={{ width: "12rem" }}
            />
            
            <Column
              header={t("dashboard.car")}
              headerStyle={{ width: "12rem" }}
              body={carBodyTemplate}
            />
            
            <Column
              field="fromLocation"
              header={t("dashboard.From")}
              headerStyle={{ width: "15rem" }}
              body={(rowData: Booking) => <div style={{ fontSize: "12px" }}>{rowData.fromLocation}</div>}
            />
            
            <Column
              field="toLocation"
              header={t("dashboard.To")}
              headerStyle={{ width: "15rem" }}
              body={(rowData: Booking) => <div style={{ fontSize: "12px" }}>{rowData.toLocation}</div>}
            />
            
            <Column
              header={t("dashboard.Price")}
              headerStyle={{ width: "8rem" }}
              body={(rowData: Booking) => `€${rowData.price.toFixed(2)}`}
              style={{ fontWeight: "600" }}
            />
            
            <Column
              header={t("dashboard.Pickup Date")}
              headerStyle={{ width: "10rem" }}
              body={(rowData: Booking) => (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>{rowData.pickupDate}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{rowData.pickupTime}</div>
                </div>
              )}
            />
            
            <Column
              header={t("dashboard.Status")}
              headerStyle={{ width: "12rem" }}
              body={statusBodyTemplate}
            />
            
            <Column
              header={t("dashboard.Actions")}
              headerStyle={{ width: "8rem" }}
              body={viewDetailsAction}
            />
          </DataTable>
        )}
      </div>

      {/* Desktop - Sidebar View */}
      {!isMobile && selectedBooking && (
        <Sidebar
          visible={viewDetailsSidebar}
          onHide={() => setViewDetailsSidebar(false)}
          position="right"
          style={{ width: "500px" }}
           header={customHeader}
        >
          
          {renderDetailsContent()}
        </Sidebar>
      )}

      {/* Mobile - Dialog View */}
      {isMobile && selectedBooking && (
        <Dialog
          visible={viewMobileDialog}
          onHide={() => setViewMobileDialog(false)}
          header={t("dashboard.Booking Details")}
          style={{ width: "95vw", maxWidth: "500px" }}
          contentStyle={{ 
            padding: "20px",
            maxHeight: "70vh",
            overflowY: "auto"
          }}
          dismissableMask
        >
          {renderDetailsContent()}
        </Dialog>
      )}
    </div>
  );
};

export default DriverDashboard;