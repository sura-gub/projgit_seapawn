import React, { useState, useEffect } from 'react';
import Header from './header';
import Header1 from './header1';
import Footer from './footer';
import { FaTicket } from "react-icons/fa6";
import { LuPlusCircle } from "react-icons/lu";
import swal from 'sweetalert2';

function ApplyLoan() {

    const [articles, setArticles] = useState([]);
    const [loan, setLoan] = useState([]);
    const [contentList, setContentList] = useState([]);
    const [formData, setFormData] = useState({
        glNo: '',
        date: '',
        name: '',
        place: '',
        address: '',
        postOffice: '',
        pincode: '',
        articlesDetails: '',
        weight: '',
        amount: '',
        monthlyInterest: '',
        aadharNumber: '',
        mobileNumber: '',
        nominee: '',
        status: 'active',
        period_agree: '3',
        third_mnth_interest_per_mnth: '1.4',
        third_mnth_interest_yes_or_no: 'no',
        kootuvatti_yes_or_no: 'no',
        koottuvatti_intrest: '0',
        nomineeRelationship: '',
        cname: '',
        lnno: '',
        omob: '',
        brch_id: ''
    });


    const handleAddContent = () => {
      setContentList([...contentList, { id: contentList.length }]);
    };
  
    const handleDeleteContent = (id) => {
      const updatedContentList = contentList.filter((item) => item.id !== id);
      setContentList(updatedContentList);
    };

    useEffect(() => {
        // Check if username and password are present in session storage
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');
        const brch_id = sessionStorage.getItem('brch_id');
    
        if (!username || !password) {
            // Redirect to login.js if username or password is missing
            window.location.href = '/';
        }

        setFormData(prevFormData => ({
            ...prevFormData,
            brch_id: brch_id,
        }));
    
        // Fetch the last gl_no from the server when the component mounts
        const fetchGlNo = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-last-gl-no');
                if (!response.ok) {
                    console.error(`Error fetching last gl_no: ${response.status}`);
                    console.error(await response.text());
                    return;
                }
    
                const data = await response.json();
                const lastGlNo = data.lastGlNo || 0;
    
                // If there are no rows, set a default serial number, otherwise, extract serial number
                const serialNumber = lastGlNo === 0 ? 1 : extractSerialNumber(lastGlNo) + 1;
    
                // Create the new gl_no with the current year and serial number
                const currentYear = new Date().getFullYear().toString().slice(-4);
                const newGlNo = `${padWithZero(serialNumber)}/${currentYear}`;
    
                // Use the callback form of setFormData to ensure correct state update
                setFormData(prevFormData => ({
                    ...prevFormData,
                    glNo: newGlNo,
                }));
            } catch (error) {
                console.error('Error fetching last gl_no:', error);
            }
        };

        const fetchCompanyDetails = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-company-details');
                const result = await response.json();
        
                if (result.message === 'Company details retrieved successfully') {
                    const companyDetails = result.data;
        
                    document.getElementById('omobValue').innerText = companyDetails.omob || '';
                    document.getElementById('cmobValue').innerText = companyDetails.cmob || '';
                    document.getElementById('lnnoValue').innerText = companyDetails.lnno || '';
                    document.getElementById('cnameValue').innerText = companyDetails.cname || '';
                    document.getElementById('caddrValue').innerText = companyDetails.caddr || '';
                    // Update state with the retrieved data
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        cname: companyDetails.cname || '',
                        omob: companyDetails.omob || '',
                        lnno: companyDetails.lnno || '',
                    }));
                } else {
                    console.log('Error retrieving company details:', result.error);
                }
            } catch (error) {
                console.error('Error fetching company details:', error);
            }
        };
        
        const fetchLoan = async () => {
            try {
              const response = await fetch('http://localhost:5000/getLoan');
              if (response.ok) {
                const loanData = await response.json();
                setLoan(loanData);
              } else {
                console.error('Failed to fetch loan');
              }
            } catch (error) {
              console.error('Error fetching loan:', error);
            }
          };
    
        fetchGlNo();
        fetchCompanyDetails();
        fetchArticles();
        fetchLoan();
    }, []);
      
      const extractSerialNumber = (glNo) => {
        // Assuming glNo has a format like '01/2024' where '01' is the serial number and '2024' is the year
        return parseInt(glNo.split('/')[0], 10);
      };
      
      const padWithZero = (number) => {
        // Pad the number with zero if it's a single digit
        return number.toString().padStart(2, '0');
      };      

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNumberInput1 = (e) => {
        const { name, value } = e.target;
        const isValidInput = /^[0-9]*\.?[0-9]*$/.test(value);
    
        if (isValidInput) {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };    

    const handleSubmit = async () => {
        const articles1 = contentList.map(content => ({
            name: formData[`addjewels_${content.id}`]
          }));
    
          const articles2 = contentList.map(content => ({
            weight: formData[`weight_${content.id}`]
          }));
        
          // Include the details of the first row (if it exists)
          if (formData.articlesDetails) {
            articles1.push({
              name: formData.articlesDetails
            });
          }
    
          if (formData.weight) {
            articles2.push({
              weight: formData.weight
            });
          }
        // Combine the values from articlesDetails and weight based on index
        const combinedArticles = contentList.map(content => formData[`addjewels_${content.id}`]);
        const combinedWeights = contentList.map(content => formData[`weight_${content.id}`]);

        // Concatenate the values with the existing articlesDetails and weight
        formData.articlesDetails += ', ' + combinedArticles.join(', ');
        const totalWeight = combinedWeights.reduce((total, weight) => total + parseFloat(weight), 0);
        formData.weight = (parseFloat(formData.weight) + totalWeight).toFixed(2);

        const requiredFields = ['date', 'name', 'place', 'address', 'postOffice', 'pincode', 'articlesDetails', 'weight', 'amount', 'monthlyInterest', 'aadharNumber', 'mobileNumber', 'nominee', 'nomineeRelationship'];
        const isAnyFieldEmpty = requiredFields.some(field => !formData[field]);
    
        if (isAnyFieldEmpty) {
            swal.fire({
                title: 'Warning!',
                text: 'Enter all the values',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return; // Stop further execution if any field is empty
        }
        try {
            // Log the formData before making the API call
            console.log('Submitting loan application with data:', formData);
    
            // Make an API call to submit the loan application
            const response = await fetch('http://localhost:5000/submit-loan-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                // Handle the case where the server returns an error
                console.error(`Error submitting loan application: ${response.status}`);
                // Log the response text
                console.error(await response.text());
                return;
            }
    
            const data = await response.json();
            console.log(data.message);
            swal.fire({
                title: 'Success!',
                text: data.message, // Assuming the server sends a 'message' field in the response
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Reload the page
                window.location.reload();
            });
            // TODO: Handle success, show a success message, redirect, etc.
    
        } catch (error) {
            console.error('Error submitting loan application:', error);
            // TODO: Handle error, you can throw an error, show a message, etc.
        }
    };

    const fetchArticles = async () => {
        try {
          const response = await fetch('http://localhost:5000/getArticles');
          if (response.ok) {
            const articlesData = await response.json();
            setArticles(articlesData);
          } else {
            console.error('Failed to fetch articles');
          }
        } catch (error) {
          console.error('Error fetching articles:', error);
        }
      };

      // Function to convert a numeric amount to words
        function convertAmountToWords(amount) {
            const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            function convertLessThanOneThousand(number) {
                let result = '';

                if (number % 100 < 10) {
                    result += units[number % 100];
                } else if (number % 100 < 20) {
                    result += teens[number % 10 - 1];
                } else {
                    result += tens[Math.floor((number % 100) / 10)];
                    result += (number % 10 !== 0) ? `-${units[number % 10]}` : '';
                }

                return result;
            }

            function convert(number) {
                if (number === 0) return 'Zero';

                let result = '';

                if (number < 0) {
                    result += 'Negative ';
                    number = Math.abs(number);
                }

                if (number < 1000) {
                    result += convertLessThanOneThousand(number);
                } else {
                    result += convertLessThanOneThousand(Math.floor(number / 1000)) + ' Thousand';
                    if (number % 1000 !== 0) {
                        result += ' ' + convertLessThanOneThousand(number % 1000);
                    }
                }

                return result;
            }

            return convert(amount);
        }

        const [searchMode, setSearchMode] = useState('');
        const [searchOptions, setSearchOptions] = useState([]);
    
        useEffect(() => {
            // Fetch search options based on search mode
            const fetchSearchOptions = async () => {
                try {
                    if (searchMode === 'mob' || searchMode === 'glno' || searchMode === 'name') {
                        const response = await fetch(`http://localhost:5000/get-search-options?mode=${searchMode}`);
                        if (response.ok) {
                            const optionsData = await response.json();
                            setSearchOptions(optionsData.options);
                        } else {
                            console.error('Failed to fetch search options');
                        }
                    }
                } catch (error) {
                    console.error('Error fetching search options:', error);
                }
            };
    
            fetchSearchOptions();
        }, [searchMode]);
    
        const handleSearchModeChange = (e) => {
            setSearchMode(e.target.value);
        };

        const handleSearchButtonClick = () => {
            fetchLoanBySearch();
        };

        const [selectedSearchOption, setSelectedSearchOption] = useState([]);

        const fetchLoanBySearch = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getLoanBySearch?mode=${searchMode}&value=${selectedSearchOption}`);
                if (response.ok) {
                    const loanData = await response.json();
                    setLoan(loanData);
                } else {
                    console.error('Failed to fetch loan by search');
                }
            } catch (error) {
                console.error('Error fetching loan by search:', error);
            }
        };

    return (
        <div className='bghome'>
            <Header />
            <Header1 />
                <div style={{zoom: 0.8}}>
                    <div className='col-md-12 title'>
                        <FaTicket className='mb-1' /> NEW JEWEL LOAN ENTRY
                    </div>
                    <div className='col-md-12 d-flex' style={{zoom: 0.9}}>
                        <div className='col-md-5 m-5 bg-light'>
                            <div className='col-md-12 d-flex'>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>GL.No</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.glNo} readOnly />
                                    <input type='hidden' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.cname} readOnly />
                                    <input type='hidden' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.lnno} readOnly />
                                    <input type='hidden' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.omob} readOnly />
                                    <input type='hidden' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.brch_id} readOnly />
                                </div>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Date</b></label><br />
                                    <input type='date' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.date} onChange={(e) => handleInputChange({ target: { name: 'date', value: e.target.value } })}/>
                                </div>
                            </div>
                            <div className='col-md-12 d-flex'>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Name</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.name} onChange={(e) => handleInputChange({ target: { name: 'name', value: e.target.value } })}/>
                                </div>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Place</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.place} onChange={(e) => handleInputChange({ target: { name: 'place', value: e.target.value } })}/>
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <label><b style={{fontWeight: '600'}}>Address of the Pawner</b></label><br />
                                <textarea style={{margin: '5px 5px', width: '95%', padding: '6px'}} value={formData.address} onChange={(e) => handleInputChange({ target: { name: 'address', value: e.target.value } })}></textarea>
                            </div>
                            <div className='col-md-12 d-flex mb-2'>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Post Office</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.postOffice} onChange={(e) => handleInputChange({ target: { name: 'postOffice', value: e.target.value } })}/>
                                </div>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Pincode</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.pincode} onChange={(e) => handleNumberInput1({ target: { name: 'pincode', value: e.target.value } })}/>
                                </div>                                
                            </div>
                            <div className='col-md-12 d-flex article ms-1' style={{width: '95%'}}>
                                <div className='col-md-6 ms-2'>
                                    <label><b style={{fontWeight: '600'}}>Details of Articles</b></label><br />
                                    <select style={{ margin: '5px 5px', width: '90%', padding: '6px' }} onChange={(e) => handleInputChange({ target: { name: 'articlesDetails', value: e.target.value } })}>
                                        <option selected disabled>-- Select Article --</option>
                                        {articles.map((article) => (
                                        <option key={article.id} value={article.nm}>{article.nm}</option>))}
                                    </select>
                                </div>
                                <div className='col-md-5 ms-1'>
                                    <label><b style={{fontWeight: '600'}}>Weight</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.weight} onChange={(e) => handleNumberInput1({ target: { name: 'weight', value: e.target.value } })}/>
                                </div>
                                <div className='col-md-1 text-center mt-4'>
                                    <LuPlusCircle size={30} className='me-5' onClick={handleAddContent} />
                                </div>
                            </div>
                            {contentList.map((formData) => (
                                <div key={formData.id} className='col-md-12 d-flex article ms-1 my-2' style={{ width: '95%' }}>
                                    <div className='col-md-6 ms-2'>
                                        <label><b style={{fontWeight: '600'}}>Details of Articles</b></label><br />
                                        <select style={{ margin: '5px 5px', width: '90%', padding: '6px' }} name={`addjewels_${formData.id}`} value={formData[`addjewels_${formData.id}`]} onChange={handleInputChange} >
                                            <option selected disabled>
                                                -- Select Article --
                                            </option>
                                            {articles.map((article) => (
                                                <option key={article.id} value={article.nm}>
                                                    {article.nm}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-md-5 ms-1'>
                                        <label><b style={{fontWeight: '600'}}>Weight</b></label><br />
                                        <input type='text' style={{ margin: '5px 5px', width: '90%', padding: '6px' }} name={`weight_${formData.id}`} value={formData[`weight_${formData.id}`]} onChange={handleNumberInput1} />
                                    </div>
                                    <div className='col-md-1 text-center mt-3' style={{verticalAlign: 'middle'}}>
                                        {/* Button to hide the copied fields */}
                                        <button className='btn btn-danger me-5' onClick={() => handleDeleteContent(formData.id)}>&times;</button>
                                    </div>
                                </div>
                            ))}
                            <div className='col-md-12 d-flex'>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Amount</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.amount} onChange={(e) => handleNumberInput1({ target: { name: 'amount', value: e.target.value } })}/>
                                </div>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Monthly Interest%</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.monthlyInterest} onChange={(e) => handleNumberInput1({ target: { name: 'monthlyInterest', value: e.target.value } })}/>
                                </div>
                            </div>
                            <div className='col-md-12 d-flex'>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Aadhar Number</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.aadharNumber} onChange={(e) => handleNumberInput1({ target: { name: 'aadharNumber', value: e.target.value } })}/>
                                </div>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Mobile Number</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.mobileNumber} onChange={(e) => handleNumberInput1({ target: { name: 'mobileNumber', value: e.target.value } })}/>
                                </div>
                            </div>
                            <div className='col-md-12 d-flex'>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Nominee</b></label><br />
                                    <input type='text' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={formData.nominee} onChange={(e) => handleInputChange({ target: { name: 'nominee', value: e.target.value } })}/>
                                </div>
                                <div className='col-md-6'>
                                    <label><b style={{fontWeight: '600'}}>Nominee's Relationship</b></label><br />
                                    <select style={{ margin: '5px 5px', width: '90%', padding: '6px' }}value={formData.nomineeRelationship} onChange={(e) => handleInputChange({ target: { name: 'nomineeRelationship', value: e.target.value } })}>
                                        <option value="" disabled> -- Nominee's Relationship --</option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Wife">Wife</option>
                                        <option value="Husband">Husband</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Elder Brother">Elder Brother</option>
                                        <option value="Elder Sister">Elder Sister</option>
                                        <option value="Younger Brother">Younger Brother</option>
                                        <option value="Younger Sister">Younger Sister</option>
                                        <option value="Friend">Friend</option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-md-12 text-center mt-3'>
                                <button className='btn btn-success' onClick={handleSubmit}>Set Now</button>
                            </div>                                                        
                        </div>
                        <div className='col-md-6 my-3 mx-5'>
                            <h3 style={{marginLeft: '40%'}}>
                                Last Entry
                            </h3>
                            <div className='col-md-12 d-flex'>
                                <div className='col-md-4 text-center'>
                                    <label><b style={{fontWeight: '700'}}>Advance Search Mode</b></label><br />
                                    <select style={{ margin: '5px 5px', width: '90%', padding: '8px' }} value={searchMode} onChange={handleSearchModeChange} >
                                        <option value='' disabled>-- select --</option>
                                        <option value='mob'>Mobile Number</option>
                                        <option value='glno'>Gl. Number</option>
                                        <option value='name'>Name</option>
                                    </select>
                                </div>
                                <div className='col-md-4 text-center' style={{ marginTop: '2.5%' }}>
                                    <input list='searchOptions' style={{ margin: '5px 5px', width: '90%', padding: '6px' }} onChange={(e) => setSelectedSearchOption(e.target.value)} className='inputstyle' />
                                    <datalist id='searchOptions'>
                                        {searchOptions.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </datalist>
                                </div>
                                <div className='col-md-4 text-center' style={{ marginTop: '2.5%' }}>
                                    <button className='btn btn-primary' onClick={handleSearchButtonClick}>
                                        SEARCH
                                    </button>
                                </div>
                            </div>
                            <div className='col-md-11' style={{fontSize: '18px'}}>
                                <table className='table table-bordered bg-light border-gray text-center m-3'>
                                    <tbody>
                                        <tr>
                                            <td style={{backgroundColor: '#fff0', fontWeight: '400'}}>
                                                <b>L.N.TN-</b><span id="lnnoValue"></span>
                                            </td>
                                            <td style={{backgroundColor: '#fff0', fontWeight: '400'}}>
                                                <b>Off : </b><span id="omobValue"></span><br />
                                                <b>Mob : </b><span id="cmobValue"></span></td>
                                        </tr>
                                        <tr>
                                            <td style={{backgroundColor: '#fff0', fontWeight: '400'}} colSpan='2'>
                                                <b><span id="cnameValue"></span></b><br />
                                                <span id="caddrValue"></span>
                                            </td>
                                        </tr>
                                        <tr>
                                            {loan.map((Loan, index) => {
                                                const date = new Date(Loan.dt);
                                                const dateString = date.toLocaleDateString('en-GB'); // Adjust the locale as needed

                                                return (
                                                    <React.Fragment key={index}>
                                                        <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400', verticalAlign: 'middle' }}>
                                                            <b>Name : </b>{Loan.nm} <span style={{ color: 'green', fontWeight: '700' }}>- {Loan.status.charAt(0).toUpperCase() + Loan.status.slice(1).toLowerCase()}</span>
                                                        </td>
                                                        <td key={`date_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                                            <b>Date : </b>{dateString}<br />
                                                            <b>Gl.No : </b>{Loan.gl_no}
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                        {loan.map((Loan, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                                        <b>Mobile : </b>{Loan.cust_mob}
                                                    </td>
                                                    <td key={`date_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                                        <b>Place : </b>{Loan.place}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        </tr>
                                        <tr>
                                        {loan.map((Loan, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }} colSpan='2' className='text-start'>
                                                        <b>Address of Pawner : </b>{Loan.addr}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        </tr>
                                        <tr>
                                        {loan.map((Loan, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }} colSpan='2' className='text-start'>
                                                        <b>Amount : </b> 
                                                        <span style={{color: 'red', fontWeight: 'bolder'}}>
                                                            {Loan.amt} ({convertAmountToWords(Loan.amt)} Only /-)
                                                        </span>
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        </tr>
                                        <tr>
                                        {loan.map((Loan, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }} colSpan='2' className='text-start'>
                                                        <b>Details of Articles : </b> 
                                                        <span style={{color: 'red', fontWeight: 'bolder'}}>
                                                            {Loan.article}
                                                        </span>
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        </tr>
                                        <tr>
                                        {loan.map((Loan, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }} colSpan='2' className='text-start'>
                                                        <b>Weight : </b> 
                                                        <span style={{color: 'red', fontWeight: 'bolder'}}>
                                                            {Loan.weight} gm
                                                        </span>
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        </tr>
                                        <tr>
                                        {loan.map((Loan, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }} colSpan='2' className='text-start'>
                                                        <b>Approximate value : </b> 
                                                        <span style={{color: 'red', fontWeight: 'bolder'}}>
                                                            {Loan.aprox_value}
                                                        </span>
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                        </tr>
                                        <tr>
                                            <td className='text-start' style={{ backgroundColor: '#fff0',fontSize: '17px' }}>
                                                <b>(P.T.O)</b>
                                            </td>
                                            <td className='text-start' style={{ backgroundColor: '#fff0',fontSize: '17px' }}>
                                                <b>Manager</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <center><span style={{fontSize: '30px'}}>Calculation</span></center>
                            <div className='col-md-11' style={{fontSize: '18px'}}>
                                <table className='table table-bordered bg-light border-gray text-center m-3'>
                                    <tbody>
                                        <tr>
                                            {loan.map((Loan, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '400' }} colSpan='2' className='text-center'>
                                                            <b>Amount : </b> 
                                                            <span style={{color: 'blue', fontWeight: 'bolder'}}>
                                                                Rs. {Loan.amt}
                                                            </span>&nbsp;&nbsp;
                                                            <b>Interest : </b> 
                                                            <span style={{color: 'blue', fontWeight: 'bolder'}}>
                                                                {Loan.pawn_intrest}%
                                                            </span>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#fff0', fontWeight: '400', fontSize: '18px' }} className='text-start'>
                                                <b>Time Period</b>
                                            </th>
                                            <th style={{ backgroundColor: '#fff0', fontWeight: '400', fontSize: '18px' }} className='text-start'>
                                                <b>Total Amount</b>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#fff0', fontWeight: 'bolder', fontSize: '18px' }} className='text-start'>
                                                1 year
                                            </td>
                                            {loan.map((Loan, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '600' }} className='text-start'> 
                                                            <span>
                                                                {Loan.one_yr_amt}
                                                            </span>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#fff0', fontWeight: 'bolder', fontSize: '18px' }} className='text-start'>
                                                1 month
                                            </td>
                                            {loan.map((Loan, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '600' }} className='text-start'> 
                                                            <span>
                                                                {Loan.one_mnth_amt}
                                                            </span>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#fff0', fontWeight: 'bolder', fontSize: '18px' }} className='text-start'>
                                                1 day
                                            </td>
                                            {loan.map((Loan, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '600' }} className='text-start'> 
                                                            <span>
                                                                {Loan.one_day_amt}
                                                            </span>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#fff0', fontWeight: 'bolder', fontSize: '18px' }} className='text-start'>
                                                Min - 15 day
                                            </td>
                                            {loan.map((Loan, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <td key={`name_${index}`} style={{ backgroundColor: '#fff0', fontWeight: '600' }} className='text-start'> 
                                                            <span>
                                                                {Loan.seven_day_amt}
                                                            </span>
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer />
        </div>
    );
}

export default ApplyLoan;