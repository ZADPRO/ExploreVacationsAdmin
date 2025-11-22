import React, { useState } from 'react';
import {  UserPlus, Plus, X, Calendar, Clock, MapPin, Users, Briefcase, Car, ArrowLeftRight } from 'lucide-react';
import '../../Pages/15-Transfer/transfer.css'

import { useTranslation } from "react-i18next";
interface CarData {
  id: number;
  name: string;
  price: number;
  passengers: number;
  luggage: number;
}

interface DriverData {
  id: number;
  name: string;
  phone: string;
  status: string;
}

interface Booking {
  id: number;
  refCustId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fromLocation: string;
  toLocation: string;
  carType: string;
  passengers: number;
  luggage: number;
  price: number;
  pickupDate: string;
  pickupTime: string;
  returnDate: string | null;
  returnTime: string | null;
  status: string;
  allocatedDriver: number | null;
  bookingDate: string;
  flightNumber?: string;
  driverNotes?: string;
}

interface NewBookingForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fromLocation: string;
  toLocation: string;
  carType: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  hasReturn: boolean;
}

interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  fromLocation?: string;
  toLocation?: string;
  carType?: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
}

const CARS_DATA: CarData[] = [
  { id: 1, name: "Economy", price: 1920.24, passengers: 3, luggage: 3 },
  { id: 2, name: "Standard", price: 3174.91, passengers: 3, luggage: 3 },
  { id: 3, name: "First Class", price: 4603.62, passengers: 3, luggage: 3 },
  { id: 4, name: "Van", price: 3882.45, passengers: 7, luggage: 7 }
];

const DRIVERS_DATA: DriverData[] = [
  { id: 1, name: "John Smith", phone: "+44 7123 456789", status: "Available" },
  { id: 2, name: "Sarah Johnson", phone: "+44 7234 567890", status: "Available" },
  { id: 3, name: "Mike Wilson", phone: "+44 7345 678901", status: "Busy" },
  { id: 4, name: "Emily Davis", phone: "+44 7456 789012", status: "Available" }
];

    const { t } = useTranslation("global");
const DUMMY_BOOKINGS: Booking[] = [
  {
    id: 2,
    refCustId: "BK002",
    customerName: "Bob Turner",
    customerEmail: "bob@example.com",
    customerPhone: "+44 7000 222222",
    fromLocation: "London Gatwick Airport",
    toLocation: "Paris CDG Airport",
    carType: "Standard",
    passengers: 3,
    luggage: 3,
    price: 3174.91,
    pickupDate: "2024-01-16",
    pickupTime: "02:00 PM",
    returnDate: null,
    returnTime: null,
    status: "Allocated",
    allocatedDriver: 1,
    bookingDate: "2024-01-11",
    flightNumber: "BA123",
    driverNotes: "Customer prefers quiet journey"
  }
];

