import React, { useEffect, useState, useRef } from 'react';
import Header from './header';
import Header1 from './header1';
import Footer from './footer';
import fu from './../img/move-to-bottom.svg';
import { FaSitemap } from 'react-icons/fa6';
import swal from 'sweetalert2';

function Branch() {
  const [branches, setBranches] = useState([]);
  const [nextBranchId, setNextBranchId] = useState('');
  const [updateValuePopup, setUpdateValuePopup] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [newValueInput, setNewValueInput] = useState('');
  const [newValueInput1, setNewValueInput1] = useState('');
  const [newValueInput2, setNewValueInput2] = useState('');
  const [newValueInput3, setNewValueInput3] = useState('');
  const [newValueInput4, setNewValueInput4] = useState('');

  const popupRef = useRef(null);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    if (!username || !password) {
      window.location.href = '/';
    }

    // Fetch branches and set initial input values
    const fetchData = async () => {
      await fetchBranches();

      // Set initial input values based on selected branch data
      const selectedBranchIdFromUrl = window.location.pathname.split('/').pop();
      if (selectedBranchIdFromUrl && selectedBranchIdFromUrl !== 'add') {
        const branchId = parseInt(selectedBranchIdFromUrl, 10);
        const selectedBranch = branches.find((branch) => branch.id === branchId);
        if (selectedBranch) {
          setSelectedBranchId(selectedBranch.id);
          setNewValueInput(selectedBranch.brch_nm);
          setNewValueInput1(selectedBranch.plc);
          setNewValueInput2(selectedBranch.addr);
          setNewValueInput3(selectedBranch.contact);
          setNewValueInput4(selectedBranch.manager);
          setUpdateValuePopup(true);
        }
      }
    };

    fetchData();
  }, );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setUpdateValuePopup(false);
        refreshPage();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupRef]);

    const refreshPage = () => {
        window.location.reload();
    };

  const fetchBranches = async () => {
    try {
      const response = await fetch('http://localhost:5000/getBranches');
      if (response.ok) {
        const branchesData = await response.json();
        setBranches(branchesData);

        const lastBranch = branchesData[branchesData.length - 1];
        const lastBranchId = lastBranch ? lastBranch.brch_code : 0;
        setNextBranchId(generateNextBranchId(lastBranchId));
      } else {
        console.error('Failed to fetch branches');
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const generateNextBranchId = (lastBranchId) => {
    const numericPart = lastBranchId.replace(/[^\d]/g, '');
    const nextNumericPart = String(Number(numericPart) + 1).padStart(numericPart.length, '0');
    const prefix = lastBranchId.replace(/\d/g, '');
    return `${prefix}${nextNumericPart}`;
  };

  const handleSave = async () => {
    const branchData = {
      brch_code: document.getElementsByName('bid')[0].value,
      brch_nm: document.getElementsByName('bname')[0].value,
      plc: document.getElementsByName('plc')[0].value,
      addr: document.getElementsByName('addr')[0].value,
      contact: document.getElementsByName('cno')[0].value,
      manager: document.getElementsByName('mname')[0].value,
      sts: 'active',
    };

    try {
      const response = await fetch('http://localhost:5000/addBranch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branchData),
      });

      if (response.ok) {
          swal.fire({
            title: 'Success!',
            text: 'Branch added successfully', // Assuming the server sends a 'message' field in the response
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Reload the page
            window.location.reload();
        });
      } else {
        console.error('Failed to add branch');
      }
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  const handleStatusChange = async (branchId, newStatus) => {
    try {
      if (newStatus === 'delete') {
        const response = await fetch(`http://localhost:5000/deleteBranch/${branchId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          swal.fire({
            title: 'Success!',
            text: 'Branch deleted successfully', // Assuming the server sends a 'message' field in the response
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Reload the page
            window.location.reload();
        });
          setBranches((prevBranches) => prevBranches.filter((branch) => branch.id !== branchId));
        } else {
          console.error('Failed to delete branch');
        }
      } else if (newStatus === 'edit') {
        // Fetch the data for the selected branch
        const response = await fetch(`http://localhost:5000/getBranch/${branchId}`);
        if (response.ok) {
          const branchData = await response.json();
          setSelectedBranchId(branchData.id);
          setNewValueInput(branchData.brch_nm);
          setNewValueInput1(branchData.plc);
          setNewValueInput2(branchData.addr);
          setNewValueInput3(branchData.contact);
          setNewValueInput4(branchData.manager);
          setUpdateValuePopup(true);
        } else {
          console.error('Failed to fetch branch data for editing');
        }
      } else {
        const response = await fetch(`http://localhost:5000/updateBranchStatus/${branchId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sts: newStatus }),
        });

        if (response.ok) {
            swal.fire({
            title: 'Success!',
            text: 'Status updated successfully', // Assuming the server sends a 'message' field in the response
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Reload the page
            window.location.reload();
        });
          console.log('Status updated successfully');
        } else {
          console.error('Failed to update status');
        }
      }
    } catch (error) {
      console.error('Error updating/deleting branch:', error);
    }
  };

  const handleUpdateBranch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/updateBranch/${selectedBranchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newBranchName: newValueInput,
          newPlace: newValueInput1,
          newAddress: newValueInput2,
          newContact: newValueInput3,
          newManager: newValueInput4,
        }),
      });
  
      if (response.ok) {
            swal.fire({
              title: 'Success!',
              text: 'Branch details updated successfully', // Assuming the server sends a 'message' field in the response
              icon: 'success',
              confirmButtonText: 'OK'
          }).then(() => {
              // Reload the page
              window.location.reload();
              setUpdateValuePopup(false);
              fetchBranches(); // Optionally, re-fetch branches after update
              refreshPage();
          });        
      } else {
        console.error('Failed to update branch details');
      }
    } catch (error) {
      console.error('Error updating branch details:', error);
    }
  };  

  const handleNumberInput = (e) => {
    const value = e.target.value;
    const isValidInput = /^[0-9]*\.?[0-9]*$/.test(value);

    if (!isValidInput) {
      e.target.value = value.replace(/[^0-9.]/g, '');
    }
  };

  const handleNumberInput1 = (e) => {
    const value = e.target.value;
    const isValidInput = /^[0-9]*\.?[0-9]*$/.test(value);
  
    if (!isValidInput) {
      setNewValueInput3(value.replace(/[^0-9.]/g, '')); // Update the correct state
    } else {
      setNewValueInput3(value); // Update the correct state
    }
  };
  

  const handlePopupClose = () => {
    setUpdateValuePopup(false);
    refreshPage();
  };

  return (
    <div className='bghome'>
      <Header />
      <Header1 />
      <div className='col-md-12 title'>
        <FaSitemap className='mb-2' size={22} /> Add Branches
      </div>
      <div className='col-md-12 clfl mt-5' style={{ zoom: 0.79 }}>
        <div className='col-md-4 mx-4 my-1 kj'>
          <div className='col-md-12 d-flex mx-3  my-3 mb-3'>
            <div className='col-md-6'>
              <label>
                <b style={{ fontWeight: '600' }}>Branch ID</b>
              </label>
              <br />
              <input
                type='text'
                style={{ margin: '5px 5px', width: '90%', padding: '6px' }}
                name='bid'
                value={nextBranchId ? nextBranchId: 'BRH0001'}
                readOnly
              />
            </div>
            <div className='col-md-6'>
              <label>
                <b style={{ fontWeight: '600' }}>Branch Name</b>
              </label>
              <br />
              <input
                type='text'
                style={{ margin: '5px 5px', width: '90%', padding: '6px' }}
                name='bname'
              />
            </div>
          </div>
          <div className='col-md-12 d-flex mx-3 my-2'>
            <div className='col-md-6'>
              <label>
                <b style={{ fontWeight: '600' }}>Contact Number</b>
              </label>
              <br />
              <input
                type='text'
                style={{ margin: '5px 5px', width: '90%', padding: '6px' }}
                name='cno'
                onChange={handleNumberInput}
              />
            </div>
            <div className='col-md-6'>
              <label>
                <b style={{ fontWeight: '600' }}>Place</b>
              </label>
              <br />
              <input
                type='text'
                style={{ margin: '5px 5px', width: '90%', padding: '6px' }}
                name='plc'
              />
            </div>
          </div>
          <div className='col-md-12 d-flex mx-3 my-3'>
            <div className='col-md-6'>
              <label>
                <b style={{ fontWeight: '600' }}>Address</b>
              </label>
              <br />
              <textarea
                style={{ margin: '5px 5px', width: '90%', padding: '6px' }}
                rows='1'
                name='addr'
              />
            </div>
            <div className='col-md-6'>
              <label>
                <b style={{ fontWeight: '600' }}>Manager Name</b>
              </label>
              <br />
              <input
                type='text'
                style={{ margin: '5px 5px', width: '90%', padding: '6px' }}
                name='mname'
              />
            </div>
          </div>
          <div className='me-3 text-end'>
            <button
              className='btn'
              style={{ background: '#004AAD', color: 'white' }}
              onClick={handleSave}
            >
              Save<img src={fu}/>
            </button>
          </div>
        </div>
        <div className='col-md-7 vh-100'>
          <div className='col-md-12'>
            <table className='table text-center kj'>
              <thead>
                <tr>
                  <td>SI.No</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Branch Name</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Branch Code</td>
                  <td>Place</td>
                  <td>Contact</td>
                  <td>Address</td>
                  <td>Manager</td>
                  <td>Status</td>
                </tr>
                
              </thead>
              <tbody style={{ background: 'transparent' }}>
                {branches.map((branch, index) => (
                  <tr key={index}>
                    <td style={{ background: '#fff0' }}>{index + 1}</td>
                    <td style={{ background: '#fff0' }}>{branch.brch_nm}</td>
                    <td style={{ background: '#fff0' }}>{branch.brch_code}</td>
                    <td style={{ background: '#fff0' }}>{branch.plc}</td>
                    <td style={{ background: '#fff0' }}>{branch.contact}</td>
                    <td style={{ background: '#fff0' }}>{branch.addr}</td>
                    <td style={{ background: '#fff0' }}>{branch.manager}</td>
                    <td style={{ background: '#fff0' }}>
                      {branch.sts.toUpperCase()}
                      <br />
                      <select
                        style={{ margin: '5px', padding: '2px' }}
                        onChange={(e) => handleStatusChange(branch.id, e.target.value)}
                      >
                        <option value={branch.sts}>-- Status --</option>
                        <option value='active'>Active</option>
                        <option value='deactive'>Deactive</option>
                        <option value='edit'>Edit</option>
                        <option value='delete'>Delete</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     
      {/* Update Value Popup */}
      {updateValuePopup && (
        <div className='popup' ref={popupRef}>
          <div className='popup-inner' style={{ margin: '0px 40px' }}>
            <button className='btn close-btn mb-1' style={{ padding: '0px 5px', marginLeft: '100%', backgroundColor: 'transparent', fontSize: '20px', color: 'black' }} onClick={handlePopupClose}>
              &times;
            </button>
            <label>Branch Name:</label>
            <input
              type='text'
              value={newValueInput}
              onChange={(e) => setNewValueInput(e.target.value)}
              style={{ padding: '5px', marginBottom: '3px' }}
            />
            <label>Place:</label>
            {/* Add input for 'Place' */}
            <input
              type='text'
              onChange={(e) => setNewValueInput1(e.target.value)}
              value={newValueInput1}
              style={{ padding: '5px', marginBottom: '3px' }}
            />
            <label>Contact:</label>
            <input
              type='text'
              value={newValueInput3}
              onChange={handleNumberInput1}
              style={{ padding: '5px', marginBottom: '3px' }}
            />
            <label>Address:</label>
            <textarea style={{ padding: '5px', marginBottom: '3px' }} onChange={(e) => setNewValueInput2(e.target.value)} value={newValueInput2}></textarea>
            <label>Manager:</label>
            <input
              type='text'
              value={newValueInput4} onChange={(e) => setNewValueInput4(e.target.value)}
              style={{ padding: '5px', marginBottom: '15px' }}
            />
            <button onClick={handleUpdateBranch}>Save Changes</button>
          </div>
        </div>
      )} 
     
       <Footer />
    </div>
    
  );
}

export default Branch;
