import { useState } from 'react'
import './App.css'

//The meal DB
const URL = "https://www.themealdb.com/api/json/v1/1/random.php"

function App() {
  const [item, setItem] = useState(null)
  const [banList, setBanList] = useState([])
  const [seen, setSeen] = useState([])

  const fetchMeal = async () => {
    try {

      for(let attempts = 0; attempts < 20; attempts++) {
        const res = await fetch(URL);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        const meal = data.meals[0];

        

        //To prevent a banned attribute indexed in the list of 20 ingredients 
        //for another meal to appear in further searches
        const ingredients = [];

        //The API has a list of 20 ingredients that can be listed for a meal
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];

          if (ingredient && ingredient.trim() !== "") {
            ingredients.push(ingredient);
          }
        }

        const banned = banList.includes(meal.strCategory) ||
        banList.includes(meal.strCountry) ||
        ingredients.some(ingredient => banList.includes(ingredient));

        if(!banned) {
          setItem(meal);
          setSeen(prevSeen => [...prevSeen, meal])
          return;
        }
      };
      
    } catch (err) {
      console.error(err);
    }
  };

  //Bans clicked attributes
  const toggleBan = (attribute) => {
    if(banList.includes(attribute)) {
      setBanList (banList.filter(item => item !== attribute));
    } else {
      setBanList([...banList, attribute]);
    };
    
  };

  return (
    <div className="main-body">

      <div className="seen-list">
        <div className="seen-title">Seen Meals</div>
        <br></br>
        <div className="side-desc">Here are meals you have discovered!</div>
        <br></br>

        {seen.map((meal, index) => (
          <div key={index} className="seen-item">
            <div className="seen-image-title">{meal.strMeal}</div>
            <img className="seen-image" src={meal.strMealThumb} alt={meal.strMeal} />
          </div>
        ))}
      </div>


      <div className="main-nav">
        <div className="header">
          <div className="title">Explore Yummy Meals!</div>
          <br></br>
          <div className="description">Discover yummy meals around the world!</div>
          <br></br>
        </div>

        <div className="body">
          <div className="image-section">
            {item && (
              <>
                <div className="image-title">{item.strMeal}</div>
                <img className="image" src={item.strMealThumb} alt={item.strMeal} />
                <div className="buttons">
                  <button className="attribute" onClick={() => toggleBan(item.strCategory)}> {item.strCategory} </button>
                  <button className="attribute" onClick={() => toggleBan(item.strCountry)}> {item.strCountry} </button>
                  <button className="attribute" onClick={() => toggleBan(item.strIngredient1)}> {item.strIngredient1} </button>
                  <button className="attribute" onClick={() => toggleBan(item.strIngredient2)}> {item.strIngredient2} </button>
                </div>
              </>
            )}
          </div>
          <br></br>
          <button className="discover" onClick={fetchMeal}>Discover</button>
        </div>
      </div>


      <div className="side-nav">
        <div className="side-title">Ban List</div>
        <br></br>
        <div className="side-desc">Ban an attribute by clicking it on the listing below the image</div>
        <br></br>
        <div className="ban-list">
          {banList.map(attribute => (
            <button className="attribute" key={attribute} onClick={() => toggleBan(attribute)}>
              {attribute}
            </button>
          ))}
        </div>
      </div>


    </div>
  )
}

export default App
