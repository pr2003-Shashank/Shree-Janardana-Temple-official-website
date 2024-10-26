import React, { useEffect, useState } from 'react';
import Papa from 'papaparse'; // CSV parsing library
import './quotation.scss';
import {Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Checkbox,Typography,Button,Paper,Toolbar,TablePagination,Divider,} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function GetQuotation() {
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedSweet, setSelectedSweet] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    defaultQuantity: "",
    date: ""
  });

  // Google Sheet CSV URL (published Google Sheet link)
  const baseSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuWARY0Y8KpEDf7LCiMwg1cSNht-Jp_VcPj5cFr5P6DIDVVtddyenn89OKwu7Guc3x5KIAuQa7gnIa/pub?output=csv';

  const fetchData = () => {
    const sheetUrl = `${baseSheetUrl}&t=${new Date().getTime()}`;
    fetch(sheetUrl)
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            setProducts(results.data);
          },
        });
      });
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();

    // Retrieve form data from session storage
    const storedFormData = JSON.parse(sessionStorage.getItem('formData'));

    // Check if formData exists, then update the state
    if (storedFormData) {
      setFormData({
        name: storedFormData.name || "",
        email: storedFormData.email || "",
        phone: storedFormData.phone || "",
        defaultQuantity: storedFormData.people || "",
        date: storedFormData.date || ""
      });
    }
  }, []);

  // Select or deselect all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedRows(products); // Select all rows
    } else {
      setSelectedRows([]); // Deselect all rows
    }
  };

  // Select or deselect a single row
  const handleRowClick = (row) => {
    const isSelected = selectedRows.some((selected) => selected['Product Id'] === row['Product Id']);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((selected) => selected['Product Id'] !== row['Product Id']));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  //finish selecting sweets handle
  const handleSubmit = () => {
    setSelectedSweet(true);
    sessionStorage.setItem('sweetsData',JSON.stringify(selectedRows));
    };

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Get current page products
  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // The business logic for the price calculation goes here
  const getFixedPrice = (defaultQuantity) => {
    let fixedPrice = 0;
    if (defaultQuantity < 100) {
      fixedPrice = defaultQuantity * 150;
    } else if (defaultQuantity < 500) {
      fixedPrice = defaultQuantity * 100;
    } else {
      fixedPrice = defaultQuantity * 85;
    }
    return fixedPrice;
  };

  function viewPDF() {
    // Initialize jsPDF instance
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Quotation', 105, 20, null, null, 'center');
  
    // Add user information
    doc.setFontSize(12);
    doc.text(`Name: ${formData.name}`, 20, 40);
    doc.text(`Email: ${formData.email}`, 20, 50);
    doc.text(`Phone: ${formData.phone}`, 20, 60);
  
    // Table of selected sweets
    const tableData = selectedRows.map((row, index) => [
      index + 1,
      row['Product Name'],
      row['Price'],
      formData.defaultQuantity,
      row['Price'] * formData.defaultQuantity
    ]);
  
    // Table column headers
    const headers = [["#", "Sweet Name", "Unit Price", "Quantity", "Total Price"]];
  
    // Total Cost Calculation
    const totalCost = selectedRows.reduce(
      (acc, row) => acc + row['Price'] * formData.defaultQuantity,
      0
    );
  
    // Add table to the PDF
    doc.autoTable({
      startY: 70,
      head: headers,
      body: tableData,
    });
  
    // Display total cost at the bottom
    doc.text(`Total Cost: Rs. ${totalCost}`, 20, doc.lastAutoTable.finalY + 20);
  
    // Open the PDF in a new window for preview
    const pdfDataUri = doc.output('datauristring'); // Generates a Data URI
    const pdfWindow = window.open();
    pdfWindow.document.write(
      `<iframe src="${pdfDataUri}" width="100%" height="100%" style="border: none;"></iframe>`
    );
  }

  return (
    <div className='quotation_container'>
      <Paper elevation={10} className='quotation_draft_container'>
        <div className='price_overview'>
          <Typography component='div' className='content'>
            Fixed Price for {formData.defaultQuantity} people is
          </Typography>
          <Typography component='div' className='price'>
            : Rs. {getFixedPrice(formData.defaultQuantity)}
          </Typography>
        </div>
        {selectedRows.map((row, index) => (
          <div className='price_overview' key={`${row['Product Id']}-${index}`}>
            <Typography component='div' className='content'>
              {formData.defaultQuantity} {row['Product Name']}
            </Typography>
            <Typography component='div' className='price'>
              : Rs. {row['Price'] * formData.defaultQuantity}
            </Typography>
          </div>
        ))}

        <Divider
          orientation='horizontal'
          flexItem
          className='quotation_divider'
        />

        <Button
          variant='contained'
          className='get_quotation'
          onClick={viewPDF}
          disabled={selectedSweet ? false : true}
        >
          Get Quotation
        </Button>
        {!selectedSweet && (
          <div className='sweets_table'>
            <Typography>Please select the sweets from the below list.</Typography>
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ mb: 2 }}>
                <Toolbar>
                  <Typography component="div" sx={{ flex: '1 1 50%' }}>
                    Sweets
                  </Typography>
                  {selectedRows.length > 0 && (
                    <>
                      <Typography sx={{ mr: 1 }}>
                        {selectedRows.length} selected
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        className='sweet_select'
                      >
                        Done
                      </Button>
                    </>
                  )}
                </Toolbar>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedRows.length > 0 && selectedRows.length < products.length}
                            checked={products.length > 0 && selectedRows.length === products.length}
                            onChange={handleSelectAllClick}
                          />
                        </TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Sweet Name</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedProducts.map((row) => {
                        const isSelected = selectedRows.some((selected) => selected['Product Id'] === row['Product Id']);
                        return (
                          <TableRow
                            key={row['Product Id']}
                            onClick={() => handleRowClick(row)}
                            role="checkbox"
                            aria-checked={isSelected}
                            selected={isSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isSelected}
                                onChange={() => handleRowClick(row)}
                              />
                            </TableCell>
                            <TableCell>{row['Product Id']}</TableCell>
                            <TableCell>{row['Product Name']}</TableCell>
                            <TableCell align="right">{row['Price']}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  rowsPerPageOptions={[5, 10, 25]}
                  count={products.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default GetQuotation;
