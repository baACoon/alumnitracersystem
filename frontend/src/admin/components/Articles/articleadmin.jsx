import React, { useEffect, useState } from 'react';

const AdminArticlePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [articles, setArticles] = useState([]);
    const [editId, setEditId] = useState(null); // ID for the article being edited

    // Fetch articles
    const fetchArticles = async () => {
        try {
            const response = await fetch('http://localhost:5050/artcileroutes/');
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    useEffect(() => {
        fetchArticles(); // Fetch articles on component mount
    }, []);

    // Submit form to add or update article
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            const url = editId
                ? `http://localhost:5050/artcileroutes/update/${editId}` // Update endpoint
                : 'http://localhost:5050/artcileroutes/add'; // Add endpoint

            const method = editId ? 'PUT' : 'POST'; // Use PUT for update

            const response = await fetch(url, {
                method,
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setTitle('');
                setContent('');
                setImage(null);
                setEditId(null);
                fetchArticles(); // Refresh articles after submission
            } else {
                setMessage(data.message || 'Error occurred');
            }
        } catch (error) {
            setMessage('Error: Unable to connect to server');
        }
    };

    // Delete article
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5050/artcileroutes/delete/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                fetchArticles(); // Refresh articles after deletion
            } else {
                setMessage(data.message || 'Error occurred');
            }
        } catch (error) {
            setMessage('Error: Unable to connect to server');
        }
    };

    // Edit article
    const handleEdit = (article) => {
        setTitle(article.title);
        setContent(article.content);
        setEditId(article._id); // Set the ID of the article being edited
    };

    return (
        <div>
            <h1>Manage Articles</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button type="submit">{editId ? 'Update' : 'Add'} Article</button>
            </form>

            <h2>Articles</h2>
            {articles.length === 0 ? (
                <p>No articles to display</p>
            ) : (
                <ul>
                    {articles.map((article) => (
                        <li key={article._id}>
                            <h3>{article.title}</h3>
                            <p>{article.content}</p>
                            {article.image && (
                                <img src={`http://localhost:5050${article.image}`} alt={article.title} style={{ maxWidth: '200px' }} />
                            )}
                            <button onClick={() => handleEdit(article)}>Edit</button>
                            <button onClick={() => handleDelete(article._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminArticlePage;
