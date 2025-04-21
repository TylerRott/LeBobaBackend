import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MenuPage.css';

function MenuPage() {
  const { categoryId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/menu/items')
      .then(res => setMenuItems(res.data))
      .catch(err => console.error('Failed to load menu items:', err));
  }, []);

  // Keywords to exclude
  const excludeKeywords = ['sugar', 'ice', 'popping', 'pearl', 'jelly'];

  // Filtered menu list
  const filteredMenuItems = menuItems.filter(item => {
    const name = item.item.toLowerCase();
    return !excludeKeywords.some(keyword => name.includes(keyword));
  });

  return (
    <div className="menu-page">
      <h2>🍹 Select Your Drink</h2>
      <div className="menu-grid">
        {filteredMenuItems.map(item => (
          <div className="menu-card" key={item.idmenu}>
            <h4>{item.item}</h4>
            <p>${Number(item.price).toFixed(2)}</p>
            <button onClick={() => navigate(`/customize/${item.idmenu}`)}>
              Customize
            </button>
          </div>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate('/')}>⬅ Back</button>
    </div>
  );
}

export default MenuPage;
