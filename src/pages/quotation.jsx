import React, { useEffect, useState } from 'react';
import Papa from 'papaparse'; // CSV parsing library
import './quotation.scss';

function GetQuotation() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

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
    setLoading(true); // Set loading state before fetching
    const sheetUrl = `${baseSheetUrl}&t=${new Date().getTime()}`;
    fetch(sheetUrl)
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            setProducts(results.data);
            setLoading(false);  // Set loading to false after data is loaded
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
        defaultQuantity: storedFormData.people | "",
        date: storedFormData.date | ""
      });
    }
  }, []);

  return (
    <div className='quotation_container'>

      <button onClick={fetchData}>Get Estimates</button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product['Product Name']}</td>
                <td>{product['Price']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetQuotation;
