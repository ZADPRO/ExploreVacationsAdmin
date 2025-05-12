import { Dialog } from "primereact/dialog";
import  { useState } from "react";
import { FaEye } from "react-icons/fa";
// import {
//   PDFViewer,
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from "@react-pdf/renderer";

const viewPDFAction = () => {
  const [viewPdf, setViewPdf] = useState(false);
 
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // const handleViewPDF = (rowData: any) => {
  //   const pdfPath = rowData?.refAgreementPath ? JSON.parse(rowData.refAgreementPath) : null;

  //   if (!pdfPath) {
  //     alert("No agreement available.");
  //     return;
  //   }

  //   // Assuming the path is an array and we're dealing with the first element
  //   setPdfUrl(pdfPath[0]);
  //   setViewPdf(true); // Open the dialog to view PDF
  // };

  const handleViewPDF = () => {
    // Static path for testing
    const staticPdfPath = "D:\soniya resume.pdf";

    // Check if the path is valid
    if (!staticPdfPath) {
      alert("No agreement available.");
      return;
    }

    setPdfUrl(staticPdfPath);  // Set the static PDF path
    setViewPdf(true); // Open the dialog to view PDF
  };

  const onHideDialog = () => {
    setViewPdf(false);  // Close the dialog
    setPdfUrl(null);     // Reset the PDF URL
  };
  
  return (
    <>
      <Dialog
        header="Header"
        visible={viewPdf}
        style={{ width: "50vw" }}
       
        onHide={() => {
          if (!viewPdf) return;
          setViewPdf(false);
          onHideDialog();
        }}
      >
        {pdfUrl && (
          <iframe
          src={`file:///${pdfUrl}`} 
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}
      </Dialog>
      <button
        onClick={handleViewPDF} title="View PDF"
      >
        <FaEye style={{ color: "#007bff", cursor: "pointer" }} />
      </button>
    </>
  );
};

export default viewPDFAction;
