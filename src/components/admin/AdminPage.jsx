import React, { useEffect, useState } from 'react';
import { apiUtils } from '../../utils/apiUtils.js';
import { FormControl, TextField, Button, Grid } from '@material-ui/core';
import AdminRecipeCard from './AdminRecipeCard.jsx';
const AdminPage = () => {
  const emptyRecipe = {
    id: 0,
    directions: '',
    ingredients: [],
    preparationTime: 0
  };
  const opts = apiUtils.makeOptions('GET');
  const [storedItems, setStoredItems] = useState();
  const [storedRecipes, setStoredRecipes] = useState();
  const [currentRecipe, setCurrentRecipe] = useState(emptyRecipe);

  useEffect(() => {
    apiUtils.fetchData('/item', opts).then((data) => setStoredItems(data));
    apiUtils.fetchData('/recipe', opts).then((data) => setStoredRecipes(data));
  }, []);

  const deleteRecipe = (event) => {
    const id = event.target.offsetParent.value;
    const recipeToBeDeleted = storedRecipes.filter((recipe) => {
      return recipe.id.toString() === id;
    })[0];
    let temp = storedRecipes.filter((rec) => {
      return rec.id !== recipeToBeDeleted.id;
    });
    setStoredRecipes(temp);
    let opts = apiUtils.makeOptions('POST', recipeToBeDeleted);
    apiUtils.fetchData('/recipe/delete', opts);
  };

  const handleChange = (event) => {
    setCurrentRecipe({
      ...currentRecipe,
      [event.target.id]: event.target.value
    });
  };

  const handleUpdateSelect = ({
    id,
    directions,
    ingredients,
    preparationTime
  }) => {
    setCurrentRecipe({
      id: id,
      directions: directions,
      ingredients: ingredients,
      preparationTime: preparationTime
    });
  };

  const handleSubmit = () => {
    if (currentRecipe.id === -1) {
      let opts = apiUtils.makeOptions('POST', currentRecipe);
      apiUtils.fetchData('/recipe/create', opts).then((data) => {
        currentRecipe.id = data.id;
      });
    } else {
      let opts = apiUtils.makeOptions('POST', currentRecipe);
      apiUtils.fetchData('/recipe/update', opts).then((data) => {
        handleUpdateSelect(data);
      });
    }
  };

  const removeIngredient = (ingredient) => {
    let filtered = currentRecipe.ingredients.filter((cur) => {
      return ingredient.id !== cur.id;
    });
    setCurrentRecipe({ ...currentRecipe, ingredients: filtered });
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>ID: {currentRecipe.id}</p>
      <div>
        <FormControl>
          <TextField
            id='preparationTime'
            value={currentRecipe.preparationTime}
            onChange={handleChange}
            type='number'
            placeholder='Preparation Time'
          ></TextField>
        </FormControl>
      </div>
      <div>
        <FormControl>
          <TextField
            id='directions'
            value={currentRecipe.directions}
            onChange={handleChange}
            type='search'
            placeholder='Directions'
          ></TextField>
        </FormControl>
      </div>
      {currentRecipe.ingredients.length > 0 &&
        currentRecipe.ingredients.map((ingredient) => {
          return (
            <div key={ingredient.ingredient.key}>
              <TextField
                value={ingredient.ingredient.name}
                disabled={true}
              ></TextField>
              <TextField value={ingredient.amount} disabled={true}></TextField>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  removeIngredient(ingredient);
                }}
              >
                Remove
              </Button>
            </div>
          );
        })}
      <Button color='primary' onClick={handleSubmit}>
        {currentRecipe.id === -1 ? 'New' : 'Update'}
      </Button>
      <Button
        disabled={currentRecipe.id === -1}
        onClick={() => {
          setCurrentRecipe(emptyRecipe);
        }}
      >
        Clear
      </Button>
      {Array.isArray(storedRecipes) &&
        storedRecipes.map((recipe) => {
          return (
            <Grid item xs={12} key={recipe.id}>
              <AdminRecipeCard
                recipe={recipe}
                deleteRecipe={deleteRecipe}
                editRecipe={handleUpdateSelect}
              />
            </Grid>
          );
        })}
    </div>
  );
};

export default AdminPage;
