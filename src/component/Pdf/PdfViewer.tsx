import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

// ✅ Define props type
interface PdfViewerProps {
  pdfUrl: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="card flex justify-content-center">
      <Button
        // label="View Agreement"
        icon="pi pi-eye"
        className="p-button-text text-[#5481ff] hover:text-[#385289]"
        onClick={() => (console.log("PDF URL:", pdfUrl), setVisible(true))}
      />
      <Dialog
        header="Agreement PDF"
        visible={visible}
        style={{ width: "80vw", height: "80vh" }}
        onHide={() => setVisible(false)}
        maximizable
        modal
      >
        <iframe
                    src={pdfUrl}
                    title="PDF Agreement"
                    width="100%"
                    height="600px"
                    style={{ border: 'none' }}
                />
      </Dialog>
    </div>
  );
};

export default PdfViewer;
