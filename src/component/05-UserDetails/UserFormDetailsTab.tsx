// import { Column } from "primereact/column";
// import { DataTable } from "primereact/datatable";
// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";
// import { Sidebar } from "primereact/sidebar";
// import { InputText } from "primereact/inputtext";
// import { Toast } from "primereact/toast";
// import { useState, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import CryptoJS from "crypto-js";

// // Type definitions
// interface UserDetailData {
//   offlineCarBookingId?: '';
//   refUserName: string;
//   refUserMobile: string;
//   refUserMail: string;
//   refDoorNumber: string;
//   refStreet: string;
//   refArea: string;
//   refcountry: string;
//   vehicleModel?: string;
//   licensePlate?: string;
//   bookingReferenceNo?: string;
//   returnMileage?: string;
//   fuelReading?: string;
//   damageDescription?: string;
//   accidentDate?: string;
//   accidentTime?: string;
//   accidentPlace?: string;
//   otherDriverName?: string;
//   otherDriverLicense?: string;
//   otherDriverAddress?: string;
//   otherDriverContact?: string;
//   otherVehicleModel?: string;
//   otherLicensePlate?: string;
//   ownerNameContact?: string;
//   insuranceCompany?: string;
//   insurancePolicy?: string;
// }

// interface UserFormDetailsTabProps {
//   UserDetails: UserDetailData[];
//   deleteUSer: (id: number) => Promise<void>;
//   selectedBannerId: number | null;
//   setSelectedBannerId: React.Dispatch<React.SetStateAction<number | null>>;
//   visibleDialog: boolean;
//   setVisibleDialog: React.Dispatch<React.SetStateAction<boolean>>;
//   fetchUserDetails: () => Promise<void>;
// }

// // Add this to your UserDetails component, specifically for the User Form Details TabPanel

// const UserFormDetailsTab: React.FC<UserFormDetailsTabProps> = ({ 
//   UserDetails, 
//   deleteUSer, 
//   selectedBannerId, 
//   setSelectedBannerId, 
//   visibleDialog, 
//   setVisibleDialog,
//   fetchUserDetails 
// }) => {
//   const { t } = useTranslation("global");
//   const toast = useRef<Toast>(null);
//   const [showEditSidebar, setShowEditSidebar] = useState<boolean>(false);
//   const [editFormData, setEditFormData] = useState<UserDetailData>({
//     refUserName: "",
//     refUserMobile: "",
//     refUserMail: "",
//     refDoorNumber: "",
//     refStreet: "",
//     refArea: "",
//     refcountry: "",
//     vehicleModel: "",
//     licensePlate: "",
//     bookingReferenceNo: "",
//     returnMileage: "",
//     fuelReading: "",
//     damageDescription: "",
//     accidentDate: "",
//     accidentTime: "",
//     accidentPlace: "",
//     otherDriverName: "",
//     otherDriverLicense: "",
//     otherDriverAddress: "",
//     otherDriverContact: "",
//     otherVehicleModel: "",
//     otherLicensePlate: "",
//     ownerNameContact: "",
//     insuranceCompany: "",
//     insurancePolicy: "",
//   });
//   const [submitLoading, setSubmitLoading] = useState<boolean>(false);

//   const decrypt = (
//     encryptedData: string,
//     iv: string,
//     key: string
//   ): any => {
//     const cipherParams = CryptoJS.lib.CipherParams.create({
//       ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
//     });

//     const decrypted = CryptoJS.AES.decrypt(
//       cipherParams,
//       CryptoJS.enc.Hex.parse(key),
//       {
//         iv: CryptoJS.enc.Hex.parse(iv),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       }
//     );

//     return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
//   };

