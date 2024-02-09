import React, { useState, useEffect } from 'react';
import Header from './header';
import Header1 from './header1';
import Footer from './footer';
import { FaTicket } from "react-icons/fa6";
import { LuPlusCircle } from "react-icons/lu";

function ApplyLoan() {
    
    useEffect(() => {
        // Check if username and password are present in session storage
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');

        if (!username || !password) {
            // Redirect to login.js if username or password is missing
            window.location.href = '/';
        }
    }, []);

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
        nomineeRelationship: ''
    });

    useEffect(() => {
        // Check if username and password are present in session storage
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');

        if (!username || !password) {
            // Redirect to login.js if username or password is missing
            window.location.href = '/';
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
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
            // TODO: Handle success, show a success message, redirect, etc.
    
        } catch (error) {
            console.error('Error submitting loan application:', error);
            // TODO: Handle error, you can throw an error, show a message, etc.
        }
    };  
//     <script>
// function isNumberKey(evt) {
//     var charCode = (evt.which) ? evt.which : event.keyCode;

//     // Allow numbers (0-9) and a single decimal point
//     if (charCode >= 48 && charCode <= 57) {
//         return true;
//     } else if (charCode == 46) { // Allow only one decimal point
//         var inputValue = evt.target.value;
//         if (inputValue.indexOf('.') === -1) {
//             return true;
//         }
//     }

//     return false;
// }
// function Addbrch()
// {
// 	var brchid=document.getElementById("brchid").value;
// 	var brch_nm=document.getElementById("brch_nm").value;
// 	var cnt=document.getElementById("cnt").value;
// 	var plc=document.getElementById("plc").value;
// 	var addr=document.getElementById("addr").value;
// 	var brch_mgr=document.getElementById("brch_mgr").value;

// 	if(brchid=="" || brchid==null)
// 	{
// 		document.getElementById("brchid").style.background="#ff000059";
// 		document.getElementById("brchid").focus();
// 	}
// 	else if(brch_nm=="" || brch_nm==null)
// 	{
// 		document.getElementById("brch_nm").style.background="#ff000059";
// 		document.getElementById("brch_nm").focus();
// 	}
// 	else if(plc=="" || plc==null)
// 	{
// 		document.getElementById("plc").style.background="#ff000059";
// 		document.getElementById("plc").focus();
// 	}
// 	else
// 	{

// 		$.ajax({
// 			url:'../add_update_delete_ajax.php',
// 			data:'addbrchid='+brchid+'&addbrchnm='+brch_nm+'&addbrchcnt='+cnt+'&addbrchplc='+plc+'&addbrchnmaddr='+addr+'&addbrchmgr='+brch_mgr,
// 			type:'POST',
// 			success:function(done)
// 			{
			
// 				if(done=="success")
// 				{
// 					document.getElementById("successresultview").innerHTML="Branch Added Successfully";
// 					$('#successresultview').fadeIn().delay(3500).fadeOut();
// 					location.reload();
// 				}
// 				else
// 				{
// 					document.getElementById("errorresultview").innerHTML="Already Exist";
// 					$('#errorresultview').fadeIn().delay(3500).fadeOut();
// 				}
			
// 			},
// 		});
// 	}
// }

// function etdt(slno, id, valu) {
//     if (valu == "act") {
//         var okornotok = 1;
//     } else if (valu == "deact") {
//         var okornotok = 1;
//     } else if (valu == "edi") {
//         $.ajax({
//             url: '../add_update_delete_ajax.php',
//             data: 'brchedidelid=' + id + '&brchedidelval=' + valu,
//             type: 'POST',
//             success: function (done) {
//                 if (done) {
//                     // Parse the JSON data received
//                     var branchData = JSON.parse(done);
//                     var id = branchData.id;
//                     // Open a popup with the branchData
//                     openEditPopup(branchData, id);
//                 }
//             },
//         });
//         return;
//     } else {
//         var r = confirm("Are you sure want to delete?.");
//         if (r == true) {
//             var okornotok = 1;
//         } else {
//             var okornotok = 0;
//         }
//     }

//     if (okornotok == 1) {
//         $.ajax({
//             url: '../add_update_delete_ajax.php',
//             data: 'brchedidelid=' + id + '&brchedidelval=' + valu,
//             type: 'POST',
//             success: function (done) {
//                 if (done == "dele") {
//                     document.getElementById("successresultview").innerHTML = "Branch Removed Successfully";
//                     $('#successresultview').fadeIn().delay(3500).fadeOut();
//                     location.reload();
//                 } else if (done == "act") {
//                     document.getElementById("errorresultview").innerHTML = "Branch activated Successfully ";
//                     $('#errorresultview').fadeIn().delay(3500).fadeOut();
//                     location.reload();
//                 } else if (done == "deac") {
//                     document.getElementById("errorresultview").innerHTML = "Branch deactivated";
//                     $('#errorresultview').fadeIn().delay(3500).fadeOut();
//                     location.reload();
//                 } else {
//                     // Handle other cases if needed
//                 }
//             },
//         });
//     }
// }
// function openEditPopup(branchData, id) {
//     // Log branchData to the console to check its content
//     console.log("Branch Data:", branchData);
// 	console.log("id:", id);

//     // Show the modal
//     var modal = document.getElementById("myModalpopup");
//     var span = document.getElementsByClassName("close-popup")[0];
//     modal.style.display = "block";

//     // Close the modal when clicking on the close button
//     span.onclick = function() {
//         location.reload();
//     };

//     // Close the modal when clicking outside the modal
//     window.onclick = function(event) {
//         if (event.target == modal) {
//             location.reload();
//         }
//     };

//     // Modify the code to fetch or display content in 'vew_dl'
//     const up = `
//         <label>Branch Code</label>
//         <input type="text" id="vew_brch_code" name="vew_brch_code" placeholder="${branchData.data.brch_code}" value="${branchData.data.brch_code}" readonly>
//         <label>Branch Name</label>
//         <input type="text" id="vew_brch_nm" name="vew_brch_nm" placeholder="${branchData.data.brch_nm}" value="${branchData.data.brch_nm}">
//         <label>Place</label>
//         <input type="text" id="vew_plc" name="vew_plc" placeholder="${branchData.data.plc}" value="${branchData.data.plc}">
//         <label>Address</label>
//         <input type="text" id="vew_addr" name="vew_addr" placeholder="${branchData.data.addr}" value="${branchData.data.addr}">
//         <label>Contact</label>
//         <input type="text" id="vew_contact" name="vew_contact" placeholder="${branchData.data.contact}" value="${branchData.data.contact}">
//         <label>Manager</label>
//         <input type="text" id="vew_manager" name="vew_manager" placeholder="${branchData.data.manager}" value="${branchData.data.manager}"><br>
//         <button style="margin-top:10px;margin-right:10px;float:right;padding:10px;font-size:20px;background-color:red;color:#fff;border:red;" id="cancelButton"> Cancel </button>
//         <button style="margin-top:10px;margin-right:10px;float:right;padding:10px;font-size:20px;background-color:blue;color:#fff;border:blue;" value="omg" onclick="upt('${id}',this.value)"> Save </button>
//     `;

//     // Display content in 'vew_dl'
//     $('#vew_dl').html(up);

//     // Attach the event handler for the "Cancel" button using event delegation
//     $(document).on('click', '#cancelButton', function() {
//         location.reload();
//     });
// }
// function upt(idd, omgg) {
//     // Get values from input fields
//     var brch_nm = $('#vew_brch_nm').val();
//     var plc = $('#vew_plc').val();
//     var addr = $('#vew_addr').val();
//     var contact = $('#vew_contact').val();
//     var manager = $('#vew_manager').val();

//     // Ajax request to update data
//     $.ajax({
//         url: '../add_update_delete_ajax.php',
//         data: {
//             brchedidelid: idd,
//             brchedidelval: omgg,
//             brch_nm: brch_nm,
//             plc: plc,
//             addr: addr,
//             contact: contact,
//             manager: manager
//         },
//         type: 'POST',
//         success: function (done) 
// 		{
// 			if (done == "upda") {
//     		// Display success message
//             document.getElementById("successresultview").innerHTML = "Branch Details Updated Successfully";
//             $('#successresultview').fadeIn().delay(3500).fadeOut(); 
// 			}           
//         },
//     });
// }
// <?php
// 			$res_bar_no=$connect->prepare("select brch_code from branches  ORDER BY `branches`.`id` DESC LIMIT 0 , 1");
// 			$res_bar_no->execute();
// 			$num_bar_no=$res_bar_no->rowCount();
// 			if($num_bar_no==0)
// 			{
// 			$bar_no="WIN1001";
// 			}
// 			else
// 			{
// 				$row_bar_no=$res_bar_no->fetch();
// 				$x=explode("WIN",$row_bar_no['brch_code']);
// 				$last_bar_no=$x[1];
// 				$new_num=$last_bar_no+1;
// 				$bar_no="WIN".$new_num;
// 			}
// 			?></br>

// </script>
// <?php
// 					$sl=0;
// 					$res_brch=$connect->prepare("select * from branches");
// 					$res_brch->execute();
// 					$row_brchs=$res_brch->fetchAll();
// 				    foreach($row_brchs as $row_brch)
// 					{
// 						$sl++;
// 					?></input>
//                     <tbody>
					
// 						<tr id="row<?php print $sl;?>">
// 							<td align="center"><?php print $sl;?></td>
// 							<td align="center"><?php print $row_brch['brch_nm'];?></td>
// 							<td align="center"><?php print $row_brch['brch_code'];?></td>
// 							<td align="center"><?php print $row_brch['plc'];?></td>
// 							<td align="center"><?php print $row_brch['contact'];?></td>
// 							<td align="center"><?php print $row_brch['addr'];?></td>
// 							<td align="center"><?php print $row_brch['manager'];?></td>
// 							<td align="center">
// 							<b><?php print strtoupper($row_brch['sts']);?></b>
// 							<select onChange="etdt('<?php print $sl;?>','<?php print $row_brch['id'];?>',this.value)">
// 							<option value="<?php print $row_brch['sts'];?>">--</option>
// 								<option value="act">active</option>
// 								<option value="deact">deactive</option>
// 								<option value="edi" style="background-color:blue;color:#fff">Edit</option>
// 								<option value="dele" style="background-color:red;color:#fff">Delete</option>
// 							</select>
// 							</td>
// 						</tr>
// 						<?php
// 					}
// 					?>
						
// 				</tbody>

    return (
        <div className='bghome'>
            <Header />
            <Header1 />
                
            <div style="zoom:0.9">
		<div class="col-lg-12 title-col-lg" > 
		<i class="fa fa-sitemap"></i> Add Branches
		</div>
		
		

				
	
				<div id="myModalpopup" class="modalpopup">
		<div class="modal-content-popup">
			<span class="close-popup">&times;</span>
			<div id="vew_dl">
						
			</div>
		</div>
	</div>

	<center><h3><div id="successresultview" style="color:green"></div><div id="errorresultview" style="color:red"></div></h3></center>
	<form method="post" id="formid">
	<div class="col-lg-4 main-col-lg" >

	<div class="col-lg-6 sub-col-lg">
	
			<label>Branch ID</label><br />
				<input type="text" required name="brchid" id="brchid"   value="<?php print $bar_no;?>"  readonly />
			</div>	
		
	<div class="col-lg-6 sub-col-lg">
			<label>Branch Name</label><br />
				<input type="text" name="brch_nm" id="brch_nm" value=""  autofocus  required />
			</div>	

			

			<div class="col-lg-6 sub-col-lg">
			<label>Contact No.</label><br />
				<input type="text" onKeyPress="return isNumberKey(event);"  name="cnt" id="cnt" value=""  autofocus  required />
			</div>	
			
			<div class="col-lg-6 sub-col-lg">
			<label>Place</label><br />
				<input type="text" placeholder="" required name="plc"  id="plc" value=""  />
			</div>
			<div class="col-lg-6 sub-col-lg">
			<label>Full Address</label><br />
				<textarea cols="5" rows="5" id="addr"></textarea>
			</div>
			
			<div class="col-lg-6 sub-col-lg">
			<label>Manager Name</label><br />
				<input type="text" placeholder="" required name="brch_mgr"  id="brch_mgr" value=""  />
			</div>
			
			<div class="col-lg-6 sub-col-lg">
			
			</div>
		
           
			
			<div class="col-lg-6 sub-col-lg" style="text-align:right">
				<input type="button" onclick="Addbrch()"  class="btn" value="Save" name="set_ok" />
			</div>
	</div>
	</form>
	
	<div class="col-lg-8 main-col-lg" >
	
	
    <b>List of Branches</b><br />
					<table  width="100%" id="myTable" >
                    <thead>
					<tr>
						<th>Sl.No</th>
						<th>Branch Name</th>
						<th>Branch Code</th>
						<th>Place</th>
						<th>Contact</th>
						<th>Address</th>
						<th>Manager</th>
						<th>##</th>
					</tr>
					</thead>
					
			</table><br />
	</div>
	
	</div>
	

                    
            <Footer />
        </div>
    );
}

export default ApplyLoan;