import axios from "axios";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";

const DriverDashboard = () => {
  const { t } = useTranslation("global");
  const toast = useRef(null);

  // Get logged-in driver ID from localStorage
  const loggedInDriverId = 1; // TODO: Get from localStorage.getItem("driverId") or from auth context

  const [allocatedBookings, setAllocatedBookings] = useState([]);
  const [viewDetailsSidebar, setViewDetailsSidebar] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" }
  ];

  // Dummy data - bookings allocated to logged-in driver
  const DUMMY_ALLOCATED_BOOKINGS = [
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
  }, []);

  const fetchAllocatedBookings = async () => {
    try {
      // TODO: Replace with your API endpoint
      // const response = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/driver/allocatedBookings`,
      //   {
      //     headers: {
      //       Authorization: localStorage.getItem("token"),
      //     },
      //     params: {
      //       driverId: loggedInDriverId
      //     }
      //   }
      // );
      // const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY);
      // setAllocatedBookings(data.result);

      // Use dummy data for now - only bookings allocated to this driver
      const driverBookings = DUMMY_ALLOCATED_BOOKINGS.filter(
        booking => booking.allocatedDriver === loggedInDriverId
      );
      setAllocatedBookings(driverBookings);
    } catch (error) {
      console.error("Error fetching allocated bookings:", error);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // TODO: Replace with your API endpoint
      // const response = await axios.post(
      //   `${import.meta.env.VITE_API_URL}/driver/updateBookingStatus`,
      //   {
      //     bookingId: bookingId,
      //     status: newStatus,
      //     driverId: loggedInDriverId
      //   },
      //   {
      //     headers: {
      //       Authorization: localStorage.getItem("token"),
      //     },
      //   }
      // );
      // const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY);
      
      // if (data.success) {
      //   fetchAllocatedBookings();
      //   toast.current?.show({
      //     severity: "success",
      //     summary: "Success",
      //     detail: "Status updated successfully",
      //     life: 3000
      //   });
      // }

      // Local state update for now
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

  const viewDetailsAction = (rowData) => (
    <Button
      icon="pi pi-eye"
      severity="info"
      text
      onClick={() => {
        setSelectedBooking(rowData);
        setViewDetailsSidebar(true);
      }}
    />
  );

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      Pending: "#ff9800",
      "In Progress": "#2196F3",
      Completed: "#4CAF50"
    };

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

  const carBodyTemplate = (rowData) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src={rowData.carImage}
        alt={rowData.carType}
        style={{ width: "40px", height: "30px", objectFit: "cover", borderRadius: "4px" }}
      />
      <span>{rowData.carType}</span>
    </div>
  );

  return (
    <div className="p-4 mt-2">
      <Toast ref={toast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "600", margin: "0" }}>
            My Allocated Bookings
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
            Total Bookings: {allocatedBookings.length}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "#fff3cd", padding: "16px", borderRadius: "8px", border: "1px solid #ffc107" }}>
          <div style={{ fontSize: "14px", color: "#856404", marginBottom: "4px" }}>Pending</div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#856404" }}>
            {allocatedBookings.filter(b => b.status === "Pending").length}
          </div>
        </div>

        <div style={{ backgroundColor: "#cfe2ff", padding: "16px", borderRadius: "8px", border: "1px solid #0d6efd" }}>
          <div style={{ fontSize: "14px", color: "#084298", marginBottom: "4px" }}>In Progress</div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#084298" }}>
            {allocatedBookings.filter(b => b.status === "In Progress").length}
          </div>
        </div>

        <div style={{ backgroundColor: "#d1e7dd", padding: "16px", borderRadius: "8px", border: "1px solid #198754" }}>
          <div style={{ fontSize: "14px", color: "#0a3622", marginBottom: "4px" }}>Completed</div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#0a3622" }}>
            {allocatedBookings.filter(b => b.status === "Completed").length}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
          All Allocated Bookings
        </h3>
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
            header="S.No"
            headerStyle={{ width: "3rem" }}
            body={(_, options) => options.rowIndex + 1}
          />
          
          <Column
            field="refCustId"
            header="Booking ID"
            headerStyle={{ width: "8rem" }}
            style={{ fontWeight: "600", color: "#0a5c9c" }}
          />
          
          <Column
            field="customerName"
            header="Customer Name"
            headerStyle={{ width: "12rem" }}
          />
          
          <Column
            header="Car"
            headerStyle={{ width: "12rem" }}
            body={carBodyTemplate}
          />
          
          <Column
            field="fromLocation"
            header="From"
            headerStyle={{ width: "15rem" }}
            body={(rowData) => <div style={{ fontSize: "12px" }}>{rowData.fromLocation}</div>}
          />
          
          <Column
            field="toLocation"
            header="To"
            headerStyle={{ width: "15rem" }}
            body={(rowData) => <div style={{ fontSize: "12px" }}>{rowData.toLocation}</div>}
          />
          
          <Column
            header="Price"
            headerStyle={{ width: "8rem" }}
            body={(rowData) => `€${rowData.price.toFixed(2)}`}
            style={{ fontWeight: "600" }}
          />
          
          <Column
            header="Pickup Date"
            headerStyle={{ width: "10rem" }}
            body={(rowData) => (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "500" }}>{rowData.pickupDate}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{rowData.pickupTime}</div>
              </div>
            )}
          />
          
          <Column
            header="Status"
            headerStyle={{ width: "12rem" }}
            body={statusBodyTemplate}
          />
          
          <Column
            header="Actions"
            headerStyle={{ width: "8rem" }}
            body={viewDetailsAction}
          />
        </DataTable>
      </div>

      {/* View Details Sidebar */}
      {selectedBooking && (
        <Sidebar
          visible={viewDetailsSidebar}
          onHide={() => setViewDetailsSidebar(false)}
          position="right"
          style={{ width: "500px" }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
            Booking Details
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Booking Summary */}
            <div style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: "500" }}>Booking ID:</span>
                <span style={{ fontWeight: "600", color: "#0a5c9c" }}>{selectedBooking.refCustId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: "500" }}>Status:</span>
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
                <span style={{ fontWeight: "500" }}>Total Price:</span>
                <span style={{ fontSize: "18px", fontWeight: "600", color: "#2196F3" }}>
                  €{selectedBooking.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Customer Details</h3>
              <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                <div><strong>Name:</strong> {selectedBooking.customerName}</div>
                <div><strong>Email:</strong> {selectedBooking.customerEmail}</div>
                <div>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${selectedBooking.customerPhone}`} style={{ color: "#2196F3" }}>
                    {selectedBooking.customerPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Journey Details */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Journey Details</h3>
              <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                <div><strong>From:</strong> {selectedBooking.fromLocation}</div>
                <div><strong>To:</strong> {selectedBooking.toLocation}</div>
              </div>
            </div>

            {/* Pickup Details */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Pickup Details</h3>
              <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                <div><strong> Date:</strong> {selectedBooking.pickupDate}</div>
                <div><strong> Time:</strong> {selectedBooking.pickupTime}</div>
              </div>
            </div>

            {/* Return Details */}
            {selectedBooking.returnDate && (
              <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Return Details</h3>
                <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                  <div><strong> Date:</strong> {selectedBooking.returnDate}</div>
                  <div><strong> Time:</strong> {selectedBooking.returnTime}</div>
                </div>
              </div>
            )}

            {/* Car Details */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Vehicle Details</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <img
                  src={selectedBooking.carImage}
                  alt={selectedBooking.carType}
                  style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                  <div><strong>Type:</strong> {selectedBooking.carType}</div>
                  <div><strong>Passengers:</strong> {selectedBooking.passengers}</div>
                  <div><strong>Luggage:</strong> {selectedBooking.luggage}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
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
                    // Open Google Maps or your navigation app
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBooking.fromLocation)}`);
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </Sidebar>
      )}
    </div>
  );
};

export default DriverDashboard;