const Transfer = () => {
  const [bookings, setBookings] = useState<Booking[]>(DUMMY_BOOKINGS);
  const [viewDetailsSidebar, setViewDetailsSidebar] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [allocateDialogVisible, setAllocateDialogVisible] = useState(false);
  const [addBookingDialogVisible, setAddBookingDialogVisible] = useState(false);
  const [viewReturnDetailsSidebar, setViewReturnDetailsSidebar] = useState(false);
  const [selectedReturnBooking] = useState<Booking | null>(null);
  const [selectedBookingForAllocation, setSelectedBookingForAllocation] = useState<Booking | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [drivers] = useState<DriverData[]>(DRIVERS_DATA);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ severity: '', summary: '', detail: '' });
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const [newBooking, setNewBooking] = useState<NewBookingForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    fromLocation: '',
    toLocation: '',
    carType: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    hasReturn: false
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const showToastMessage = (severity: string, summary: string, detail: string) => {
    setToastMessage({ severity, summary, detail });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const generateBookingId = () => {
    const lastId = bookings.length > 0 ? parseInt(bookings[bookings.length - 1].refCustId.replace('BK', '')) : 0;
    return `BK${String(lastId + 1).padStart(3, '0')}`;
  };

  const validateBookingForm = () => {
    const errors: FormErrors = {};
    if (!newBooking.customerName.trim()) errors.customerName = 'Customer name is required';
    if (!newBooking.customerEmail.trim()) errors.customerEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newBooking.customerEmail)) errors.customerEmail = 'Invalid email format';
    if (!newBooking.customerPhone.trim()) errors.customerPhone = 'Phone number is required';
    if (!newBooking.fromLocation.trim()) errors.fromLocation = 'Pickup location is required';
    if (!newBooking.toLocation.trim()) errors.toLocation = 'Drop-off location is required';
    if (!newBooking.carType) errors.carType = 'Please select a car type';
    if (!newBooking.pickupDate) errors.pickupDate = 'Pickup date is required';
    if (!newBooking.pickupTime) errors.pickupTime = 'Pickup time is required';
    if (newBooking.hasReturn) {
      if (!newBooking.returnDate) errors.returnDate = 'Return date is required';
      if (!newBooking.returnTime) errors.returnTime = 'Return time is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddBooking = () => {
    if (!validateBookingForm()) {
      showToastMessage('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }
    const selectedCar = CARS_DATA.find(car => car.name === newBooking.carType);
    if (!selectedCar) {
      showToastMessage('error', 'Error', 'Invalid car type selected');
      return;
    }
    const booking: Booking = {
      id: bookings.length + 1,
      refCustId: generateBookingId(),
      customerName: newBooking.customerName,
      customerEmail: newBooking.customerEmail,
      customerPhone: newBooking.customerPhone,
      fromLocation: newBooking.fromLocation,
      toLocation: newBooking.toLocation,
      carType: selectedCar.name,
      passengers: selectedCar.passengers,
      luggage: selectedCar.luggage,
      price: selectedCar.price,
      pickupDate: newBooking.pickupDate,
      pickupTime: newBooking.pickupTime,
      returnDate: newBooking.hasReturn ? newBooking.returnDate : null,
      returnTime: newBooking.hasReturn ? newBooking.returnTime : null,
      status: "Pending",
      allocatedDriver: null,
      bookingDate: new Date().toISOString().split('T')[0]
    };
    setBookings([...bookings, booking]);
    setAddBookingDialogVisible(false);
    setNewBooking({
      customerName: '', customerEmail: '', customerPhone: '', fromLocation: '',
      toLocation: '', carType: '', pickupDate: '', pickupTime: '', returnDate: '', returnTime: '', hasReturn: false
    });
    setFormErrors({});
    showToastMessage('success', 'Success', 'Booking added successfully');
  };

  const allocateDriver = () => {
    if (!selectedDriver) {
      showToastMessage('error', 'Error', 'Please select a driver');
      return;
    }
    if (!selectedBookingForAllocation) {
      showToastMessage('error', 'Error', 'No booking selected');
      return;
    }
    const updatedBookings = bookings.map(booking =>
      booking.id === selectedBookingForAllocation.id
        ? { ...booking, allocatedDriver: selectedDriver.id, status: "Allocated" }
        : booking
    );
    setBookings(updatedBookings);
    setAllocateDialogVisible(false);
    setSelectedDriver(null);
    showToastMessage('success', 'Success', `Driver ${selectedDriver.name} allocated successfully`);
  };

  const handleInputChange = (field: keyof NewBookingForm, value: string | boolean) => {
    setNewBooking(prev => ({ ...prev, [field]: value }));
    if (field in formErrors) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleRowExpansion = (bookingId: number) => {
    setExpandedRows(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const removeDriver = (bookingId: number) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, allocatedDriver: null, status: "Pending" }
        : booking
    );
    setBookings(updatedBookings);
    showToastMessage('success', 'Success', 'Driver removed successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Allocated': return '#2196F3';
      case 'Completed': return '#4CAF50';
      default: return '#f44336';
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {showToast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px',
          backgroundColor: toastMessage.severity === 'success' ? '#4CAF50' : '#f44336',
          color: 'white', padding: '16px 24px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10000, minWidth: '300px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{toastMessage.summary}</div>
          <div style={{ fontSize: '14px' }}>{toastMessage.detail}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', margin: 0, color: '#333' }}>{t("dashboard.Transfer Bookings")}</h2>
        <button onClick={() => setAddBookingDialogVisible(true)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
          backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px',
          fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
        }}>
          <Plus size={20} />
          {t("dashboard.Add New Booking")}
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          {t("dashboard.All Bookings")} ({bookings.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.S.No")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Booking ID")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Customer")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Car Type")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.From")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.To")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Pickup ")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Price")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Status")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Driver")}</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Return")}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {booking.returnDate && (
                          <button
                            onClick={() => toggleRowExpansion(booking.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <span style={{ fontSize: '18px', transform: expandedRows.includes(booking.id) ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                              ▶
                            </span>
                          </button>
                        )}
                        <span>{index + 1}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <span
                        onClick={() => { setSelectedBooking(booking); setViewDetailsSidebar(true); }}
                        style={{
                          fontWeight: '600',
                          color: '#2196F3',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {booking.refCustId}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{booking.customerName}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Car size={16} />
                        {booking.carType}
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', maxWidth: '150px' }}>{booking.fromLocation}</td>
                    <td style={{ padding: '12px', fontSize: '13px', maxWidth: '150px' }}>{booking.toLocation}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{booking.pickupDate}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600' }}>€{booking.price}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        backgroundColor: getStatusColor(booking.status),
                        color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {booking.allocatedDriver ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#333' }}>
                            {drivers.find(d => d.id === booking.allocatedDriver)?.name}
                          </span>
                          <button
                            onClick={() => removeDriver(booking.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              color: '#f44336',
                              fontSize: '16px',
                              fontWeight: 'bold'
                            }}
                            title="Remove driver"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBookingForAllocation(booking);
                              setAllocateDialogVisible(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              color: '#2196F3',
                              fontSize: '16px'
                            }}
                            title="Change driver"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBookingForAllocation(booking);
                            setAllocateDialogVisible(true);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <UserPlus size={14} />
                          {t("dashboard.Allocate")}
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {booking.returnDate ? (
                        <div style={{ fontSize: '13px', color: '#333' }}>
                          <div style={{ fontWeight: '600' }}>{booking.returnDate}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{booking.returnTime}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#999' }}>{t("dashboard.One-way")}</span>
                      )}
                    </td>
                  </tr>

                  {expandedRows.includes(booking.id) && booking.returnDate && (
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <td colSpan={11} style={{ padding: '16px' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', border: '2px solid #2196F3' }}>
                          <h4 style={{ margin: '0 0 12px 0', color: '#2196F3', fontSize: '14px', fontWeight: '600' }}>
                            {t("dashboard.Return Journey Details")}
                          </h4>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#e3f2fd', borderBottom: '1px solid #2196F3' }}>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057' }}>{t("dashboard.From")}</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057' }}>{t("dashboard.To")}</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Return Date")}</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Return Time")}</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Car Type")}</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Status")}</th>
                                <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#495057' }}>{t("dashboard.Driver")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ padding: '10px', fontSize: '13px' }}>{booking.toLocation}</td>
                                <td style={{ padding: '10px', fontSize: '13px' }}>{booking.fromLocation}</td>
                                <td style={{ padding: '10px', fontSize: '13px' }}>{booking.returnDate}</td>
                                <td style={{ padding: '10px', fontSize: '13px' }}>{booking.returnTime}</td>
                                <td style={{ padding: '10px', fontSize: '13px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Car size={14} />
                                    {booking.carType}
                                  </div>
                                </td>
                                <td style={{ padding: '10px' }}>
                                  <span style={{
                                    backgroundColor: getStatusColor(booking.status),
                                    color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600'
                                  }}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                  {booking.allocatedDriver ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '13px', color: '#333' }}>
                                        {drivers.find(d => d.id === booking.allocatedDriver)?.name}
                                      </span>
                                      <button
                                        onClick={() => removeDriver(booking.id)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          padding: '2px',
                                          color: '#f44336',
                                          fontSize: '16px',
                                          fontWeight: 'bold'
                                        }}
                                        title="Remove driver"
                                      >
                                        ✕
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedBookingForAllocation(booking);
                                          setAllocateDialogVisible(true);
                                        }}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          padding: '2px',
                                          color: '#2196F3',
                                          fontSize: '16px'
                                        }}
                                        title="Change driver"
                                      >
                                        ✓
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setSelectedBookingForAllocation(booking);
                                        setAllocateDialogVisible(true);
                                      }}
                                      style={{
                                        padding: '6px 10px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                    >
                                      <UserPlus size={12} />
                                      {t("dashboard.Allocate")}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    <>
    {/* ========= ALLOCATE DRIVER MODAL ========= */}
{allocateDialogVisible && (
  <div
    className="modal-overlay"
    onClick={() => { setAllocateDialogVisible(false); setSelectedDriver(null); }}
  >
    <div
      className="modal-box small-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>{t("dashboard.Allocate Driver")}</h2>
        <button
          className="close-btn"
          onClick={() => { setAllocateDialogVisible(false); setSelectedDriver(null); }}
        >
          <X size={24} />
        </button>
      </div>

      <div className="modal-body">
        <div className="modal-booking-info">
          <p className="bold">{t("dashboard.Booking")}: {selectedBookingForAllocation?.refCustId}</p>
          <p className="gray">
            {selectedBookingForAllocation?.fromLocation} → {selectedBookingForAllocation?.toLocation}
          </p>
        </div>

        <div className="modal-input-block">
          <label className="modal-label">Select Driver</label>
          <select
            value={selectedDriver?.id || ""}
            onChange={(e) => {
              const driver = drivers.find(d => d.id === parseInt(e.target.value));
              setSelectedDriver(driver || null);
            }}
            className="modal-select"
          >
            <option value="">{t("dashboard.Choose a driver")}</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.status} ({driver.phone})
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-outline" onClick={() => { setAllocateDialogVisible(false); setSelectedDriver(null); }}>
            {t("dashboard.Cancel")}
          </button>
          <button className="btn-primary" onClick={allocateDriver}>
            {t("dashboard.Allocate")}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* ========= ADD BOOKING MODAL ========= */}
{addBookingDialogVisible && (
  <div className="modal-overlay" onClick={() => { setAddBookingDialogVisible(false); setFormErrors({}); }}>
    <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
      
      <div className="modal-header">
        <h2>{t("dashboard.Add New Booking")}</h2>
        <button className="close-btn" onClick={() => { setAddBookingDialogVisible(false); setFormErrors({}); }}>
          <X size={24} />
        </button>
      </div>

      {/* 👇 SCROLL AREA - NO EXTRA DIV */}
      <div className="modal-body scrollable-box">

       
         <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Customer Information")}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>{t("dashboard.Customer Name")} *</label>
                    <input type="text" value={newBooking.customerName} onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Enter customer name"
                      style={{ width: '100%', padding: '10px', border: formErrors.customerName ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.customerName && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.customerName}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>{t("dashboard.Email")} *</label>
                      <input type="email" value={newBooking.customerEmail} onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="customer@example.com"
                        style={{ width: '100%', padding: '10px', border: formErrors.customerEmail ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.customerEmail && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.customerEmail}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>{t("dashboard.Phone Number")} *</label>
                      <input type="tel" value={newBooking.customerPhone} onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="+44 7000 000000"
                        style={{ width: '100%', padding: '10px', border: formErrors.customerPhone ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.customerPhone && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.customerPhone}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Journey Details")}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {t("dashboard.From Location")} *
                    </label>
                    <input type="text" value={newBooking.fromLocation} onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                      placeholder="Pickup location"
                      style={{ width: '100%', padding: '10px', border: formErrors.fromLocation ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.fromLocation && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.fromLocation}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                     {t("dashboard. To Location")} *
                    </label>
                    <input type="text" value={newBooking.toLocation} onChange={(e) => handleInputChange('toLocation', e.target.value)}
                      placeholder="Drop-off location"
                      style={{ width: '100%', padding: '10px', border: formErrors.toLocation ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.toLocation && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.toLocation}</span>}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>Vehicle Selection</h3>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                    <Car size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {t("dashboard.Select Car Type")} *
                  </label>
                  <select value={newBooking.carType} onChange={(e) => handleInputChange('carType', e.target.value)}
                    style={{ width: '100%', padding: '10px', border: formErrors.carType ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white' }}>
                    <option value="">{t("dashboard.Choose a car type")}</option>
                    {CARS_DATA.map(car => (
                      <option key={car.id} value={car.name}>
                        {car.name} - €{car.price} ({car.passengers} {t("dashboard.passengers")}, {car.luggage} luggage)
                      </option>
                    ))}
                  </select>
                  {formErrors.carType && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.carType}</span>}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Pickup Details")}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {t("dashboard.Pickup Date")} *
                    </label>
                    <input type="date" value={newBooking.pickupDate} onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                      style={{ width: '100%', padding: '10px', border: formErrors.pickupDate ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.pickupDate && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.pickupDate}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {t("dashboard.Pickup Time")} *
                    </label>
                    <input type="time" value={newBooking.pickupTime} onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                      style={{ width: '100%', padding: '10px', border: formErrors.pickupTime ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.pickupTime && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.pickupTime}</span>}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newBooking.hasReturn} onChange={(e) => handleInputChange('hasReturn', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Return Journey</span>
                </label>
              </div>

              {newBooking.hasReturn && (
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Return Details")}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {t("dashboard.Return Date")} *
                      </label>
                      <input type="date" value={newBooking.returnDate} onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        min={newBooking.pickupDate}
                        style={{ width: '100%', padding: '10px', border: formErrors.returnDate ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.returnDate && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.returnDate}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                        <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {t("dashboard.Return Time")} *
                      </label>
                      <input type="time" value={newBooking.returnTime} onChange={(e) => handleInputChange('returnTime', e.target.value)}
                        style={{ width: '100%', padding: '10px', border: formErrors.returnTime ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.returnTime && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.returnTime}</span>}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => { setAddBookingDialogVisible(false); setFormErrors({}); }}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#333', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  {t("dashboard.Cancel")}
                </button>
                <button onClick={handleAddBooking}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)' }}>
                  {t("dashboard.Add Booking")}
                </button>
              </div>
            
        </div>

      </div>
    </div>
  </div>
)}


      {/* View Details Sidebar */}
     {/* Booking Details Slide-Over Panel */}
{viewDetailsSidebar && selectedBooking && (
  <div
    className="overlay-backdrop"
    onClick={() => setViewDetailsSidebar(false)}
  >
    <div
      className="overlay-sidebar"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="sidebar-header">
        <h2>Booking Details</h2>
        <button className="close-btn" onClick={() => setViewDetailsSidebar(false)}>
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="sidebar-content">

        {/* Booking Summary */}
        <div className="summary-box">
          <div className="summary-row">
            <span>Booking ID:</span>
            <span className="blue-text">{selectedBooking.refCustId}</span>
          </div>
          <div className="summary-row">
            <span>Status:</span>
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(selectedBooking.status) }}
            >
              {selectedBooking.status}
            </span>
          </div>
          <div className="summary-row">
            <span>Total Price:</span>
            <span className="price-text">€{selectedBooking.price}</span>
          </div>
        </div>

        {/* Customer */}
        <div>
          <h3 className="section-title">Customer Details</h3>
          <div className="details-text">
            <div><strong>Name:</strong> {selectedBooking.customerName}</div>
            <div><strong>Email:</strong> {selectedBooking.customerEmail}</div>
            <div><strong>Phone:</strong> {selectedBooking.customerPhone}</div>
          </div>
        </div>

        {/* Journey */}
        <div className="section-divider">
          <h3 className="section-title">Journey Details</h3>
          <div className="details-text">
            <div><strong>From:</strong> <div className="gray-text">{selectedBooking.fromLocation}</div></div>
            <div><strong>To:</strong> <div className="gray-text">{selectedBooking.toLocation}</div></div>
          </div>
        </div>

        {/* Pickup */}
        <div className="section-divider">
          <h3 className="section-title">Pickup Details</h3>
          <div className="details-text">
            <div><strong>Date:</strong> {selectedBooking.pickupDate}</div>
            <div><strong>Time:</strong> {selectedBooking.pickupTime}</div>
          </div>
        </div>

        {/* Return */}
        {selectedBooking.returnDate && (
          <div className="section-divider">
            <h3 className="section-title">Return Details</h3>
            <div className="details-text">
              <div><strong>Date:</strong> {selectedBooking.returnDate}</div>
              <div><strong>Time:</strong> {selectedBooking.returnTime}</div>
            </div>
          </div>
        )}

        {/* Vehicle */}
        <div className="section-divider">
          <h3 className="section-title">Vehicle Details</h3>
          <div className="details-text">
            <div className="icon-row"><Car size={18} /><strong>Car Type:</strong> {selectedBooking.carType}</div>
            <div className="icon-row"><Users size={18} /><strong>Passengers:</strong> {selectedBooking.passengers}</div>
            <div className="icon-row"><Briefcase size={18} /><strong>Luggage:</strong> {selectedBooking.luggage}</div>
          </div>
        </div>

        {/* Driver */}
        <div className="section-divider">
          <h3 className="section-title">Assigned Driver</h3>
          <div className="details-text">
            {selectedBooking.allocatedDriver ? (
              <>
                <div><strong>Driver:</strong> {drivers.find(d => d.id === selectedBooking.allocatedDriver)?.name}</div>
                <div><strong>Phone:</strong> {drivers.find(d => d.id === selectedBooking.allocatedDriver)?.phone}</div>
              </>
            ) : (
              <div className="no-driver">No driver assigned yet</div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="section-divider">
          <h3 className="section-title">Extras & Notes</h3>
          <div className="details-text">
            <div><strong>Flight/Train Number</strong>
              <div className="gray-text">
                {selectedBooking.flightNumber || 'Please provide your flight number. Driver will track your flight.'}
              </div>
            </div>

            <div><strong>Driver Notes (Outward)</strong>
              <div className="gray-text">
                {selectedBooking.driverNotes || 'No additional notes provided'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Return Details Sidebar */}
      {viewReturnDetailsSidebar && selectedReturnBooking && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 1001 }} onClick={() => setViewReturnDetailsSidebar(false)}>
          <div style={{ width: '500px', backgroundColor: 'white', height: '100vh', overflowY: 'auto', boxShadow: '-4px 0 12px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#9C27B0' }}>Return Journey Details</h2>
              <button onClick={() => setViewReturnDetailsSidebar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#f3e5f5', padding: '16px', borderRadius: '8px', border: '2px solid #9C27B0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500' }}>Booking ID:</span>
                  <span style={{ fontWeight: '600', color: '#9C27B0' }}>{selectedReturnBooking.refCustId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500' }}>Journey Type:</span>
                  <span style={{ fontWeight: '600', color: '#9C27B0' }}>Return Trip</span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>Customer Information</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <div><strong>Name:</strong> {selectedReturnBooking.customerName}</div>
                  <div><strong>Email:</strong> {selectedReturnBooking.customerEmail}</div>
                  <div><strong>Phone:</strong> {selectedReturnBooking.customerPhone}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>Return Journey Route</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>From:</strong>
                    <div style={{ color: '#666', marginTop: '4px' }}>{selectedReturnBooking.toLocation}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                    <ArrowLeftRight size={20} color="#9C27B0" />
                  </div>
                  <div>
                    <strong>To:</strong>
                    <div style={{ color: '#666', marginTop: '4px' }}>{selectedReturnBooking.fromLocation}</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>Return Schedule</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar size={18} color="#9C27B0" />
                    <strong>Date:</strong> {selectedReturnBooking.returnDate}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="#9C27B0" />
                    <strong>Time:</strong> {selectedReturnBooking.returnTime}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>Vehicle Information</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Car size={18} />
                    <strong>Car Type:</strong> {selectedReturnBooking.carType}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Users size={18} />
                    <strong>Passengers:</strong> {selectedReturnBooking.passengers}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={18} />
                    <strong>Luggage:</strong> {selectedReturnBooking.luggage}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>Assigned Driver</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  {selectedReturnBooking.allocatedDriver ? (
                    <>
                      <div><strong>Driver:</strong> {drivers.find(d => d.id === selectedReturnBooking.allocatedDriver)?.name}</div>
                      <div><strong>Phone:</strong> {drivers.find(d => d.id === selectedReturnBooking.allocatedDriver)?.phone}</div>
                      <div><strong>Status:</strong> {drivers.find(d => d.id === selectedReturnBooking.allocatedDriver)?.status}</div>
                    </>
                  ) : (
                    <div style={{ color: '#999', fontStyle: 'italic' }}>No driver assigned for return journey yet</div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>Journey Status</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  <span style={{
                    backgroundColor: getStatusColor(selectedReturnBooking.status),
                    color: 'white', padding: '6px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '600'
                  }}>
                    {selectedReturnBooking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
    {addBookingDialogVisible && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setAddBookingDialogVisible(false); setFormErrors({}); }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>{t("dashboard.Add New Booking")}</h2>
              <button onClick={() => { setAddBookingDialogVisible(false); setFormErrors({}); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Customer Information")}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>{t("dashboard.Customer Name")} *</label>
                    <input type="text" value={newBooking.customerName} onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Enter customer name"
                      style={{ width: '100%', padding: '10px', border: formErrors.customerName ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.customerName && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.customerName}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>{t("dashboard.Email")} *</label>
                      <input type="email" value={newBooking.customerEmail} onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="customer@example.com"
                        style={{ width: '100%', padding: '10px', border: formErrors.customerEmail ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.customerEmail && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.customerEmail}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>{t("dashboard.Phone Number")} *</label>
                      <input type="tel" value={newBooking.customerPhone} onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="+44 7000 000000"
                        style={{ width: '100%', padding: '10px', border: formErrors.customerPhone ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.customerPhone && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.customerPhone}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Journey Details")}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {t("dashboard.From Location")} *
                    </label>
                    <input type="text" value={newBooking.fromLocation} onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                      placeholder="Pickup location"
                      style={{ width: '100%', padding: '10px', border: formErrors.fromLocation ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.fromLocation && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.fromLocation}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {t("dashboard.To Location")} *
                    </label>
                    <input type="text" value={newBooking.toLocation} onChange={(e) => handleInputChange('toLocation', e.target.value)}
                      placeholder="Drop-off location"
                      style={{ width: '100%', padding: '10px', border: formErrors.toLocation ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.toLocation && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.toLocation}</span>}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Vehicle Selection")}</h3>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                    <Car size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {t("dashboard.Select Car Type")} *
                  </label>
                  <select value={newBooking.carType} onChange={(e) => handleInputChange('carType', e.target.value)}
                    style={{ width: '100%', padding: '10px', border: formErrors.carType ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white' }}>
                    <option value="">{t("dashboard.Choose a car type")}</option>
                    {CARS_DATA.map(car => (
                      <option key={car.id} value={car.name}>
                        {car.name} - €{car.price} ({car.passengers} {t("dashboard.passengers")}, {car.luggage} luggage)
                      </option>
                    ))}
                  </select>
                  {formErrors.carType && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.carType}</span>}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Pickup Details")}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {t("dashboard.Pickup Date")} *
                    </label>
                    <input type="date" value={newBooking.pickupDate} onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                      style={{ width: '100%', padding: '10px', border: formErrors.pickupDate ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.pickupDate && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.pickupDate}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {t("dashboard.Pickup Time")} *
                    </label>
                    <input type="time" value={newBooking.pickupTime} onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                      style={{ width: '100%', padding: '10px', border: formErrors.pickupTime ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    {formErrors.pickupTime && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.pickupTime}</span>}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newBooking.hasReturn} onChange={(e) => handleInputChange('hasReturn', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{t("dashboard.Add Return Journey")}</span>
                </label>
              </div>

              {newBooking.hasReturn && (
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2196F3' }}>{t("dashboard.Return Details")}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {t("dashboard.Return Date")} *
                      </label>
                      <input type="date" value={newBooking.returnDate} onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        min={newBooking.pickupDate}
                        style={{ width: '100%', padding: '10px', border: formErrors.returnDate ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.returnDate && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.returnDate}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                        <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {t("dashboard.Return Time")} *
                      </label>
                      <input type="time" value={newBooking.returnTime} onChange={(e) => handleInputChange('returnTime', e.target.value)}
                        style={{ width: '100%', padding: '10px', border: formErrors.returnTime ? '1px solid #f44336' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formErrors.returnTime && <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.returnTime}</span>}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => { setAddBookingDialogVisible(false); setFormErrors({}); }}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#333', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  {t("dashboard.Cancel")}
                </button>
                <button onClick={handleAddBooking}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)' }}>
                  {t("dashboard.Add Booking")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transfer;