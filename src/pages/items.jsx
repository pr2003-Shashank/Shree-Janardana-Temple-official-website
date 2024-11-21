import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Papa from 'papaparse'; // CSV parsing library
import './items.scss';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf"; // PDF creation library
import autoTable from "jspdf-autotable";// For Tables in PDF
import logoImage from "../assets/images/Janardana.jpeg";

function ItemSelector() {
  const [steps, setSteps] = useState([]);
  const [items, setItems] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    people: "",
    date: "",
  });
  const navigate = useNavigate();

  // Google Sheet CSV URL
  const baseSheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuWARY0Y8KpEDf7LCiMwg1cSNht-Jp_VcPj5cFr5P6DIDVVtddyenn89OKwu7Guc3x5KIAuQa7gnIa/pub?gid=0&single=true&output=csv';

  const fetchData = () => {
    const sheetUrl = `${baseSheetUrl}&t=${new Date().getTime()}`;
    fetch(sheetUrl)
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {

            // Group data by category
            const data = results.data.map((item, index) => ({
              id: index + 1, // Unique ID for DataGrid
              itemName: item['Item Name'],
              category: item['Category'],
              price: item['Price'],
            }));

            setItems(results.data);

            const groupedData = data.reduce((acc, item) => {
              const category = item.category || 'Uncategorized';
              if (!acc[category]) acc[category] = [];
              acc[category].push(item);
              return acc;
            }, {});

            // Create steps dynamically
            const dynamicSteps = Object.keys(groupedData).map((category) => ({
              label: category,
              rows: groupedData[category],
            }));

            setSteps(dynamicSteps);
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
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
  }, []);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    // sessionStorage.setItem('selectedItems',JSON.stringify(selecteditems));
    generatePDF();
    navigate('/quotation');
  };

  // Generate PDF and update the state
  function generatePDF() {
    const doc = new jsPDF();

    // Add an image to the PDF
    doc.addImage(logoImage, "JPEG", 20, 0, 25, 35);

    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold"); // Set font family and style
    doc.text("Aryadi Shree Janardana Temple Pangala", 105, 20, null, null, "center");

    // Add user information
    doc.setFontSize(12);
    doc.text("To,", 20, 50);
    doc.text(formData.name || "N/A", 20, 55);
    doc.text(formData.email || "N/A", 20, 60);
    doc.text(formData.phone || "N/A", 20, 65);

    //Items selected
    const selectedItems = rowSelectionModel.map((select) => items[select - 1]);

    // Prepare table data
    const tableData = selectedItems.map((item, index) => [
      index + 1, // Serial Number
      item["Item Name"] || "N/A", // Item Name
      item["Category"] || "N/A"
    ]);

    // Add the table using autoTable
    autoTable(doc, {
      startY: 75, // Start position below the title
      head: [["#", "Item Name", "Category"]],
      body: tableData,
      headStyles: {
        fillColor: '#970747', // Header background color (RGB: Blue)
        textColor: [255, 255, 255], // Header text color (White)
      },
      bodyStyles: {
        textColor: [0, 0, 0], // Body text color (Black)
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Alternate row background color (Light Gray)
      }
    });

    const signatureStartY = doc.previousAutoTable.finalY + 20; // Start 20 units below the table

    // Manager's signature
    doc.setFontSize(12);
    doc.text("Manager's Signature", 30, signatureStartY);
    doc.line(20, signatureStartY + 10, 80, signatureStartY + 10); // Horizontal line

    // Customer's signature
    doc.text("Customer's Signature", 120, signatureStartY);
    doc.line(110, signatureStartY + 10, 175, signatureStartY + 10); // Horizontal line


    // Generate PDF Data URI
    // const pdfDataUri = doc.output('datauristring'); // Generates a Data URI

    //Convert pdf to blob
    const pdfBlob = new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
    const reader = new FileReader();
    reader.onloadend = () => {
      sessionStorage.setItem('pdfBlob', reader.result);
    };
    reader.readAsDataURL(pdfBlob);

  }


  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className='items_container'>
      <Paper elevation={10} className='items_selector_container'>
        <Box>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={step.rows}
                      columns={[
                        { field: 'id', headerName: 'ID', width: 60 },
                        { field: 'itemName', headerName: 'Item Name', width: 200 }
                      ]}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection
                      onRowSelectionModelChange={(selectedIds) =>
                        setRowSelectionModel(selectedIds)
                      }
                      rowSelectionModel={rowSelectionModel}
                      sx={{ border: 0 }}
                    />
                  </Paper>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      className='btn1'
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                    <Button
                      className='btn2'
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Prev
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {steps.length !== 0 ? (
            activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>If you have completed, click on done</Typography>
                <Button style={{ color: "#970747" }} onClick={handleSubmit} sx={{ mt: 1, mr: 1 }}>
                  Done
                </Button>
              </Paper>
            )
          ) : (<div className='loading' ><CircularProgress color='#970747' /></div>)}
        </Box>
      </Paper>
    </div>
  );
}

export default ItemSelector;
