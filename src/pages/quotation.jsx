import React, { useEffect, useState } from "react";
import { Button, Box, Paper, Typography } from "@mui/material";
import './quotation.scss';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
// Import the main component
import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

function Quotation() {
  const navigate = useNavigate();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfUrl, setPdfUrl] = useState(); // State to store the PDF URL
  const [isLoading,setIsLoading] = useState(false);
  const getDefaultScale = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth > 1024) return 0.75; // Desktop
    if (screenWidth > 768) return 0.65; // Tablet
    if (screenWidth > 356) return 0.55;
    return 0.45; // Small screens
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    people: "",
    date: "",
  });

  const fetchPdfBlob = async () => {
    const pdfDataUrl = sessionStorage.getItem('pdfBlob');
    if (pdfDataUrl) {
      try {
        const response = await fetch(pdfDataUrl);
        const pdfBlob = await response.blob();
        setPdfUrl(URL.createObjectURL(pdfBlob));
      } catch (error) {
        console.error("Error fetching blob from sessionStorage:", error);
      }
    }
  };
  // Fetch stored form data from session storage
  useEffect(() => {
    const storedFormData = sessionStorage.getItem("formData");
    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData);
      setFormData({
        name: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        people: parsedData.people || "",
        date: parsedData.date || "",
      });
    }
    fetchPdfBlob();

  }, []);

  const handleSubmit = async () => {
    try {
      const pdfDataUrl = sessionStorage.getItem("pdfBlob");
      const storedFormData = sessionStorage.getItem("formData");
      const formData = storedFormData ? JSON.parse(storedFormData) : {};

      if (!pdfDataUrl || !formData) {
        alert("Form data or PDF is missing!");
        return;
      }

      // Convert Data URL to Base64 String
      const base64Pdf = pdfDataUrl.split(",")[1];

      // Prepare the payload
      const payload = {
        ...formData,
        pdfBlob: base64Pdf, // Attach the Base64 PDF blob
      };

      // Send the data to Apps Script
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxVHBBLROyB2xY7huaNcy51r7tIYr02KTMgtUqrqwWigZWhhM33eeTjPpmI5JBkh33C/exec", // Apps Script Deployment ID
        {
          method: "POST",
          // headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        setIsLoading(false);
        sessionStorage.clear();
        navigate('/quotation');
      } else {
        alert(`Failed booking your function: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting data.");
    }
  };

  return (
    <div className="quotation_container">
      {sessionStorage.length !== 0 ? (
        pdfUrl ? (
          <>
            <div className="pdf_preview">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <div className="pdf_viewer">
                  <Viewer
                    plugins={[defaultLayoutPluginInstance]}
                    fileUrl={pdfUrl}
                    defaultScale={getDefaultScale} // Set default zoom level to fit content
                  />
                </div>
              </Worker>
            </div>
            <div className="quotation_actions">
              <Button
                className="download_btn"
                variant="contained"
                sx={{ m: 1 }}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = sessionStorage.getItem('pdfBlob');
                  link.download = "Quotation.pdf";
                  link.click();
                }}
              >
                Download Quotation
              </Button>
              <Typography><span>{formData.name}</span>, please verify the quotation generated. If you have verified then click on confirm to book your function on <span>{formData.date}</span>.</Typography>
              <Button
                className="confirm_btn"
                variant="contained"
                sx={{ m: 1 }}
                onClick={(e)=>{
                  setIsLoading(true);
                  handleSubmit()
                }}
              >
                {isLoading ? <CircularProgress color='#970747' /> : 'Confirm Booking'}
              </Button>
            </div>
          </>
        ) : (
          <div className="loading">
            <CircularProgress color='#970747' />
          </div>)

      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
              m: 1,
              width: 575,
            },
          }}
        >
          <Paper
            elevation={10}
            className="submit"
          >
            <Typography>
              Your booking is confirmed. Thank you!!!1
            </Typography>
            <Button
              variant="contained"
              onClick={(e) =>
                navigate('/home')
              }
            >
              Back to Home
            </Button>
          </Paper>
        </Box>
      )}
    </div>
  );
}

export default Quotation;
