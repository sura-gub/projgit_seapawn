import React, { useEffect, useState, useRef } from 'react';
import Header from './header';
import Header1 from './header1';
import Footer from './footer';
import { FaUser, FaRegEdit } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { MdDelete, MdPayment } from "react-icons/md";
import swal from 'sweetalert2';
import Popup from './Popup'; // Import the popup component

function AllCust() {
    const [loan, setLoan] = useState([]);
    const [loans, setLoans] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [showPopup3, setShowPopup3] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [kootuvatti, setKootuvatti] = useState('');
    const [kootuvattiInt, setKootuvattiInt] = useState('');
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [amount, setAmount] = useState('');
    const [interest, setInterest] = useState('');
    const [periodAgree, setPeriodAgree] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Adjust as needed
    const [searchQuery, setSearchQuery] = useState('');
    const [artt, setArtt] = useState([]);

    const handleUpdate = () => {
        // Assuming you have an API endpoint `/updateLoanData` to update loan data
        fetch('http://localhost:5000/updateLoanData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: loans.id, // Assuming `loans.id` contains the ID of the loan to be updated
                name: name,
                place: place,
                amount: amount,
                interest: interest,
                periodAgree: periodAgree
            })
        })
        .then(response => {
            if (response.ok) {
                // Handle success response
                console.log('Loan data updated successfully');
                swal.fire({
                    title: 'Success!',
                    text: 'Loan data updated successfully', // Assuming the server sends a 'message' field in the response
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Reload the page
                    window.location.reload();
                });
            } else {
                // Handle error response
                console.error('Failed to update loan data');
            }
        })
        .catch(error => {
            console.error('Error updating loan data:', error);
        });
        setShowPopup2(false);
    };
    
    useEffect(() => {
        // Check if username and password are present in session storage
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');

        if (!username || !password) {
            // Redirect to login.js if username or password is missing
            window.location.href = '/login';
        }

        const fetchLoan = async () => {
            try {
              const response = await fetch('http://localhost:5000/getLoansss');
              if (response.ok) {
                const loanData = await response.json();
                setLoan(loanData);
                // console.log(loanData);
              } else {
                console.error('Failed to fetch loan');
              }
            } catch (error) {
              console.error('Error fetching loan:', error);
            }
          };

        fetchLoan();
    }, []);

    const fetchLoans = async (id) => {
        try {
            const response = await fetch('http://localhost:5000/getLoanById/' + id);
            if (response.ok) {
                const loanData = await response.json();
                setKootuvatti(loanData.kootuvatti_yes_or_no); // Populate select box with fetched data
                setKootuvattiInt(loanData.koottuvatti_intrest); // Populate input field with fetched data
            } else {
                console.error('Failed to fetch loan by ID');
            }
        } catch (error) {
            console.error('Error fetching loan by ID:', error);
        }
    };

    const handleEditClick = (id) => {
        const storedPassword = sessionStorage.getItem('password');
        const enteredPassword = prompt('Enter your password:');

        if (enteredPassword === storedPassword) {
            setSelectedId(id); // Set the selected ID for fetching specific loan data
            fetchLoans(id); // Pass the selected ID to fetchLoans
            setShowPopup(true); // Show the popup
        } else {
            alert('Incorrect password!');
        }
    };

    const handleEditClick1 = (id) => {
        setSelectedId(id); // Set the selected ID for fetching specific loan data
        fetchLoanBySearch(id); // Pass the selected ID to fetchLoans
        fetchCompanyDetails();
        setShowPopup1(true);
        setShowDetails(true);
    };

    const handleEditClick4 = (id) => {
        const storedPassword = sessionStorage.getItem('password');
        const enteredPassword = prompt('Enter your password:');

        if (enteredPassword === storedPassword) {
            setSelectedId(id); // Set the selected ID for fetching specific loan data
            handleActionOptionClick(id);
        } else {
            alert('Incorrect password!');
        }
    };

    const handleEditClick3 = (id) => {
        const storedPassword = sessionStorage.getItem('password');
        const enteredPassword = prompt('Enter your password:');

        if (enteredPassword === storedPassword) {
            setSelectedId(id); // Set the selected ID for fetching specific loan data
            fetchLoanBySearch(id); // Pass the selected ID to fetchLoans
            setShowPopup2(true); // Show the popup
            setShowDetails(true);
        } else {
            alert('Incorrect password!');
        }
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setShowPopup1(false);
        setShowPopup2(false);
        setShowPopup3(false);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/updateLoan/${selectedId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ kootuvatti, kootuvattiInt })
            });
            if (response.ok) {
                console.log('Loan updated successfully');
                swal.fire({
                    title: 'Success!',
                    text: 'Loan updated successfully', // Assuming the server sends a 'message' field in the response
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Reload the page
                    window.location.reload();
                });
                // TODO: Handle success, show a success message, redirect, etc.
                // You can update the state or perform any other actions upon successful update
            } else {
                console.error('Failed to update loan');
            }
        } catch (error) {
            console.error('Error updating loan:', error);
        }
    };

    const fetchLoanBySearch = async (id) => {
        try {
            const response = await fetch('http://localhost:5000/getLoanBySearches/' + id);
            if (response.ok) {
                const loanData = await response.json();
                // Format date before setting the state
                const formattedLoanData = {
                    ...loanData,
                    dt: new Date(loanData.dt).toLocaleDateString('en-GB'), // Adjust the locale as needed
                    third_mnth_start_dt: new Date(loanData.third_mnth_start_dt).toLocaleDateString('en-GB')
                };
                setName(formattedLoanData.nm);
                setPlace(formattedLoanData.place);
                setAmount(formattedLoanData.amt);
                setInterest(formattedLoanData.pawn_intrest);
                setPeriodAgree(formattedLoanData.period_agree);
                setLoans(formattedLoanData);
            } else {
                console.error('Failed to fetch loan by search');
            }
        } catch (error) {
            console.error('Error fetching loan by search:', error);
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

            } else {
                console.log('Error retrieving company details:', result.error);
            }
        } catch (error) {
            console.error('Error fetching company details:', error);
        }
    };

    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (popupRef.current && !popupRef.current.contains(event.target)) {
            setShowPopup(false);
            setShowPopup2(false);
            setShowPopup3(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [popupRef]);

      // Function to handle loan deletion
const handleDeleteLoan = async (id) => {
    try {
      const response = await fetch('http://localhost:5000/deleteLoan/' + id, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        swal.fire({
          title: 'Deleted!',
          text: 'Loan Entry has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Reload the page
          window.location.reload();
        });
      } else {
        console.error('Failed to delete loan entry');
      }
    } catch (error) {
      console.error('Error deleting loan entry:', error);
    }
  };
  
  // Function to handle edit/delete option click
  const handleActionOptionClick = (id) => {
  
      swal.fire({
        title: 'Delete Confirmation',
        text: 'Are you sure you want to delete this staff?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Call the function to handle staff deletion
          handleDeleteLoan(id);
        } else {
          // Reset the selected staff
          setSelectedId(null);
          window.location.reload();        
        }
      });
  };
  
    // Logic to get current items based on currentPage and searchQuery
    const filteredItems = loan.filter(item => {
        return (
            item.gl_no.includes(searchQuery) ||
            item.nm.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.place.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Logic to render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(loan.length / itemsPerPage); i++) {
      pageNumbers.push(i);
  }

    // Function to handle page change
    const handleClick = (event, pageNumber) => {
        event.preventDefault();
        setCurrentPage(pageNumber);
    };

    // Function to handle search input change
    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const handleEditClick5 = (id) => {
        const storedPassword = sessionStorage.getItem('password');
        const enteredPassword = prompt('Enter your password:');

        if (enteredPassword === storedPassword) {
            setSelectedId(id); // Set the selected ID for fetching specific loan data
            fetchArtBySearch(id); // Pass the selected ID to fetchLoans
            setShowPopup3(true); // Show the popup
        } else {
            alert('Incorrect password!');
        }
    };

    const fetchArtBySearch = async (id) => {
        try {
            const response = await fetch('http://localhost:5000/getLoanBySearchess/' + id);
            if (response.ok) {
                const loanData = await response.json();
                setArtt(loanData); // Set the fetched loan data directly
                setShowPopup3(true); // Show the popup
            } else {
                console.error('Failed to fetch loan by search');
            }
        } catch (error) {
            console.error('Error fetching loan by search:', error);
        }
    };   

    const handleArticleChange = (e, index) => {
        const { value } = e.target;
        const updatedArtt = [...artt]; // Create a copy of the current state
        updatedArtt[index] = { ...updatedArtt[index], arti: value }; // Update the article for the specific loan object
        setArtt(updatedArtt); // Update the state with the modified array
        console.log(updatedArtt);
    };
    
    const handleWeightChange = (e, index) => {
        const { value } = e.target;
        const updatedArtt = [...artt]; // Create a copy of the current state
        updatedArtt[index] = { ...updatedArtt[index], grm: value }; // Update the weight for the specific loan object
        setArtt(updatedArtt); // Update the state with the modified array
        console.log(updatedArtt);
    };    

    const handleUpdate1 = async () => {
        try {
            // Assuming artt contains the updated loan data
            const response = await fetch('http://localhost:5000/updateArtData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(artt),
            });
            if (response.ok) {
                // Handle success
                console.log('Loan data updated successfully');
                // Optionally, you can close the popup or perform any other action here
                swal.fire({
                    title: 'Success!',
                    text: 'Loan article details updated successfully', // Assuming the server sends a 'message' field in the response
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Reload the page
                    // setShowPopup3(false);
                    window.location.reload();
                });
            } else {
                console.error('Failed to update loan data');
            }
        } catch (error) {
            console.error('Error updating loan data:', error);
        }
    };

    return (
        <div className='bghome'>
            <Header />
            <Header1 />
            <div style={{ zoom: '0.8' }}>
                <div className='col-md-12 title mt-1'>
                    <FaUser className='mb-1' /> Members List
                </div>
            </div>
            <div style={{ zoom: 0.8, margin: '0px 50px' }} className='vh-100'>
                <div className='text-end me-3'>
                    <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." style={{width: '20%'}} />
                </div>
                <table className='table table-bordered  bg-light' style={{borderBottom: 'transparent'}}>
                    <thead>
                        <tr style={{whiteSpace: 'nowrap'}} className='text-center'>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Si.No</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Gl.No</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Date</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Name</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Place</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Amount</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Interest</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Articles</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Weight</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Approximate Value</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Period Agree</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>K.V</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>View</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Payment</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Edit</th>
                            <th style={{ backgroundColor: '#fff0', fontWeight: '400' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((Loan, index) => {
                            const date = new Date(Loan.dt);
                            const dateString = date.toLocaleDateString('en-GB'); // Adjust the locale as needed
                            return (
                                <tr key={index} className='text-center'>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{index + 1}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{Loan.gl_no}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{dateString}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400', whiteSpace: 'nowrap' }}>{Loan.nm}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{Loan.place}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{Loan.amt}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{Loan.pawn_intrest}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400', whiteSpace: 'nowrap' }}>{Loan.article}<button className='art_lst' style={{cursor: 'pointer'}} onClick={() => handleEditClick5(Loan.id)}>Article details</button></td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{Loan.weight}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{Loan.aprox_value}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>{Loan.period_agree}</td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }} className='text-center'><FaRegEdit size={25} onClick={() => handleEditClick(Loan.id)} /></td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }} className='text-center'><CiViewList size={30} onClick={() => handleEditClick1(Loan.id)} /></td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }} className='text-center'><MdPayment size={28} /></td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }} className='text-center'><FaRegEdit size={25} onClick={() => handleEditClick3(Loan.id)} /></td>
                                    <td style={{ backgroundColor: '#fff0', fontWeight: '400' }} className='text-center'><MdDelete size={25} onClick={() => handleEditClick4(Loan.id)} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className='text-center mt-2'>
                    {currentPage > 1 && (
                        <button onClick={(e) => handleClick(e, currentPage - 1)} className='mx-1 btn'>
                            Previous
                        </button>
                    )}
                    {pageNumbers.map(number => (
                        <button key={number} onClick={(e) => handleClick(e, number)} className='mx-1 btn'>
                            {number}
                        </button>
                    ))}
                    {currentPage < Math.ceil(loan.length / itemsPerPage) && (
                        <button onClick={(e) => handleClick(e, currentPage + 1)} className='mx-1 btn'>
                            Next
                        </button>
                    )}
                </div>
            </div>
            <Footer />
                {showPopup && (
                    <div>
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px', }} ref={popupRef}>
                                <div className='text-center'>
                                    <label><b>Edit Koottuvatti Details</b></label>
                                    <button onClick={handlePopupClose} className='btn' style={{ position: 'relative', left: '25%' }} > X </button>
                                </div>
                                <div className='mt-3'>Koottuvatti Status : {kootuvatti || ''}</div>
                                <select value={kootuvatti || ''} onChange={(e) => setKootuvatti(e.target.value)} className='mt-1'>
                                    <option disabled>select the option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                <div className='mt-3'>Koottuvatti Interest : {kootuvattiInt || ''}</div>
                                <input type="text" value={kootuvattiInt || '0'} onChange={(e) => setKootuvattiInt(e.target.value)} className='mt-1' />
                                <div className='mt-3 text-end'>
                                    <button className='btn' onClick={handleSave}>Save Changes</button> <button className='btn' onClick={handlePopupClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showPopup1 && (
                    <Popup onClose={handlePopupClose}>
                        <div className='mb-2 modal-header1'>
                            <button onClick={handlePopupClose} className='btn' style={{ position: 'relative', left: '45%' }} > X </button>
                        </div>
			            <div className={showDetails ? 'col-md-11' : 'dnone'} style={{fontSize: '14px', whiteSpace: 'nowrap'}}>
                            <table className='table table-bordered border-dark text-center m-3'>
                                <tbody> 
                                    <tr>
                                        <td style={{backgroundColor: '#fff0', fontWeight: '400'}}>
                                            <b>L.N.TN-</b><span id="lnnoValue"></span>
                                        </td>
                                        <td style={{backgroundColor: '#fff0', fontWeight: '400'}}>
                                            <b>Off : </b><span id="omobValue"></span><br />
                                            <b>Mob : </b><span id="cmobValue"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{backgroundColor: '#fff0', fontWeight: '400'}} colSpan='2'>
                                            <b><span id="cnameValue"></span></b><br />
                                            <span id="caddrValue"></span>
                                        </td>
                                    </tr>                                   
                                    <tr>
                                        <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Name : </b>{loans.nm}
                                        </td>
                                        <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Date : </b>{loans.dt}<br />
                                            <b>Gl.No : </b>{loans.gl_no}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Mobile : </b>{loans.cust_mob}
                                        </td>
                                        <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Place : </b>{loans.place}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan='2' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Address of Pawner : </b>{loans.addr}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan='2' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Amount : </b>{loans.amt}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan='2' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Details of Articles : </b>{loans.article}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan='2' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Weight : </b>{loans.weight}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan='2' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Approximate Value : </b>{loans.aprox_value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan='2' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Period agree : </b>{loans.period_agree}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>                        
                        <span className={showDetails ? 'col-md-11' : 'dnone'} style={{fontSize: '14px'}}>Calculation</span>
                        <div className={showDetails ? 'col-md-11 mb-5' : 'dnone'} style={{fontSize: '14px'}}>
                            <table className='table table-bordered border-dark text-center m-3'>
                                <tbody>
                                    <tr>
                                        <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Time Period</b>
                                        </td>
                                        <td style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Time Amount</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>1 Year</b>
                                        </td>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            {loans.one_yr_amt}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>1 Month</b>
                                        </td>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            {loans.one_mnth_amt}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>1 Day</b>
                                        </td>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            {loans.one_day_amt}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            <b>Min - 15 Days</b>
                                        </td>
                                        <td className='text-start' style={{ backgroundColor: '#fff0', fontWeight: '400' }}>
                                            {loans.seven_day_amt}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Popup>
                )}
                {showPopup2 && (
                <div>
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px', }} ref={popupRef}>
                            <div className='modal-header1'>
                                <button onClick={handlePopupClose} className='btn' style={{ position: 'relative', left: '45%' }} > X </button>
                            </div>
                            <div>
                                <label className='ms-1'><b style={{fontWeight: '600'}}>Name</b></label><br />
                                <input type='text' className='ms-2' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={name} placeholder={loans.nm} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className='ms-1'><b style={{fontWeight: '600'}}>Place</b></label><br />
                                <input type='text' className='ms-2' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={place} placeholder={loans.place} onChange={(e) => setPlace(e.target.value)} />
                            </div>
                            <div>
                                <label className='ms-1'><b style={{fontWeight: '600'}}>Amount</b></label><br />
                                <input type='text' className='ms-2' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={amount} placeholder={loans.amt} onChange={(e) => setAmount(e.target.value)} />
                            </div>
                            <div>
                                <label className='ms-1'><b style={{fontWeight: '600'}}>Interest</b></label><br />
                                <input type='text' className='ms-2' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={interest} placeholder={loans.pawn_intrest} onChange={(e) => setInterest(e.target.value)} />
                            </div>
                            <div>
                                <label className='ms-1'><b style={{fontWeight: '600'}}>Period Agree</b></label><br />
                                <input type='text' className='ms-2' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={periodAgree} placeholder={loans.period_agree} onChange={(e) => setPeriodAgree(e.target.value)} />
                            </div>
                            <div className='col-md-12 text-center mt-3'>
                                <button className='btn btn-success' onClick={handleUpdate}>Set Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                        {showPopup3 && (
                <div>
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px', }} ref={popupRef}>
                            <div className='modal-header1'>
                                <button onClick={handlePopupClose} className='btn' style={{ position: 'relative', left: '45%' }} > X </button>
                            </div>
                            {artt.map((loan, index) => (
                                <div key={index}>
                                    <div>
                                        <label className='ms-1'><b style={{fontWeight: '600'}}>Name</b></label><br />
                                        <input type='text' className='ms-2' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={loan.arti} placeholder="Article" onChange={(e) => handleArticleChange(e, index)} />
                                    </div>
                                    <div>
                                        <label className='ms-1'><b style={{fontWeight: '600'}}>Place</b></label><br />
                                        <input type='text' className='ms-2' style={{margin: '5px 5px', width: '90%', padding: '6px'}} value={loan.grm} placeholder="Weight" onChange={(e) => handleWeightChange(e, index)} />
                                    </div>
                                </div>
                            ))}
                            <div className='col-md-12 text-center mt-3'>
                                <button className='btn btn-success' onClick={handleUpdate1}>Set Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllCust;