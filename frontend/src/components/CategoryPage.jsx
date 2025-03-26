import React from 'react';
import './CategoryPage.css';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Fruit Tea', emoji: '🍓' },
  { id: 2, name: 'Milk Tea', emoji: '🥛' },
  { id: 3, name: 'Snacks', emoji: '🍩' },
  { id: 4, name: 'Toppings', emoji: '🧋' }
];

function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="category-page">
      <h1>🍵 LeBoba Kiosk</h1>
      <div className="categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => navigate(`/menu/${cat.id}`)}
            className="category-tile"
          >
            <span>{cat.emoji}</span>
            <p>{cat.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
