const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); // Import cors
const fs = require('fs');
const util = require('util');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ffinance',
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

const queryAsync = util.promisify(db.query).bind(db);
// Define a separate route for checking company details
app.get('/check-company', (req, res) => {
    const checkCompanyQuery = `SELECT COUNT(*) as count FROM cmpany_details`;
  
    // Check if there are any rows in cmpany_details
    db.query(checkCompanyQuery, (err, result) => {
      if (err) {
        console.error('Error checking company details:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const rowCount = result[0].count;
  
      if (rowCount === 0) {
        // If no rows are present, send a response to redirect to login.js page
        return res.status(200).json({ message: 'No redirection needed' });
      } else {
        // If rows are present, send a response with no redirection
        return res.status(200).json({ message: 'Redirect to login' });
      }
    });
  });

  app.get('/company-logo', (req, res) => {
    const getLogoQuery = 'SELECT clogo FROM cmpany_details LIMIT 1'; // Assuming you only have one row in cmpany_details

    db.query(getLogoQuery, (err, result) => {
        if (err) {
            console.error('Error fetching company logo:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length > 0) {
            const logoFileName = result[0].clogo;
            const logoPath = path.join(__dirname, '../sea_pawn_bk_end/src/log/', logoFileName);

            // Send the image as a response
            res.sendFile(logoPath, (err) => {
                if (err) {
                    console.error('Error sending company logo:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
            });
        } else {
            return res.status(404).json({ error: 'Company logo not found' });
        }
    });
});

// Handle request to fetch pawn settings
app.get('/pawn-settings', (req, res) => {
  const query = 'SELECT * FROM pawn_settings LIMIT 1';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching pawn settings:', err);
          res.status(500).send('Internal Server Error');
      } else {
          const settings = results[0] || {};
          res.json(settings);
      }
  });
});

app.get('/company-details', (req, res) => {
  const getCompanyDetailsQuery = 'SELECT nm as name FROM cmpany_details LIMIT 1'; // Assuming you only have one row in cmpany_details

  db.query(getCompanyDetailsQuery, (err, result) => {
      if (err) {
          console.error('Error fetching company details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.length > 0) {
          const companyDetails = {
              name: result[0].name,
          };

          // Send the company details as a JSON response
          return res.status(200).json(companyDetails);
      } else {
          return res.status(404).json({ error: 'Company details not found' });
      }
  });
});

app.post('/regis', async (req, res) => {
    const { companyName, username, password } = req.body;
    const logo = req.files && req.files.logo;
  
    if (!logo) {
      return res.status(400).json({ error: 'Logo file is required' });
    }
  
    const logoFileName = `${uuidv4()}.png`;
    const logoPath = path.join(__dirname, '../sea_pawn_bk_end/src/log', logoFileName);
  
    logo.mv(logoPath, async (err) => {
      if (err) {
        console.error('Error saving logo file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const checkCompanyQuery = `SELECT COUNT(*) as count FROM cmpany_details`;
  
      // Check if there are any rows in cmpany_details
      db.query(checkCompanyQuery, async (err, result) => {
        if (err) {
          console.error('Error checking company details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        const rowCount = result[0].count;
  
        if (rowCount === 0) {
          // If no rows are present, insert new data
          const insertCompanyQuery = `INSERT INTO cmpany_details (nm, clogo) VALUES (?, ?)`;
          db.query(insertCompanyQuery, [companyName, logoFileName], async (err, result) => {
            if (err) {
              console.error('Error inserting company details:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
  
            const insertLoginQuery = `INSERT INTO login (us_nm, paswd, dept, brch_id, active_dactive) VALUES (?, ?, 'admin', '0', 'active')`;
            db.query(insertLoginQuery, [username, password], async (err, result) => {
              if (err) {
                console.error('Error inserting login details:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }
  
              return res.status(200).json({ message: 'Registration successful' });
            });
          });
        } else {
          // If rows are present, redirect to login.js page
          return res.status(200).json({ message: 'Redirect to login' });
        }
      });
    });
  });

app.post('/login', (req, res) => {
    const { userType, username, password, branch } = req.body;

    // Validate input parameters
    if (!userType || !username || !password) {
        return res.status(400).json({ error: 'Invalid input parameters' });
    }

    // Perform authentication logic (query the database, check user credentials, etc.)
    // Example: Assuming you have a 'login' table in your database

    let loginQuery;
    let queryParams;

    if (userType === 'admin') {
        // If userType is 'admin', no need to check the branch
        loginQuery = 'SELECT * FROM login WHERE us_nm = ? AND paswd = ? AND dept = ?';
        queryParams = [username, password, userType];
    } else if (userType === 'staff') {
        // If userType is 'staff', check for missing branch
        if (!branch) {
            return res.status(400).json({ error: 'Branch is required for staff login' });
        }

        loginQuery = 'SELECT * FROM login WHERE us_nm = ? AND paswd = ? AND dept = ? AND brch_id = ?';
        queryParams = [username, password, userType, branch];
    } else {
        // Invalid userType
        return res.status(400).json({ error: 'Invalid userType' });
    }

    // Execute the query
    db.query(loginQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length > 0) {
            // User authenticated successfully
            return res.status(200).json({ message: 'Login successful' });
        } else {
            // User authentication failed
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Fetch articles data
app.get('/getArticles', (req, res) => {
  db.query('SELECT * FROM articles', (error, results) => {
      if (error) {
          console.error('Error fetching articles:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});

app.get('/get-last-gl-no', (req, res) => {
  const query = 'SELECT gl_no FROM pawn_ticket ORDER BY id DESC LIMIT 1';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const lastGlNo = result.length > 0 ? result[0].gl_no : 0;
      res.json({ lastGlNo });
    }
  });
});

app.post('/submit-loan-application', async (req, res) => {
  try {
    const formData = req.body;

    // Log the incoming data to the console
    console.log('Received loan application data:', formData);

    // Split gl_no into serial number (gl_no_sl) and current year (gl_no_yr)
    const glNoParts = formData.glNo.split('/');
    const glNoSl = glNoParts[0];
    const currentYear = new Date().getFullYear();
    const glNoYr = glNoParts[1] || currentYear;

    const getTotalDaysInYear = (year) => {
      const startDate = new Date(year, 0, 1); // January 1st of the current year
      const endDate = new Date(year + 1, 0, 1); // January 1st of the next year

      const differenceInMilliseconds = endDate - startDate;
      const totalDays1 = Math.floor(differenceInMilliseconds / (24 * 60 * 60 * 1000));

      return totalDays1;
    };

    const currentYearTotalDays = getTotalDaysInYear(currentYear);
    const principal = formData.amount;
    const interest = formData.monthlyInterest;
    const iyear = Math.round(principal * (interest / 100 * 12));
    const imonth = Math.round(principal * (interest / 100));
    const iday = Math.round(principal * (interest / 100 * 12 / currentYearTotalDays * 1.0139));
    const hmonth = Math.round(iday * 15);

    // Fetch the last id from the pawn_ticket table
    const lastIdQuery = 'SELECT id FROM pawn_ticket ORDER BY id DESC LIMIT 1';
    const lastIdResult = await queryAsync(lastIdQuery);

    let newId;

    if (lastIdResult.length === 0) {
      // If there are no rows, set id to 1
      newId = 1;
    } else {
      // Increment the last id for the new entry
      newId = lastIdResult[0].id + 1;
    }

    // Insert data into the pawn_ticket table
    const insertQuery = 'INSERT INTO pawn_ticket (id, gl_no, gl_no_sl, gl_no_yr, dt, nm, place, addr, post_off, pincode, amt, pawn_intrest, aadhar, cust_mob, nomi_nm, nomi_rela, status, period_agree, third_mnth_interest_yes_or_no, third_mnth_interest_per_mnth, kootuvatti_yes_or_no, koottuvatti_intrest, aprox_value, tot_amt_with_kootuvatti, one_yr_amt, one_mnth_amt, one_day_amt, seven_day_amt, cmp_ln_no, cmp_off_mob, brch_id, cmp_nm, article, weight, third_mnth_start_dt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_date)';
    const values = [
      newId, // Use the calculated newId
      formData.glNo,
      glNoSl,
      glNoYr,
      formData.date,
      formData.name,
      formData.place,
      formData.address,
      formData.postOffice,
      formData.pincode,
      formData.amount,
      formData.monthlyInterest,
      formData.aadharNumber,
      formData.mobileNumber,
      formData.nominee,
      formData.nomineeRelationship,
      formData.status,
      formData.period_agree,
      formData.third_mnth_interest_yes_or_no,
      formData.third_mnth_interest_per_mnth,
      formData.kootuvatti_yes_or_no,
      formData.koottuvatti_intrest,
      iyear,
      iyear,
      iyear,
      imonth,
      iday,
      hmonth,
      formData.lnno,
      formData.omob,
      formData.brch_id,
      formData.cname,
      formData.articlesDetails,
      formData.weight
    ];

    const result = await queryAsync(insertQuery, values);

    // Sum up the weights
    let totalWeight = 0;
    const articleDetailsArray = formData.articlesDetails.split(',');
    const weightValues = [];
    articleDetailsArray.forEach((article, index) => {
      const weightKey = `weight_${index}`;
      const weightValue = parseFloat(formData[weightKey] || 0);
      console.log(`Article ${index + 1}: ${article.trim()}, Weight: ${weightValue}`);
      totalWeight += weightValue;
      weightValues.push(weightValue);
    });

    // Subtract formData.weight from totalWeight
    const remainingWeight = parseFloat(formData.weight) - totalWeight;
    console.log('remainingWeight:', remainingWeight);

        // Fetch the last id from the pawn_ticket table
        const lastIdQuery1 = 'SELECT id FROM memb_article_list ORDER BY id DESC LIMIT 1';
        const lastIdResult1 = await queryAsync(lastIdQuery1);
    
        let newId1 = 0;
    
        if (lastIdResult1.length === 0) {
          // If there are no rows, set id to 1
          newId1 = 1;
        } else {
          // Increment the last id for the new entry
          newId1 = lastIdResult1[0].id + 1;
        }
    
    // Insert data into memb_article_list table
    for (let i = 0; i < articleDetailsArray.length; i++) {
      const insertArticleQuery = 'INSERT INTO memb_article_list (row_id, date, gl_no, arti, grm) VALUES (?, ?, ?, ?, ?)';
      let grmValue;
      if (i === 0) {
        // For the first iteration, insert remaining weight
        grmValue = remainingWeight.toFixed(2);
      } else {
        // For subsequent iterations, insert weight from weightValues if available
        grmValue = i < weightValues.length ? weightValues[i - 1].toFixed(2) : '0.00';
      }
      const articleValues = [
        newId,
        formData.date,
        formData.glNo,
        `${articleDetailsArray[i].trim()}`, // Use articleDetailsArray directly
        grmValue
      ];
      await queryAsync(insertArticleQuery, articleValues);
    }

    console.log('Data inserted successfully:', result);

    return res.status(200).json({ message: 'Loan application submitted successfully' });
  } catch (error) {
    console.error('Exception during loan application submission:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Fetch loan data
app.get('/getLoan', (req, res) => {
  db.query('SELECT * FROM pawn_ticket ORDER BY id DESC LIMIT 1', (error, results) => {
      if (error) {
          console.error('Error fetching loan:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});

// Fetch loan data
app.get('/getLoans', (req, res) => {
  db.query('SELECT * FROM pawn_ticket WHERE status = "active" ORDER BY id DESC', (error, results) => {
      if (error) {
          console.error('Error fetching loan:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});

// Route to fetch loan by ID
app.get('/getLoanById/:id', (req, res) => {
  const loanId = req.params.id;
  const query = 'SELECT * FROM pawn_ticket WHERE id = ?';

  console.log('Executing SQL query:', query, 'with ID:', loanId);

  db.query(query, [loanId], (err, results) => {
    if (err) {
      console.error('Error fetching loan by ID:', err);
      res.status(500).json({ error: 'Failed to fetch loan by ID' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    const loanData = results[0]; // Assuming loan ID is unique, so we take the first result
    // console.log(loanData);
    res.status(200).json(loanData);
  });
});

app.get('/getLoanBySearch', (req, res) => {
  const { mode, value } = req.query;

  let query = '';
  switch (mode) {
      case 'mob':
          query = `SELECT * FROM pawn_ticket WHERE cust_mob = '${value}' ORDER BY id DESC LIMIT 1`;
          break;
      case 'glno':
          query = `SELECT * FROM pawn_ticket WHERE gl_no = '${value}' ORDER BY id DESC LIMIT 1`;
          break;
      case 'name':
          query = `SELECT * FROM pawn_ticket WHERE nm = '${value}' ORDER BY id DESC LIMIT 1`;
          break;
      default:
          res.status(400).json({ error: 'Invalid search mode' });
          return;
  }

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching loan by search:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      res.json(results);
  });
});

app.get('/get-search-options', (req, res) => {
  const { mode } = req.query;

  let query = '';
  switch (mode) {
      case 'mob':
          query = 'SELECT DISTINCT cust_mob FROM pawn_ticket';
          break;
      case 'glno':
          query = 'SELECT DISTINCT gl_no FROM pawn_ticket';
          break;
      case 'name':
          query = 'SELECT DISTINCT nm FROM pawn_ticket';
          break;
      default:
          res.status(400).json({ error: 'Invalid search mode' });
          return;
  }

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching search options:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      const options = results.map((result) => result[Object.keys(result)[0]]);
      res.json({ options });
  });
});

app.get('/fetch-articles', (req, res) => {
  const fetchArticlesQuery = 'SELECT id, nm FROM articles'; // Adjust the query based on your actual table structure

  db.query(fetchArticlesQuery, (err, result) => {
      if (err) {
          console.error('Error fetching articles:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Process the result and send it as a JSON response
      const articles = result.map(row => ({
          id: row.id,
          articleName: row.nm,
      }));

      return res.status(200).json(articles);
  });
});

//server.js
app.post('/insert-article', (req, res) => {
  try {
    const { articleName } = req.body;

    // Validate input parameters
    if (!articleName) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    // Fetch the last article ID
    const fetchLastArticleIdQuery = 'SELECT id FROM articles ORDER BY id DESC LIMIT 1';

    db.query(fetchLastArticleIdQuery, (err, result) => {
      if (err) {
        console.error('Error fetching last article ID:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Determine the new article ID
      const lastArticleId = result.length > 0 ? result[0].id : 0;
      const newArticleId = lastArticleId + 1;

      // Perform the insertion logic
      const insertArticleQuery = 'INSERT INTO articles (id, nm) VALUES (?, ?)';
      const values = [newArticleId, articleName];

      db.query(insertArticleQuery, values, (err, result) => {
        if (err) {
          console.error('Error inserting article:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({ message: 'Article inserted successfully' });
      });
    });
  } catch (error) {
    console.error('Exception during article insertion:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/fetch-article/:id', (req, res) => {
  const { id } = req.params;
  const fetchArticleQuery = 'SELECT nm as articleName FROM articles WHERE id = ?';

  db.query(fetchArticleQuery, [id], (err, result) => {
      if (err) {
          console.error('Error fetching article details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.length > 0) {
          return res.status(200).json(result[0]);
      } else {
          return res.status(404).json({ error: 'Article not found' });
      }
  });
});

app.post('/update-article-name/:id', (req, res) => {
  const { id } = req.params;
  const { updatedName } = req.body;

  const updateArticleQuery = 'UPDATE articles SET nm = ? WHERE id = ?';
  const values = [updatedName, id];

  db.query(updateArticleQuery, values, (err, result) => {
      if (err) {
          console.error('Error updating article name:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'Article name updated successfully' });
  });
});

app.delete('/delete-article/:id', (req, res) => {
  const { id } = req.params;

  const deleteArticleQuery = 'DELETE FROM articles WHERE id = ?';

  db.query(deleteArticleQuery, [id], (err, result) => {
      if (err) {
          console.error('Error deleting article:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'Article deleted successfully' });
  });
});

app.post('/update-pawn-settings', (req, res) => {
  try {
    const {
      minterest,
      ainterest,
      gr,
      Koottuvatti,
      kinterest,
      postc
    } = req.body;

    // Validate input parameters
    if (
      minterest === undefined ||
      ainterest === undefined ||
      gr === undefined ||
      Koottuvatti === undefined ||
      kinterest === undefined ||
      postc === undefined
    ) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    // Check if there are any rows in pawn_settings
    const checkPawnSettingsQuery = 'SELECT COUNT(*) as count FROM pawn_settings';

    db.query(checkPawnSettingsQuery, (err, result) => {
      if (err) {
        console.error('Error checking pawn_settings:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const rowCount = result[0].count;

      if (rowCount === 0) {
        // If no rows are present, insert new data
        const insertPawnSettingsQuery =
          'INSERT INTO pawn_settings (id, pawn_intrest, afterthree_intrest, gold_rate, kootuvatti_for_all_mem_yes_no, kootuvatti_intrest_for_all_mem, postalchrge) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [
          minterest,
          ainterest,
          gr,
          Koottuvatti,
          kinterest,
          postc
        ];

        db.query(insertPawnSettingsQuery, values, (err, result) => {
          if (err) {
            console.error('Error inserting pawn_settings:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res
            .status(200)
            .json({ message: 'Pawn settings inserted successfully' });
        });
      } else {
        // If rows are present, update existing data
        const updatePawnSettingsQuery =
          'UPDATE pawn_settings SET pawn_intrest = ?, afterthree_intrest = ?, gold_rate = ?, kootuvatti_for_all_mem_yes_no = ?, kootuvatti_intrest_for_all_mem = ?, postalchrge = ? WHERE id = 1';
        const values = [
          minterest,
          ainterest,
          gr,
          Koottuvatti,
          kinterest,
          postc
        ];

        db.query(updatePawnSettingsQuery, values, (err, result) => {
          if (err) {
            console.error('Error updating pawn_settings:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res
            .status(200)
            .json({ message: 'Pawn settings updated successfully' });
        });
      }
    });
  } catch (error) {
    console.error('Exception during pawn_settings operation:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/fetch-pawn-settings', (req, res) => {
  const fetchPawnSettingsQuery = 'SELECT * FROM pawn_settings LIMIT 1';

  db.query(fetchPawnSettingsQuery, (err, result) => {
      if (err) {
          console.error('Error fetching pawn settings:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.length > 0) {
          const pawnSettingsData = {
              pawn_intrest: result[0].pawn_intrest,
              afterthree_intrest: result[0].afterthree_intrest,
              gold_rate: result[0].gold_rate,
              kootuvatti_for_all_mem_yes_no: result[0].kootuvatti_for_all_mem_yes_no,
              kootuvatti_intrest_for_all_mem: result[0].kootuvatti_intrest_for_all_mem,
              postalchrge: result[0].postalchrge
          };

          // Send the pawn settings data as a JSON response
          return res.status(200).json(pawnSettingsData);
      } else {
          return res.status(404).json({ error: 'Pawn settings not found' });
      }
  });
});

app.post('/update-company-details', (req, res) => {
  const { cname, rdate, cmob, omob, lnno, caddr} = req.body;
  
  console.log(req.body);
  // Assuming you have logic to update the company details in the database
  const updateCompanyDetailsQuery = 'UPDATE cmpany_details SET nm = ?, mob = ?, off_mob = ?, ln_no = ?, doj = ?, addr = ? WHERE id = 1'; // Assuming you want to update the first row

  const values = [
    cname,
    cmob,
    omob,    
    lnno,
    rdate,
    caddr
  ];
console.log(values);
  db.query(updateCompanyDetailsQuery, values, (err, result) => {
      if (err) {
          console.error('Error updating company details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'Company details updated successfully' });
  });
});

app.post('/upload-logo', (req, res) => {
  const logoFile = req.files && req.files.file;

  if (!logoFile) {
    return res.status(400).json({ error: 'Logo file is required' });
  }

  const logoFileName = `${uuidv4()}.png`;
  const logoPath = path.join(__dirname, '../sea_pawn_bk_end/src/log/', logoFileName);

  // Assuming you have logic to get the old logo filename from the database
  const getOldLogoQuery = 'SELECT clogo FROM cmpany_details WHERE id = 1'; // Assuming you want to get the logo filename from the first row

  db.query(getOldLogoQuery, (err, result) => {
    if (err) {
      console.error('Error getting old logo filename:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const oldLogoFileName = result[0].clogo;

    // Unlink the old logo file
    const oldLogoPath = path.join(__dirname, '../sea_pawn_bk_end/src/log/', oldLogoFileName);
    fs.unlink(oldLogoPath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error unlinking old logo file:', unlinkErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Move the new logo file
      logoFile.mv(logoPath, async (mvErr) => {
        if (mvErr) {
          console.error('Error saving new logo file:', mvErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Update the logo filename in the database
        const updateLogoQuery = 'UPDATE cmpany_details SET clogo = ? WHERE id = 1'; // Assuming you want to update the first row

        db.query(updateLogoQuery, [logoFileName], (updateErr) => {
          if (updateErr) {
            console.error('Error updating logo filename:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({ message: 'Logo uploaded successfully' });
        });
      });
    });
  });
});

// API endpoint to get company details
app.get('/get-company-details', (req, res) => {
  const query = 'SELECT * FROM cmpany_details LIMIT 1';

  db.query(query, (error, results) => {
      if (error) {
          console.error('Error getting company details from database:', error);
          res.status(500).json({ message: 'Internal Server Error', error: error.message });
      } else {
          const dbCompanyDetails = results[0]; // Assuming you only want one row

          // Map database fields to companyDetails fields
          let companyDetails = {
              cname: dbCompanyDetails.nm || '',
              rdate: dbCompanyDetails.doj || '',
              cmob: dbCompanyDetails.mob || '',
              omob: dbCompanyDetails.off_mob || '',
              lnno: dbCompanyDetails.ln_no || '',
              caddr: dbCompanyDetails.addr || '',
              // Add other fields as needed
          };

          res.json({ message: 'Company details retrieved successfully', data: companyDetails });
      }
  });
});

app.post('/update-password', (req, res) => {
  const { username, oldPassword, newPassword, confirmPassword } = req.body;

  // Validate input parameters
  if (!username || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Invalid input parameters' });
  }

  // Check if old password is correct
  const checkPasswordQuery = 'SELECT COUNT(*) as count FROM login WHERE us_nm = ? AND paswd = ?';
  db.query(checkPasswordQuery, [username, oldPassword], (err, result) => {
      if (err) {
          console.error('Error checking old password:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      const rowCount = result[0].count;

      if (rowCount === 0) {
          return res.status(401).json({ error: 'Incorrect old password' });
      }

      // Update password in the database
      const updatePasswordQuery = 'UPDATE login SET paswd = ?, dte = CURRENT_DATE WHERE us_nm = ?';
      db.query(updatePasswordQuery, [newPassword, username], (updateErr, updateResult) => {
          if (updateErr) {
              console.error('Error updating password:', updateErr);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({ message: 'Password updated successfully' });
      });
  });
});

// Fetch branches data
app.get('/getBranches', (req, res) => {
    db.query('SELECT * FROM branches', (error, results) => {
        if (error) {
            console.error('Error fetching branches:', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

// Add a new endpoint to update the status of a branch
app.put('/updateBranchStatus/:id', (req, res) => {
  const branchId = req.params.id;
  const { sts } = req.body;

  db.query('UPDATE branches SET sts = ? WHERE id = ?', [sts, branchId], (error, results) => {
      if (error) {
          console.error('Error updating branch status:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.status(200).send('Status updated successfully');
      }
  });
});

app.post('/addBranch', (req, res) => {
  const branchData = req.body;

  // Get the current maximum id from the table
  db.query('SELECT IFNULL(MAX(id), 0) + 1 AS next_id FROM branches', (error, results) => {
      if (error) {
          console.error('Error retrieving max id:', error);
          res.status(500).send('Internal Server Error');
      } else {
          const nextId = results[0].next_id;

          // Set the id for the new branch data
          branchData.id = nextId;
          branchData.brch_code = 'BRH000'+nextId;

          // Insert the new branch data
          db.query('INSERT INTO branches SET ?', branchData, (insertError) => {
              if (insertError) {
                  console.error('Error inserting branch:', insertError);
                  res.status(500).send('Internal Server Error');
              } else {
                  console.log('Branch added successfully');
                  res.status(200).send('OK');
              }
          });
      }
  });
});

// New endpoint to handle branch deletion
app.delete('/deleteBranch/:id', (req, res) => {
  const branchId = req.params.id;

  db.query('DELETE FROM branches WHERE id = ?', [branchId], (error, results) => {
    if (error) {
      console.error('Error deleting branch:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Branch deleted successfully');
      res.status(200).send('OK');
    }
  });
});

app.get('/getBranch/:id', (req, res) => {
  const branchId = req.params.id;

  db.query('SELECT * FROM branches WHERE id = ?', [branchId], (error, results) => {
    if (error) {
      console.error('Error fetching branch data:', error);
      res.status(500).send('Internal Server Error');
    } else {
      if (results.length > 0) {
        const branchData = results[0];
        res.json(branchData);
      } else {
        res.status(404).send('Branch not found');
      }
    }
  });
});

// Add a new endpoint to handle branch updates
app.put('/updateBranch/:id', (req, res) => {
  const branchId = req.params.id;
  const {
    newBranchName,
    newPlace,
    newAddress,
    newContact,
    newManager
  } = req.body;

  db.query(
    'UPDATE branches SET brch_nm = ?, plc = ?, addr = ?, contact = ?, manager = ? WHERE id = ?',
    [newBranchName, newPlace, newAddress, newContact, newManager, branchId],
    (error, results) => {
      if (error) {
        console.error('Error updating branch details:', error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Branch details updated successfully');
        res.status(200).send('OK');
      }
    }
  );
});

app.post('/addStaff', (req, res) => {
  const staffData = req.body;

  // Get the current maximum id from the table
  db.query('SELECT IFNULL(MAX(id), 0) + 1 AS next_id FROM login WHERE dept = "staff"', (error, results) => {
      if (error) {
          console.error('Error retrieving max id:', error);
          res.status(500).send('Internal Server Error');
      } else {
        const nextId = results[0].next_id + 1;
        const nextId1 = results[0].next_id;
        const nextId2 = results[0].next_id - 1;
        // console.log(nextId);
        // console.log(nextId1);
        // console.log(nextId2);
        
        if (nextId1 === 1) {
            // Set the id for the new branch data
            staffData.id = nextId;
            staffData.us_nm = 'STF000' + nextId1;            
        } else {
          // Set the id for the new branch data
          staffData.id = nextId1;
          staffData.us_nm = 'STF000' + nextId2;
        }
          // Insert the new branch data
          db.query('INSERT INTO login SET ?', staffData, (insertError) => {
              if (insertError) {
                  console.error('Error inserting branch:', insertError);
                  res.status(500).send('Internal Server Error');
              } else {
                  console.log('Staff added successfully');
                  res.status(200).send('OK');
              }
          });
      }
  });
});

// Fetch branches data
app.get('/getStaffs', (req, res) => {
  db.query('SELECT * FROM login', (error, results) => {
      if (error) {
          console.error('Error fetching branches:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});

// Add a new endpoint to update the status of a staff
app.put('/updateStaffStatus/:id', (req, res) => {
  const staffId = req.params.id;
  const { active_dactive } = req.body;
  console.log(staffId);

  db.query('UPDATE login SET active_dactive = ? WHERE id = ?', [active_dactive, staffId], (error, results) => {
      if (error) {
          console.error('Error updating branch status:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.status(200).send('Status updated successfully');
      }
  });
});

// Fetch branch details by ID
app.get('/getBranchh/:id', (req, res) => {
  const branchId = req.params.id;

  db.query('SELECT * FROM branches WHERE id = ?', [branchId], (error, results) => {
      if (error) {
          console.error('Error fetching branch details:', error);
          res.status(500).send('Internal Server Error');
      } else {
          const branchDetails = results[0];
          res.json(branchDetails);
      }
  });
});

// Add a new endpoint to delete a staff
app.delete('/deleteStaff/:id', (req, res) => {
  const staffId = req.params.id;
  console.log(staffId);

  db.query('DELETE FROM login WHERE us_nm = ?', [staffId], (error, results) => {
    if (error) {
      console.error('Error deleting staff:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Staff deleted successfully');
    }
  });
});

// Add a new endpoint to update staff details
app.put('/updateStaff/:id', (req, res) => {
  const staffId = req.params.id;
  const updatedStaffData = req.body;
  console.log(updatedStaffData);
  // console.log(staffId);

  db.query('UPDATE login SET ? WHERE us_nm = ?', [updatedStaffData, staffId], (error, results) => {
    if (error) {
      console.error('Error updating staff details:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Staff details updated successfully');
    }
  });
});

// extra amount
// Endpoint for updating loan amount
app.post('/updateLoanAmount', (req, res) => {
  const { newAmount, pawn_intrest, id } = req.body; // Assuming 'id' is sent from the client-side to identify the loan

  const currentYear = new Date().getFullYear(); // Get the current year

  const getTotalDaysInYear = (year) => {
    const startDate = new Date(year, 0, 1); // January 1st of the current year
    const endDate = new Date(year + 1, 0, 1); // January 1st of the next year

    const differenceInMilliseconds = endDate - startDate;
    const totalDays1 = Math.floor(differenceInMilliseconds / (24 * 60 * 60 * 1000));

    return totalDays1;
  };

  const currentYearTotalDays = getTotalDaysInYear(currentYear);
  const principal = parseFloat(newAmount); // Parse newAmount as a float
  const interest = parseFloat(pawn_intrest); // Parse pawn_intrest as a float
  const iyear = Math.round(principal * (interest / 100 *12)); // Calculate yearly interest
  const imonth = Math.round(principal * (interest / 100)); // Calculate monthly interest
  const iday = Math.round(principal * (interest / 100 * 12 / currentYearTotalDays * 1.0139)); // Calculate daily interest
  const hmonth = Math.round(iday * 15); // Calculate 15-day interest

  console.log(iyear);
  console.log(imonth);
  console.log(iday);
  console.log(hmonth);
  console.log(interest);
  console.log(principal);
  console.log(currentYearTotalDays);

  // Update the loan amount in the database based on the provided 'id'
  db.query('UPDATE pawn_ticket SET amt = ?, one_yr_amt = ?, one_mnth_amt = ?, one_day_amt = ?, seven_day_amt = ?, aprox_value = ?, tot_amt_with_kootuvatti = ? WHERE id = ?', [newAmount, iyear, imonth, iday, hmonth, iyear, iyear, id], (error, results) => {
      if (error) {
          console.error('Error updating loan amount:', error);
          res.status(500).json({ message: 'Failed to update loan amount' });
      } else {
          console.log('Loan amount updated successfully');
          res.status(200).json({ message: 'Loan amount updated successfully' });
      }
  });
});

// Route to update loan details by ID
app.post('/updateLoan/:id', (req, res) => {
  const loanId = req.params.id;
  const { kootuvatti, kootuvattiInt } = req.body;

  // Assuming you are using a database connection pool named 'db'
  const query = 'UPDATE pawn_ticket SET kootuvatti_yes_or_no = ?, koottuvatti_intrest = ? WHERE id = ?';
  
  db.query(query, [kootuvatti, kootuvattiInt, loanId], (err, results) => {
      if (err) {
          console.error('Error updating loan:', err);
          res.status(500).json({ error: 'Failed to update loan' });
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Loan not found' });
          return;
      }

      res.status(200).json({ message: 'Loan updated successfully' });
  });
});

app.get('/getLoanBySearches/:id', (req, res) => {
  const loanId = req.params.id;

  db.query('SELECT * FROM pawn_ticket WHERE id = ?', [loanId], (error, results) => {
    if (error) {
      console.error('Error fetching branch data:', error);
      res.status(500).send('Internal Server Error');
    } else {
      if (results.length > 0) {
        const loanData = results[0];
        res.json(loanData);
      } else {
        res.status(404).send('Branch not found');
      }
    }
  });
});

app.delete('/deleteLoan/:id', (req, res) => {
  const staffId = req.params.id;
  console.log(staffId);

  db.query('DELETE FROM pawn_ticket WHERE id = ?', [staffId], (error, results) => {
    if (error) {
      console.error('Error deleting loan Entry:', error);
      res.status(500).send('Internal Server Error');
    } else {
      // After deleting from pawn_ticket, delete corresponding row from memb_article_list
      db.query('DELETE FROM memb_article_list WHERE row_id = ?', [staffId], (error2, results2) => {
        if (error2) {
          console.error('Error deleting corresponding memb_article_list entry:', error2);
          res.status(500).send('Internal Server Error');
        } else {
          res.status(200).send('Loan entry and corresponding memb_article_list entry deleted successfully');
        }
      });
    }
  });
});

// Update loan data endpoint
app.post('/updateLoanData', (req, res) => {
  const { id, name, place, amount, interest, periodAgree } = req.body;

  const currentYears = new Date().getFullYear();
  const getTotalDaysInYears = (year) => {
    const startDate = new Date(year, 0, 1); // January 1st of the current year
    const endDate = new Date(year + 1, 0, 1); // January 1st of the next year

    const differenceInMilliseconds = endDate - startDate;
    const totalDays1 = Math.floor(differenceInMilliseconds / (24 * 60 * 60 * 1000));

    return totalDays1;
  };

  const currentYearTotalDay = getTotalDaysInYears(currentYears);
  const principal = amount;
  const iyear = Math.round(principal * (interest / 100 * 12));
  const imonth = Math.round(principal * (interest / 100));
  const iday = Math.round(principal * (interest / 100 * 12 / currentYearTotalDay * 1.0139));
  const hmonth = Math.round(iday * 15);

  // Update query
  const sql = `
    UPDATE pawn_ticket
    SET nm = ?, place = ?, amt = ?, pawn_intrest = ?, period_agree = ?, one_mnth_amt = ?, one_day_amt = ?, seven_day_amt = ?, one_yr_amt = ?, aprox_value = ?, tot_amt_with_kootuvatti = ? WHERE id = ?`;

  console.log(req.body);

  // Run the update query
  db.query(sql, [name, place, amount, interest, periodAgree, imonth, iday, hmonth, iyear, iyear, iyear, id], (err, result) => {
    if (err) {
      console.error('Error updating loan data:', err);
      res.status(500).json({ error: 'Failed to update loan data' });
      return;
    }
    console.log('Loan data updated successfully');
    res.status(200).json({ message: 'Loan data updated successfully' });
  });
});

// Fetch loan data
app.get('/getLoanss', (req, res) => {
  db.query('SELECT * FROM pawn_ticket WHERE status = "deactive" ORDER BY id DESC', (error, results) => {
      if (error) {
          console.error('Error fetching loan:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});

// Fetch loan data
app.get('/getLoansss', (req, res) => {
  db.query('SELECT * FROM pawn_ticket ORDER BY id DESC', (error, results) => {
      if (error) {
          console.error('Error fetching loan:', error);
          res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
  });
});

app.get('/getLoanBySearchess/:id', (req, res) => {
  const loanId = req.params.id;

  db.query('SELECT * FROM memb_article_list WHERE row_id = ?', [loanId], (error, results) => {
      if (error) {
          console.error('Error fetching branch data:', error);
          res.status(500).send('Internal Server Error');
      } else {
          if (results.length > 0) {
              const loanData = results;
              res.json(loanData);
          } else {
              res.status(404).send('Branch not found');
          }
      }
  });
});

app.post('/updateArtData', async (req, res) => {
  const updatedData = req.body; // Assuming req.body contains the updated loan data array
console.log(updatedData);
// const row_id = updatedData.row_id;
  // Iterate through the updated data array and update the database for each item
  updatedData.forEach(async (loan) => {
      const { id, arti, grm, row_id } = loan;
      try {
          // Update memb_article_list table
          await db.query('UPDATE memb_article_list SET arti = ?, grm = ? WHERE id = ?', [arti, grm, id]);
          // console.log(`Loan data updated successfully for ID ${id}`);

          // Calculate the sum of grm values
          const totalWeight = updatedData.reduce((acc, cur) => acc + parseFloat(cur.grm), 0).toFixed(2);

          // Concatenate all article names
          const articleNames = updatedData.map(item => item.arti).join(', ');
          
          console.log(totalWeight);
          console.log(articleNames);
          console.log(row_id);
          // Update pawn_ticket table
          await db.query('UPDATE pawn_ticket SET article = ?, weight = ? WHERE id = ?', [articleNames, totalWeight, row_id]);
          // console.log(`Pawn ticket data updated successfully for ID ${id}`);
      } catch (error) {
          console.error(`Error updating data for ID ${id}:`, error);
      }
  });

  res.sendStatus(200); // Send success response
});

// Handle any other requests by serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});