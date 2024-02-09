import React, { useEffect, useState } from 'react';
import Header from './header';
import Header1 from './header1';
import Footer from './footer';
import { FaGem } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import log1 from './../img/b_edit.png';
import log2 from './../img/b_drop.png';
import Swal from 'sweetalert2';

function ArtList() {
    const [articles, setArticles] = useState([]);
    const [newArticleName, setNewArticleName] = useState('');
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [updateValuePopup, setUpdateValuePopup] = useState(false);
    const [newValueInput, setNewValueInput] = useState('');

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');

        if (!username || !password) {
            window.location.href = '/';
        }

        // Fetch articles data
        fetchArticlesData();
    }, []);

    const fetchArticlesData = async () => {
        try {
            const response = await fetch('http://localhost:5000/fetch-articles');
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles data:', error);
        }
    };

    const handleSetNow = async () => {
        try {
            const response = await fetch('http://localhost:5000/insert-article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ articleName: newArticleName }),
            });

            if (response.ok) {
                // Clear the input and fetch updated articles
                setNewArticleName('');
                fetchArticlesData();
            } else {
                console.error('Error inserting article:', response.statusText);
            }
        } catch (error) {
            console.error('Error inserting article:', error);
        }
    };

    const handleEditClick = async (articleId) => {
        setSelectedArticleId(articleId);
    
        try {
            const response = await fetch(`http://localhost:5000/fetch-article/${articleId}`);
            const data = await response.json();
    
            if (response.ok) {
                setNewValueInput(data.articleName);
                setUpdateValuePopup(true);                
            } else {
                console.error('Error fetching article details:', data.error);
            }
        } catch (error) {
            console.error('Error fetching article details:', error);
        }
    };

    const handleUpdateArticleName = async () => {
        try {
          const response = await fetch(`http://localhost:5000/update-article-name/${selectedArticleId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updatedName: newValueInput }),
          });
    
          if (response.ok) {
            // Clear inputs and close popup
            setNewValueInput('');
            setUpdateValuePopup(false);
            // Fetch updated articles
            fetchArticlesData();

            Swal.fire({
                icon: 'success',
                title: 'Article name updated successfully!',
                showConfirmButton: true,                
            });
          } else {
            console.error('Error updating article name:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating article name:', error);
        }
      };

      const handleDeleteClick = async (articleId, articleName) => {
        // Show SweetAlert confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete the article "${articleName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // If the user confirms, proceed to delete
                deleteArticle(articleId, articleName);
            }
        });
    };

    const deleteArticle = async (articleId, articleName) => {
        try {
            const response = await fetch(`http://localhost:5000/delete-article/${articleId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Fetch updated articles
                fetchArticlesData();

                // Show SweetAlert success alert
                Swal.fire({
                    icon: 'success',
                    title: `Article "${articleName}" deleted successfully!`,
                    showConfirmButton: true,
                });
            } else {
                console.error('Error deleting article:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };
    
    return (
        <div className='bghome'>
            <Header />
            <Header1 />
            <div>
                <div className='col-md-12 title'>
                    <FaGem className='mb-1' /> DETAILS OF ARTICLES
                </div>
                <div className='col-md-12 flx' style={{ zoom: 0.9 }}>
                    <div className='col-md-6 m-4'>
                        <div className='col-md-12'>
                            <div>
                                <label><b style={{ fontWeight: '600' }} className='fs-5'>Details of Articles</b></label><br />
                                <input type='text' style={{ margin: '5px 5px', width: '93%', padding: '6px' }} value={newArticleName} onChange={(e) => setNewArticleName(e.target.value)} />
                            </div>
                            <div className='mt-3 me-5 text-end'>
                                <button className='btn' style={{ background: '#004AAD', color: 'white' }} onClick={handleSetNow}>Set Now</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6' style={{ zoom: '0.9' }}>
                        <div className='col-md-10 m-4'>
                            <div className='fs-4'>
                                <b style={{ fontWeight: '600' }}>List of Articles</b>
                            </div>
                            <div className='mt-2 text-center'>
                                <div className='table-responsive'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>Sl.No</th>
                                                <th>Article Names</th>
                                                <th colSpan="2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((article, index) => (
                                                <tr key={article.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{article.articleName}</td>
                                                    <td><button className='btn' style={{ cursor: 'pointer' }} onClick={() => handleEditClick(article.id)}><img src={log1} alt='' width={'18px'} height={'18px'} /></button></td>
                                                    <td><button className='btn' style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(article.id, article.articleName)}><img src={log2} alt='' width={'18px'} height={'18px'} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Update Value Popup */}
            {updateValuePopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <label>New Value:</label>
                        <input type="text" value={newValueInput} onChange={(e) => setNewValueInput(e.target.value)} />
                        <button onClick={handleUpdateArticleName}>Submit</button>
                    </div>
                </div>
            )}
            </div>
             
            <Footer />
        </div>
    );
}

export default ArtList;