//   const handleEdit = (rowData: UserDetailData) => {
//     setEditFormData({
//       offlineCarBookingId: rowData.offlineCarBookingId || "",
//       refUserName: rowData.refUserName || "",
//       refUserMobile: rowData.refUserMobile || "",
//       refUserMail: rowData.refUserMail || "",
//       refDoorNumber: rowData.refDoorNumber || "",
//       refStreet: rowData.refStreet || "",
//       refArea: rowData.refArea || "",
//       refcountry: rowData.refcountry || "",
//       vehicleModel: rowData.vehicleModel || "",
//       licensePlate: rowData.licensePlate || "",
//       bookingReferenceNo: rowData.bookingReferenceNo || "",
//       returnMileage: rowData.returnMileage || "",
//       fuelReading: rowData.fuelReading || "",
//       damageDescription: rowData.damageDescription || "",
//       accidentDate: rowData.accidentDate || "",
//       accidentTime: rowData.accidentTime || "",
//       accidentPlace: rowData.accidentPlace || "",
//       otherDriverName: rowData.otherDriverName || "",
//       otherDriverLicense: rowData.otherDriverLicense || "",
//       otherDriverAddress: rowData.otherDriverAddress || "",
//       otherDriverContact: rowData.otherDriverContact || "",
//       otherVehicleModel: rowData.otherVehicleModel || "",
//       otherLicensePlate: rowData.otherLicensePlate || "",
//       ownerNameContact: rowData.ownerNameContact || "",
//       insuranceCompany: rowData.insuranceCompany || "",
//       insurancePolicy: rowData.insurancePolicy || "",
//     });
//     setShowEditSidebar(true);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setEditFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitEdit = async () => {
//     setSubmitLoading(true);
//     try {
//       const response = await axios.post(
//         import.meta.env.VITE_API_URL + "/newCarsRoutes/updateOfflineCarBooking",
//         editFormData,
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = decrypt(
//         response.data[1],
//         response.data[0],
//         import.meta.env.VITE_ENCRYPTION_KEY
//       );

//       if (data.success) {
//         localStorage.setItem("token", "Bearer " + data.token);
//         fetchUserDetails();
//         setShowEditSidebar(false);
//         toast.current?.show({
//           severity: "success",
//           summary: "Success",
//           detail: "User details updated successfully",
//           life: 3000,
//         });
//       }
//     } catch (error: any) {
//       console.error("Error updating user:", error);
//       toast.current?.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Failed to update user details",
//         life: 3000,
//       });
//     } finally {
//       setSubmitLoading(false);
//     }
//   };
// const actionEditDamage = (rowData: UserDetailData) => {
//     return (
//       <Button
//         icon="pi pi-pencil"
//         className="p-button-rounded p-button-success"
//         onClick={() => handleEdit(rowData)}
//         tooltip="Edit Damage Details"
//       />
//     );
//   };

//   const actionEditInventory = (rowData: UserDetailData) => {
//     return (
//       <Button
//         icon="pi pi-pencil"
//         className="p-button-rounded p-button-success"
//         onClick={() => handleEdit(rowData)}
//         tooltip="Edit Inventory Details"
//       />
//     );
//   };

//   const actionDownloadDamagePDF = (rowData: UserDetailData) => {
//     return (
//       <Button
//         icon="pi pi-download"
//         className="p-button-rounded p-button-warning"
//         onClick={() => generateVehicleDamagePDF(rowData)}
//         tooltip="Download Damage Report"
//       />
//     );
//   };

//   const actionDownloadInventoryPDF = (rowData: UserDetailData) => {
//     return (
//       <Button
//         icon="pi pi-download"
//         className="p-button-rounded p-button-info"
//         onClick={() => generateVehicleInventoryPDF(rowData)}
//         tooltip="Download Inventory Report"
//       />
//     );
//   };
//   const generateVehicleDamagePDF = (user: UserDetailData) => {
//     const pdfContent = `<!DOCTYPE html>
// <html>
// <head>
//   <title>Vehicle Damage Report</title>
//   <style>
//     body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
//     .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 30px; }
//     .section { margin-bottom: 20px; }
//     .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px; }
//     .field { margin: 8px 0; }
//     .label { font-weight: bold; display: inline-block; width: 200px; }
//     .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
//     .signature-box { width: 45%; }
//     .signature-line { border-top: 1px solid #000; margin-top: 40px; padding-top: 10px; }
//   </style>
// </head>
// <body>
//   <div class="header">Vehicle Damage Report</div>
  
//   <div class="section">
//     <div class="section-title">Vehicle Information</div>
//     <div class="field"><span class="label">Vehicle Model:</span> ${user.vehicleModel || ''}</div>
//     <div class="field"><span class="label">License Plate:</span> ${user.licensePlate || ''}</div>
//     <div class="field"><span class="label">Booking Reference No.:</span> ${user.bookingReferenceNo || ''}</div>
//     <div class="field"><span class="label">Return Mileage / KM:</span> ${user.returnMileage || ''}</div>
//     <div class="field"><span class="label">Fuel Reading:</span> ${user.fuelReading || ''}%</div>
//   </div>

//   <div class="section">
//     <div class="section-title">Customer Information</div>
//     <div class="field"><span class="label">Name:</span> ${user.refUserName}</div>
//     <div class="field"><span class="label">Mobile:</span> ${user.refUserMobile}</div>
//     <div class="field"><span class="label">Email:</span> ${user.refUserMail}</div>
//     <div class="field"><span class="label">Address:</span> ${user.refDoorNumber}, ${user.refStreet}, ${user.refArea}, ${user.refcountry}</div>
//   </div>

//   <div class="section">
//     <div class="section-title">Description of Damages</div>
//     <div class="field">${user.damageDescription || '_______________________________________'}</div>
//   </div>

//   ${user.accidentDate ? `
//   <div class="section">
//     <div class="section-title">Accident Details</div>
//     <div class="field"><span class="label">Date:</span> ${user.accidentDate}</div>
//     <div class="field"><span class="label">Time:</span> ${user.accidentTime || ''}</div>
//     <div class="field"><span class="label">Place:</span> ${user.accidentPlace || ''}</div>
//   </div>
//   ` : ''}

//   ${user.otherDriverName ? `
//   <div class="section">
//     <div class="section-title">Details of Other Driver</div>
//     <div class="field"><span class="label">Vehicle Model:</span> ${user.otherVehicleModel || ''}</div>
//     <div class="field"><span class="label">License Plate:</span> ${user.otherLicensePlate || ''}</div>
//     <div class="field"><span class="label">Driver Name:</span> ${user.otherDriverName}</div>
//     <div class="field"><span class="label">Driving License No.:</span> ${user.otherDriverLicense || ''}</div>
//     <div class="field"><span class="label">Driver Address:</span> ${user.otherDriverAddress || ''}</div>
//     <div class="field"><span class="label">Driver Contact No.:</span> ${user.otherDriverContact || ''}</div>
//   </div>
//   ` : ''}

//   ${user.insuranceCompany ? `
//   <div class="section">
//     <div class="section-title">Insurance Information</div>
//     <div class="field"><span class="label">Owner Name & Contact:</span> ${user.ownerNameContact || ''}</div>
//     <div class="field"><span class="label">Insurance Company:</span> ${user.insuranceCompany}</div>
//     <div class="field"><span class="label">Insurance Policy:</span> ${user.insurancePolicy || ''}</div>
//   </div>
//   ` : ''}

//   <div class="signature-section">
//     <div class="signature-box">
//       <div>Client's Representative (Explore Vacations AG)</div>
//       <div class="signature-line">Signature: _______________________</div>
//       <div style="margin-top: 10px;">Date: ${new Date().toLocaleDateString()}</div>
//     </div>
//     <div class="signature-box">
//       <div>Customer</div>
//       <div class="signature-line">Signature: _______________________</div>
//       <div style="margin-top: 10px;">Date: ${new Date().toLocaleDateString()}</div>
//     </div>
//   </div>

//   <div style="margin-top: 30px; font-size: 12px; font-style: italic;">
//     I hereby certify that the above details are accurate.
//   </div>
// </body>
// </html>`;

//     const printWindow = window.open('', '_blank');
//     if (printWindow) {
//       printWindow.document.write(pdfContent);
//       printWindow.document.close();
//       printWindow.onload = () => {
//         printWindow.print();
//       };
//     }
//   };

//   const actionEdit = (rowData: UserDetailData) => {
//     return (
//       <Button
//         icon="pi pi-pencil"
//         className="p-button-rounded p-button-success"
//         onClick={() => handleEdit(rowData)}
//         tooltip="Edit"
//       />
//     );
//   };

//   const actionDownloadPDF = (rowData: UserDetailData) => {
//     return (
//       <Button
//         icon="pi pi-download"
//         className="p-button-rounded p-button-info"
//         onClick={() => generateVehicleDamagePDF(rowData)}
//         tooltip="Download PDF"
//       />
//     );
//   };

//   const actionDeleteUser = (rowData: UserDetailData) => {
//     return (
//       <Button
//         icon="pi pi-trash"
//         severity="danger"
//         onClick={() => {
//           setSelectedBannerId(rowData.offlineCarBookingId || 0);
//           setVisibleDialog(true);
//         }}
//       />
//     );
//   };

//   return (
//     <div className="mt-1 p-2">
//       <Toast ref={toast} />
//       <h3 className="text-lg font-bold mb-4">
//         {t("dashboard.User Form Details")}
//       </h3>
//       <DataTable
//         value={UserDetails}
//         paginator
//         rows={3}
//         scrollable
//         scrollHeight="500px"
//         tableStyle={{ minWidth: "50rem" }}
//       >
//         <Column
//           header={t("dashboard.SNo")}
//           headerStyle={{ width: "3rem" }}
//           body={(_, options) => options.rowIndex + 1}
//         />

//         <Column
//           field="refUserName"
//           header={t("dashboard.User Name")}
//           style={{ minWidth: "200px" }}
//         />

//         <Column
//           field="refUserMobile"
//           header={t("dashboard.Mobile")}
//           style={{ minWidth: "150px" }}
//         />

//         <Column
//           field="refUserMail"
//           header={t("dashboard.Email")}
//           style={{ minWidth: "150px" }}
//         />

//         <Column
//           field="refDoorNumber"
//           header={t("dashboard.Door Number")}
//           style={{ minWidth: "150px" }}
//         />

//         <Column
//           field="refStreet"
//           header={t("dashboard.Street")}
//           style={{ minWidth: "250px" }}
//         />

//         <Column
//           field="refArea"
//           header={t("dashboard.Area")}
//           style={{ minWidth: "200px" }}
//         />

//         <Column
//           field="refcountry"
//           header={t("dashboard.Country")}
//           style={{ minWidth: "200px" }}
//         />

//         <Column body={actionEdit} header={t("Edit damage vehicle")} />
//                 <Column body={actionEdit} header={t("Edit Inventory vehicle")} />
//         <Column body={actionDownloadPDF} header={t("Download damage vehicle PDF")} />
//         <Column body={actionDownloadPDF} header={t("Download Inventory vehicle PDF")} />
//         <Column body={actionDeleteUser} header={t("dashboard.Delete")} />
//       </DataTable>

//       <Dialog
//         header="Confirm Deletion"
//         visible={visibleDialog}
//         style={{ width: "350px" }}
//         onHide={() => setVisibleDialog(false)}
//         footer={
//           <div className="flex justify-end gap-2">
//             <Button
//               label="No"
//               icon="pi pi-times"
//               className="p-button-text"
//               onClick={() => setVisibleDialog(false)}
//             />
//             <Button
//               label="Yes"
//               icon="pi pi-check"
//               className="p-button-danger"
//               onClick={() => {
//                 if (selectedBannerId !== null) {
//                   deleteUSer(selectedBannerId);
//                 }
//                 setVisibleDialog(false);
//               }}
//             />
//           </div>
//         }
//       >
//         <p>Are you sure you want to delete this user?</p>
//       </Dialog>

//       <Sidebar
//         visible={showEditSidebar}
//         style={{ width: "60%" }}
//         onHide={() => setShowEditSidebar(false)}
//         position="right"
//       >
//         <h2 className="text-2xl font-bold mb-6">Edit Vehicle Damage Report</h2>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Customer Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">User Name *</label>
//               <InputText
//                 name="refUserName"
//                 value={editFormData.refUserName}
//                 onChange={handleInputChange}
//                 className="w-full"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Mobile *</label>
//               <InputText
//                 name="refUserMobile"
//                 value={editFormData.refUserMobile}
//                 onChange={handleInputChange}
//                 className="w-full"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Email *</label>
//               <InputText
//                 name="refUserMail"
//                 value={editFormData.refUserMail}
//                 onChange={handleInputChange}
//                 className="w-full"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Door Number</label>
//               <InputText
//                 name="refDoorNumber"
//                 value={editFormData.refDoorNumber}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Street</label>
//               <InputText
//                 name="refStreet"
//                 value={editFormData.refStreet}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Area</label>
//               <InputText
//                 name="refArea"
//                 value={editFormData.refArea}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Country</label>
//               <InputText
//                 name="refcountry"
//                 value={editFormData.refcountry}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Vehicle Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Vehicle Model</label>
//               <InputText
//                 name="vehicleModel"
//                 value={editFormData.vehicleModel}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">License Plate</label>
//               <InputText
//                 name="licensePlate"
//                 value={editFormData.licensePlate}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Booking Reference</label>
//               <InputText
//                 name="bookingReferenceNo"
//                 value={editFormData.bookingReferenceNo}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Return Mileage (KM)</label>
//               <InputText
//                 name="returnMileage"
//                 value={editFormData.returnMileage}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Fuel Reading (%)</label>
//               <InputText
//                 name="fuelReading"
//                 value={editFormData.fuelReading}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Damage Description</h3>
//           <textarea
//             name="damageDescription"
//             value={editFormData.damageDescription}
//             onChange={handleInputChange}
//             rows={4}
//             placeholder="Describe any damages to the vehicle..."
//             className="w-full px-3 py-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Accident Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Date</label>
//               <InputText
//                 type="date"
//                 name="accidentDate"
//                 value={editFormData.accidentDate}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Time</label>
//               <InputText
//                 type="time"
//                 name="accidentTime"
//                 value={editFormData.accidentTime}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Place</label>
//               <InputText
//                 name="accidentPlace"
//                 value={editFormData.accidentPlace}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Other Driver Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Driver Name</label>
//               <InputText
//                 name="otherDriverName"
//                 value={editFormData.otherDriverName}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">License No.</label>
//               <InputText
//                 name="otherDriverLicense"
//                 value={editFormData.otherDriverLicense}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Contact No.</label>
//               <InputText
//                 name="otherDriverContact"
//                 value={editFormData.otherDriverContact}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Vehicle Model</label>
//               <InputText
//                 name="otherVehicleModel"
//                 value={editFormData.otherVehicleModel}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">License Plate</label>
//               <InputText
//                 name="otherLicensePlate"
//                 value={editFormData.otherLicensePlate}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Address</label>
//               <InputText
//                 name="otherDriverAddress"
//                 value={editFormData.otherDriverAddress}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Insurance Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Owner Name & Contact</label>
//               <InputText
//                 name="ownerNameContact"
//                 value={editFormData.ownerNameContact}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Insurance Company</label>
//               <InputText
//                 name="insuranceCompany"
//                 value={editFormData.insuranceCompany}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-1">Insurance Policy</label>
//               <InputText
//                 name="insurancePolicy"
//                 value={editFormData.insurancePolicy}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <Button
//             label="Cancel"
//             icon="pi pi-times"
//             onClick={() => setShowEditSidebar(false)}
//             className="p-button-text"
//           />
//           <Button
//             label="Save Changes"
//             icon="pi pi-check"
//             onClick={handleSubmitEdit}
//             loading={submitLoading}
//           />
//         </div>
//       </Sidebar>
//     </div>
//   );
// };

// export default UserFormDetailsTab;

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CryptoJS from "crypto-js";

// Type definitions
interface UserDetailData {
  offlineCarBookingId?: number | string;
  refUserName: string;
  refUserMobile: string;
  refUserMail: string;
  refDoorNumber: string;
  refStreet: string;
  refArea: string;
  refcountry: string;
  vehicleModel?: string;
  licensePlate?: string;
  bookingReferenceNo?: string;
  returnMileage?: string;
  fuelReading?: string;
  damageDescription?: string;
  accidentDate?: string;
  accidentTime?: string;
  accidentPlace?: string;
  otherDriverName?: string;
  otherDriverLicense?: string;
  otherDriverAddress?: string;
  otherDriverContact?: string;
  otherVehicleModel?: string;
  otherLicensePlate?: string;
  ownerNameContact?: string;
  insuranceCompany?: string;
  insurancePolicy?: string;
}

interface UserFormDetailsTabProps {
  UserDetails: UserDetailData[];
  deleteUSer: (id: number) => Promise<void>;
  selectedBannerId: number | null;
  setSelectedBannerId: React.Dispatch<React.SetStateAction<number | null>>;
  visibleDialog: boolean;
  setVisibleDialog: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUserDetails: () => Promise<void>;
}

const UserFormDetailsTab: React.FC<UserFormDetailsTabProps> = ({ 
  UserDetails, 
  deleteUSer, 
  selectedBannerId, 
  setSelectedBannerId, 
  visibleDialog, 
  setVisibleDialog,
  fetchUserDetails 
}) => {
  const { t } = useTranslation("global");
  const toast = useRef<Toast>(null);
  const [showEditDamageSidebar, setShowEditDamageSidebar] = useState<boolean>(false);
  const [showEditInventorySidebar, setShowEditInventorySidebar] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<UserDetailData>({
    refUserName: "",
    refUserMobile: "",
    refUserMail: "",
    refDoorNumber: "",
    refStreet: "",
    refArea: "",
    refcountry: "",
    vehicleModel: "",
    licensePlate: "",
    bookingReferenceNo: "",
    returnMileage: "",
    fuelReading: "",
    damageDescription: "",
    accidentDate: "",
    accidentTime: "",
    accidentPlace: "",
    otherDriverName: "",
    otherDriverLicense: "",
    otherDriverAddress: "",
    otherDriverContact: "",
    otherVehicleModel: "",
    otherLicensePlate: "",
    ownerNameContact: "",
    insuranceCompany: "",
    insurancePolicy: "",
  });
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const decrypt = (encryptedData: string, iv: string, key: string): any => {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
    });

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  // Handle Edit for Damage Report
  const handleEditDamage = (rowData: UserDetailData) => {
    setEditFormData({
      offlineCarBookingId: rowData.offlineCarBookingId || "",
      refUserName: rowData.refUserName || "",
      refUserMobile: rowData.refUserMobile || "",
      refUserMail: rowData.refUserMail || "",
      refDoorNumber: rowData.refDoorNumber || "",
      refStreet: rowData.refStreet || "",
      refArea: rowData.refArea || "",
      refcountry: rowData.refcountry || "",
      vehicleModel: rowData.vehicleModel || "",
      licensePlate: rowData.licensePlate || "",
      bookingReferenceNo: rowData.bookingReferenceNo || "",
      returnMileage: rowData.returnMileage || "",
      fuelReading: rowData.fuelReading || "",
      damageDescription: rowData.damageDescription || "",
      accidentDate: rowData.accidentDate || "",
      accidentTime: rowData.accidentTime || "",
      accidentPlace: rowData.accidentPlace || "",
      otherDriverName: rowData.otherDriverName || "",
      otherDriverLicense: rowData.otherDriverLicense || "",
      otherDriverAddress: rowData.otherDriverAddress || "",
      otherDriverContact: rowData.otherDriverContact || "",
      otherVehicleModel: rowData.otherVehicleModel || "",
      otherLicensePlate: rowData.otherLicensePlate || "",
      ownerNameContact: rowData.ownerNameContact || "",
      insuranceCompany: rowData.insuranceCompany || "",
      insurancePolicy: rowData.insurancePolicy || "",
    });
    setShowEditDamageSidebar(true);
  };

  // Handle Edit for Inventory Report
  const handleEditInventory = (rowData: UserDetailData) => {
    setEditFormData({
      offlineCarBookingId: rowData.offlineCarBookingId || "",
      refUserName: rowData.refUserName || "",
      refUserMobile: rowData.refUserMobile || "",
      refUserMail: rowData.refUserMail || "",
      refDoorNumber: rowData.refDoorNumber || "",
      refStreet: rowData.refStreet || "",
      refArea: rowData.refArea || "",
      refcountry: rowData.refcountry || "",
      vehicleModel: rowData.vehicleModel || "",
      licensePlate: rowData.licensePlate || "",
      bookingReferenceNo: rowData.bookingReferenceNo || "",
      returnMileage: rowData.returnMileage || "",
      fuelReading: rowData.fuelReading || "",
    });
    setShowEditInventorySidebar(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    setSubmitLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/newCarsRoutes/updateOfflineCarBooking",
        editFormData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchUserDetails();
        setShowEditDamageSidebar(false);
        setShowEditInventorySidebar(false);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Details updated successfully",
          life: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error updating:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update details",
        life: 3000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Generate fuel gauge SVG
  const generateFuelGauge = (percentage: string) => {
    const fuelPercent = parseFloat(percentage) || 0;
    const angle = (fuelPercent / 100) * 180 - 90; // -90 to 90 degrees
    const needleX2 = 50 + 35 * Math.cos((angle * Math.PI) / 180);
    const needleY2 = 50 + 35 * Math.sin((angle * Math.PI) / 180);

    return `
      <svg width="120" height="80" viewBox="0 0 100 80" style="display: inline-block; vertical-align: middle;">
        <!-- Gauge Arc -->
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#ddd" stroke-width="8"/>
        <path d="M 10 50 A 40 40 0 0 1 ${10 + (80 * fuelPercent / 100)} ${50 - 40 * Math.sin((fuelPercent / 100) * Math.PI)}" 
              fill="none" stroke="#4CAF50" stroke-width="8"/>
        
        <!-- Center Circle -->
        <circle cx="50" cy="50" r="5" fill="#333"/>
        
        <!-- Needle -->
        <line x1="50" y1="50" x2="${needleX2}" y2="${needleY2}" stroke="#d32f2f" stroke-width="2"/>
        
        <!-- E and F labels -->
        <text x="5" y="58" font-size="10" fill="#666">E</text>
        <text x="88" y="58" font-size="10" fill="#666">F</text>
        
        <!-- Percentage Text -->
        <text x="50" y="72" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">${fuelPercent}%</text>
      </svg>
    `;
  };

  const generateVehicleDamagePDF = (user: UserDetailData) => {
    const pdfContent = `<!DOCTYPE html>
<html>
<head>
  <title>Vehicle Damage Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      line-height: 1.4;
      font-size: 11px;
    }
    .header-section {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #000;
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #0066cc;
      margin-right: 30px;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      flex: 1;
      text-align: center;
    }
    .top-row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    .top-left {
      flex: 2;
    }
    .top-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .field-row {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    .field-label {
      font-weight: bold;
      min-width: 120px;
      font-size: 10px;
    }
    .field-value {
      flex: 1;
      border-bottom: 1px solid #333;
      padding: 2px 5px;
      min-height: 18px;
    }
    .fuel-section {
      text-align: center;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .vehicle-diagrams {
      display: flex;
      gap: 10px;
      margin: 15px 0;
      padding: 10px;
      border: 2px solid #000;
      background: #f9f9f9;
    }
    .diagram-column {
      flex: 1;
    }
    .car-view {
      margin-bottom: 15px;
      text-align: center;
    }
    .car-outline {
      width: 100%;
      height: 80px;
      border: 2px solid #333;
      background: white;
      margin: 5px 0;
      border-radius: 5px;
    }
    .damage-desc-box {
      border: 2px solid #000;
      padding: 10px;
      min-height: 100px;
      margin-bottom: 15px;
    }
    .damage-title {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .section {
      margin: 15px 0;
      padding: 10px;
      background: #f5f5f5;
      border-left: 3px solid #0066cc;
    }
    .section-title {
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 8px;
      color: #0066cc;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .info-item {
      display: flex;
      align-items: center;
    }
    .info-label {
      font-weight: bold;
      min-width: 120px;
      font-size: 10px;
    }
    .info-value {
      flex: 1;
      border-bottom: 1px solid #666;
      padding: 2px 5px;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      gap: 20px;
    }
    .signature-box {
      flex: 1;
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 40px;
      padding-top: 5px;
      font-size: 10px;
    }
    .certification {
      margin-top: 20px;
      font-size: 10px;
      font-style: italic;
      text-align: center;
    }
    @media print {
      body { padding: 15px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header-section">
    <div class="logo">Explore<br/>VACATIONS AG</div>
    <div class="title">Vehicle Damage Report</div>
  </div>

  <div class="top-row">
    <div class="top-left">
      <div class="field-row">
        <span class="field-label">Vehicle Model:</span>
        <span class="field-value">${user.vehicleModel || ''}</span>
      </div>
      <div class="field-row">
        <span class="field-label">License Plate:</span>
        <span class="field-value">${user.licensePlate || ''}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Booking Reference No.:</span>
        <span class="field-value">${user.bookingReferenceNo || ''}</span>
      </div>
    </div>
    <div class="top-right">
      <div class="field-row">
        <span class="field-label">Return Mileage / KM:</span>
        <span class="field-value">${user.returnMileage || ''}</span>
      </div>
      <div class="fuel-section">
        <strong>Fuel Reading</strong>
        ${generateFuelGauge(user.fuelReading || '0')}
      </div>
    </div>
  </div>

  <div style="margin: 15px 0; padding: 8px; background: #fff3cd; border: 1px solid #856404; border-radius: 3px;">
    <strong style="font-size: 11px;">If the vehicle is damaged during your rental</strong>
    <div style="font-size: 10px; margin-top: 5px;">Please identify the damages to the vehicle and provide a description.</div>
  </div>

  <div class="vehicle-diagrams">
    <div class="diagram-column">
      <div class="car-view">
        <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px;">Front View</div>
        <div class="car-outline" style="position: relative;">
          <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 60%; height: 50%; border: 2px solid #666; border-radius: 10px 10px 0 0;"></div>
        </div>
      </div>
      <div class="car-view">
        <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px;">Rear View</div>
        <div class="car-outline" style="position: relative;">
          <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); width: 60%; height: 50%; border: 2px solid #666; border-radius: 0 0 10px 10px;"></div>
        </div>
      </div>
    </div>
    <div class="diagram-column">
      <div class="car-view">
        <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px;">Side View</div>
        <div class="car-outline" style="position: relative;">
          <div style="position: absolute; top: 20px; left: 10%; width: 80%; height: 40%; border: 2px solid #666; border-radius: 20px;"></div>
        </div>
      </div>
      <div class="car-view">
        <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px;">Top View</div>
        <div class="car-outline" style="position: relative;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50%; height: 70%; border: 2px solid #666; border-radius: 30px;"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="damage-desc-box">
    <div class="damage-title">Description of Damages</div>
    <div style="white-space: pre-wrap; min-height: 60px;">${user.damageDescription || ''}</div>
  </div>

  ${user.accidentDate ? `
  <div class="section">
    <div class="section-title">If you had an accident</div>
    <div style="font-size: 10px; margin-bottom: 8px;">Please record the following details at the time of the incident.</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Date:</span>
        <span class="info-value">${user.accidentDate}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Time:</span>
        <span class="info-value">${user.accidentTime || ''}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Place:</span>
        <span class="info-value">${user.accidentPlace || ''}</span>
      </div>
    </div>
  </div>
  ` : ''}

  ${user.otherDriverName ? `
  <div class="section">
    <div class="section-title">Details of other driver (if any)</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Vehicle Model:</span>
        <span class="info-value">${user.otherVehicleModel || ''}</span>
      </div>
      <div class="info-item">
        <span class="info-label">License Plate:</span>
        <span class="info-value">${user.otherLicensePlate || ''}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Driver's Name:</span>
        <span class="info-value">${user.otherDriverName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Driving License No.:</span>
        <span class="info-value">${user.otherDriverLicense || ''}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Driver's Address:</span>
        <span class="info-value">${user.otherDriverAddress || ''}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Driver's Contact No.:</span>
        <span class="info-value">${user.otherDriverContact || ''}</span>
      </div>
    </div>
  </div>
  ` : ''}

  ${user.insuranceCompany ? `
  <div class="section">
    <div class="section-title">Insurance Information</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Owner Name & Contact:</span>
        <span class="info-value">${user.ownerNameContact || ''}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Insurance Company Name:</span>
        <span class="info-value">${user.insuranceCompany}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Insurance Policy Name:</span>
        <span class="info-value">${user.insurancePolicy || ''}</span>
      </div>
    </div>
  </div>
  ` : ''}

  <div class="signature-section">
    <div class="signature-box">
      <div style="font-size: 11px; margin-bottom: 5px;">In the presence of Mr.______________ I Mr/Mrs/Miss________________hereby Certify</div>
      <div style="font-size: 10px; margin-bottom: 3px;">that the above details are accurate.</div>
      <div class="signature-line">Client (Kündin): _________________________</div>
      <div style="margin-top: 5px; font-size: 10px;">Signature: ___________________ Date: ${new Date().toLocaleDateString()}</div>
    </div>
    <div class="signature-box">
      <div style="font-size: 11px; margin-bottom: 40px;">Representative (Explore Vacations AG)</div>
      <div class="signature-line">Signature: _________________________</div>
      <div style="margin-top: 5px; font-size: 10px;">Date: ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div class="certification">
    Customer Information: ${user.refUserName} | ${user.refUserMobile} | ${user.refUserMail}<br/>
    Address: ${user.refDoorNumber}, ${user.refStreet}, ${user.refArea}, ${user.refcountry}
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };
const generateVehicleInventoryPDF = (user: UserDetailData) => {
    const pdfContent = `<!DOCTYPE html>
<html>
<head>
  <title>Vehicle Inventory Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      line-height: 1.5;
      font-size: 12px;
    }
    .header-section {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 3px solid #0066cc;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 5px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .info-section {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      border-left: 4px solid #0066cc;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: bold;
      min-width: 150px;
      color: #555;
    }
    .info-value {
      flex: 1;
      border-bottom: 1px solid #999;
      padding: 0 10px;
    }
    .table-container {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #0066cc;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
    td {
      border: 1px solid #ddd;
      padding: 10px;
    }
    .checkbox {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #333;
      margin-right: 8px;
      vertical-align: middle;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      gap: 30px;
    }
    .signature-box {
      flex: 1;
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #000;
      margin-top: 50px;
      padding-top: 8px;
      font-weight: bold;
    }
    .notes-section {
      margin: 20px 0;
      padding: 15px;
      border: 2px solid #ccc;
      background: #fafafa;
    }
    @media print {
      body { padding: 10px; }
    }
  </style>
</head>
<body>
  <div class="header-section">
    <div class="logo">Explore VACATIONS AG</div>
    <div class="title">Vehicle Inventory Checklist</div>
  </div>

  <div class="info-section">
    <div class="info-row">
      <span class="info-label">Vehicle Model:</span>
      <span class="info-value">${user.vehicleModel || ''}</span>
    </div>
    <div class="info-row">
      <span class="info-label">License Plate:</span>
      <span class="info-value">${user.licensePlate || ''}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Booking Reference No.:</span>
      <span class="info-value">${user.bookingReferenceNo || ''}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Return Mileage / KM:</span>
      <span class="info-value">${user.returnMileage || ''}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Fuel Reading:</span>
      <span class="info-value">${user.fuelReading || ''}%</span>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="width: 50%;">Inventory Item</th>
          <th style="width: 15%; text-align: center;">Present</th>
          <th style="width: 15%; text-align: center;">Missing</th>
          <th style="width: 20%; text-align: center;">Condition</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Spare Tire</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>Jack and Tools</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>First Aid Kit</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>Warning Triangle</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>Fire Extinguisher</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
<td>Owner's Manual</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>Registration Documents</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>Insurance Card</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>Floor Mats</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>USB Cable / Charger</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>GPS / Navigation System</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
        <tr>
          <td>Vehicle Keys (Quantity: ___)</td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td style="text-align: center;"><span class="checkbox"></span></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="notes-section">
    <strong style="display: block; margin-bottom: 10px; font-size: 13px;">Additional Notes / Comments:</strong>
    <div style="min-height: 80px; border-top: 1px solid #ccc; padding-top: 10px;">
      <div style="margin-bottom: 5px;">_________________________________________________________________</div>
      <div style="margin-bottom: 5px;">_________________________________________________________________</div>
      <div style="margin-bottom: 5px;">_________________________________________________________________</div>
      <div>_________________________________________________________________</div>
    </div>
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <div style="font-size: 12px; font-weight: bold; margin-bottom: 10px;">Client's Representative</div>
      <div style="font-size: 11px; margin-bottom: 5px;">(Explore Vacations AG)</div>
      <div class="signature-line">Signature: _______________________</div>
      <div style="margin-top: 10px; font-size: 11px;">Name: _______________________</div>
      <div style="margin-top: 8px; font-size: 11px;">Date: ${new Date().toLocaleDateString()}</div>
    </div>
    <div class="signature-box">
      <div style="font-size: 12px; font-weight: bold; margin-bottom: 10px;">Customer</div>
      <div style="font-size: 11px; margin-bottom: 5px;">&nbsp;</div>
      <div class="signature-line">Signature: _______________________</div>
      <div style="margin-top: 10px; font-size: 11px;">Name: ${user.refUserName}</div>
      <div style="margin-top: 8px; font-size: 11px;">Date: ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div style="margin-top: 30px; padding: 15px; background: #f0f8ff; border: 1px solid #0066cc; border-radius: 5px; font-size: 11px;">
    <strong>Customer Information:</strong><br/>
    <div style="margin-top: 8px;">
      Name: ${user.refUserName}<br/>
      Mobile: ${user.refUserMobile} | Email: ${user.refUserMail}<br/>
      Address: ${user.refDoorNumber}, ${user.refStreet}, ${user.refArea}, ${user.refcountry}
    </div>
  </div>

  <div style="margin-top: 20px; font-size: 10px; font-style: italic; text-align: center; color: #666;">
    I hereby certify that all inventory items listed above have been checked and the information provided is accurate.
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Column action buttons
  const actionEditDamage = (rowData: UserDetailData) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success"
        onClick={() => handleEditDamage(rowData)}
        tooltip="Edit Damage Details"
      />
    );
  };

  const actionEditInventory = (rowData: UserDetailData) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success"
        onClick={() => handleEditInventory(rowData)}
        tooltip="Edit Inventory Details"
      />
    );
  };

  const actionDownloadDamagePDF = (rowData: UserDetailData) => {
    return (
      <Button
        icon="pi pi-download"
        className="p-button-rounded p-button-warning"
        onClick={() => generateVehicleDamagePDF(rowData)}
        tooltip="Download Damage Report"
      />
    );
  };

  const actionDownloadInventoryPDF = (rowData: UserDetailData) => {
    return (
      <Button
        icon="pi pi-download"
        className="p-button-rounded p-button-info"
        onClick={() => generateVehicleInventoryPDF(rowData)}
        tooltip="Download Inventory Report"
      />
    );
  };

  const actionDeleteUser = (rowData: UserDetailData) => {
    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => {
          setSelectedBannerId(Number(rowData.offlineCarBookingId) || 0);
          setVisibleDialog(true);
        }}
      />
    );
  };

  return (
    <div className="mt-1 p-2">
      <Toast ref={toast} />
      <h3 className="text-lg font-bold mb-4">
        {t("dashboard.User Form Details")}
      </h3>
      <DataTable
        value={UserDetails}
        paginator
        rows={3}
        scrollable
        scrollHeight="500px"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          header={t("dashboard.SNo")}
          headerStyle={{ width: "3rem" }}
          body={(_, options) => options.rowIndex + 1}
        />

        <Column
          field="refUserName"
          header={t("dashboard.User Name")}
          style={{ minWidth: "200px" }}
        />

        <Column
          field="refUserMobile"
          header={t("dashboard.Mobile")}
          style={{ minWidth: "150px" }}
        />

        <Column
          field="refUserMail"
          header={t("dashboard.Email")}
          style={{ minWidth: "150px" }}
        />

        <Column
          field="refDoorNumber"
          header={t("dashboard.Door Number")}
          style={{ minWidth: "150px" }}
        />

        <Column
          field="refStreet"
          header={t("dashboard.Street")}
          style={{ minWidth: "250px" }}
        />

        <Column
          field="refArea"
          header={t("dashboard.Area")}
          style={{ minWidth: "200px" }}
        />

        <Column
          field="refcountry"
          header={t("dashboard.Country")}
          style={{ minWidth: "200px" }}
        />

        <Column body={actionEditDamage} header={t("Edit damage vehicle")} />
        <Column body={actionEditInventory} header={t("Edit Inventory vehicle")} />
        <Column body={actionDownloadDamagePDF} header={t("Download damage vehicle PDF")} />
        <Column body={actionDownloadInventoryPDF} header={t("Download Inventory vehicle PDF")} />
        <Column body={actionDeleteUser} header={t("dashboard.Delete")} />
      </DataTable>

      {/* Delete Confirmation Dialog */}
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
                if (selectedBannerId !== null) {
                  deleteUSer(selectedBannerId);
                }
                setVisibleDialog(false);
              }}
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this user?</p>
      </Dialog>

      {/* Edit Damage Report Sidebar */}
      <Sidebar
        visible={showEditDamageSidebar}
        style={{ width: "60%" }}
        onHide={() => setShowEditDamageSidebar(false)}
        position="right"
      >
        <h2 className="text-2xl font-bold mb-6">Edit Vehicle Damage Report</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Name *</label>
              <InputText
                name="refUserName"
                value={editFormData.refUserName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile *</label>
              <InputText
                name="refUserMobile"
                value={editFormData.refUserMobile}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <InputText
                name="refUserMail"
                value={editFormData.refUserMail}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Door Number</label>
              <InputText
                name="refDoorNumber"
                value={editFormData.refDoorNumber}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Street</label>
              <InputText
                name="refStreet"
                value={editFormData.refStreet}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <InputText
                name="refArea"
                value={editFormData.refArea}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <InputText
                name="refcountry"
                value={editFormData.refcountry}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle Model</label>
              <InputText
                name="vehicleModel"
                value={editFormData.vehicleModel}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License Plate</label>
              <InputText
                name="licensePlate"
                value={editFormData.licensePlate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Booking Reference</label>
              <InputText
                name="bookingReferenceNo"
                value={editFormData.bookingReferenceNo}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Return Mileage (KM)</label>
              <InputText
                name="returnMileage"
                value={editFormData.returnMileage}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Reading (%)</label>
              <InputText
                name="fuelReading"
                value={editFormData.fuelReading}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Damage Description</h3>
          <textarea
            name="damageDescription"
            value={editFormData.damageDescription}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe any damages to the vehicle..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Accident Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <InputText
                type="date"
                name="accidentDate"
                value={editFormData.accidentDate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <InputText
                type="time"
                name="accidentTime"
                value={editFormData.accidentTime}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Place</label>
              <InputText
                name="accidentPlace"
                value={editFormData.accidentPlace}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Other Driver Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Driver Name</label>
              <InputText
                name="otherDriverName"
                value={editFormData.otherDriverName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License No.</label>
              <InputText
                name="otherDriverLicense"
                value={editFormData.otherDriverLicense}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact No.</label>
              <InputText
                name="otherDriverContact"
                value={editFormData.otherDriverContact}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle Model</label>
              <InputText
                name="otherVehicleModel"
                value={editFormData.otherVehicleModel}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License Plate</label>
              <InputText
                name="otherLicensePlate"
                value={editFormData.otherLicensePlate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <InputText
                name="otherDriverAddress"
                value={editFormData.otherDriverAddress}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Insurance Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Owner Name & Contact</label>
              <InputText
                name="ownerNameContact"
                value={editFormData.ownerNameContact}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Insurance Company</label>
              <InputText
                name="insuranceCompany"
                value={editFormData.insuranceCompany}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Insurance Policy</label>
              <InputText
                name="insurancePolicy"
                value={editFormData.insurancePolicy}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => setShowEditDamageSidebar(false)}
            className="p-button-text"
          />
          <Button
            label="Save Changes"
            icon="pi pi-check"
            onClick={handleSubmitEdit}
            loading={submitLoading}
          />
        </div>
      </Sidebar>

      {/* Edit Inventory Report Sidebar */}
      <Sidebar
        visible={showEditInventorySidebar}
        style={{ width: "50%" }}
        onHide={() => setShowEditInventorySidebar(false)}
        position="right"
      >
        <h2 className="text-2xl font-bold mb-6">Edit Vehicle Inventory Report</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Name *</label>
              <InputText
                name="refUserName"
                value={editFormData.refUserName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile *</label>
              <InputText
                name="refUserMobile"
                value={editFormData.refUserMobile}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <InputText
                name="refUserMail"
                value={editFormData.refUserMail}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Door Number</label>
              <InputText
                name="refDoorNumber"
                value={editFormData.refDoorNumber}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Street</label>
              <InputText
                name="refStreet"
                value={editFormData.refStreet}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <InputText
                name="refArea"
                value={editFormData.refArea}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <InputText
                name="refcountry"
                value={editFormData.refcountry}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle Model</label>
              <InputText
                name="vehicleModel"
                value={editFormData.vehicleModel}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License Plate</label>
              <InputText
                name="licensePlate"
                value={editFormData.licensePlate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Booking Reference</label>
              <InputText
                name="bookingReferenceNo"
                value={editFormData.bookingReferenceNo}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Return Mileage (KM)</label>
              <InputText
                name="returnMileage"
                value={editFormData.returnMileage}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Reading (%)</label>
              <InputText
                name="fuelReading"
                value={editFormData.fuelReading}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => setShowEditInventorySidebar(false)}
            className="p-button-text"
          />
          <Button
            label="Save Changes"
            icon="pi pi-check"
            onClick={handleSubmitEdit}
            loading={submitLoading}
          />
        </div>
      </Sidebar>
    </div>
  );
};

export default UserFormDetailsTab;