import styles from '../Articles/articles.css'
import React, { useEffect, useState } from 'react';



function articleclient (){

    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:5050/artcileroutes/'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await response.json();
                setNews(data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };
        fetchNews();
    }, []);
    
    return (
        <div className={styles.articleContainer}>
            <div className={styles.sectionTitle}>
                <h1>ARTICLES</h1>
                <hr />
                {news.length === 0 ? (
                <p>No Article to display</p>
            ) : (
                <ul>
                    {news.map((item) => (
                        <li key={item._id}>
                            <h2>{item.title}</h2>
                            <p>{item.content}</p>
                            {item.image && <img src={`http://localhost:5050${item.image}`} alt={item.title} style={{ maxWidth: '300px' }} />}
                            <small>{new Date(item.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
}

export default articleclient;