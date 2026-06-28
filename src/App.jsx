import { useState } from 'react'
import './App.css'


function App() {
  const [item, setItem] = useState(null)

  const fetchMeal = async () => {
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.meals[0]);
      setItem(data.meals[0]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="header">
        <div className="title">Explore Yummy Meals</div>
        <div className="descripton">Discover yummy meals around the world!</div>
      </div>

      <div className="body">
        <div className="image-section">
          {item && (
            <>
              <div className="title">{item.strMeal}</div>
              <img src={item.strMealThumb} alt={item.strMeal} />
              
              <button className="attribute">{item.strCategory}</button>
              <button className="attribute">{item.strCountry}</button>
              <button className="attribute">{item.strIngredient1}</button>
              <button className="attribute">{item.strIngredient2}</button>
            </>
          )}
        </div>

        <button className="discover" onClick={fetchMeal} >Discover</button>

      </div>
    </>
  )
}

export default App
