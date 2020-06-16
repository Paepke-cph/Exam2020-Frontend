import React, { useEffect, useState } from 'react';
import { apiUtils } from '../../utils/apiUtils.js';
import {
  FormControl,
  FormControlLabel,
  TextField,
  Button,
  Checkbox
} from '@material-ui/core';
const AdminPage = () => {
  const emptyRecipe = {
    id: -1,
    directions: '',
    ingredients: [],
    preparationTime: 0
  };
  const opts = apiUtils.makeOptions('GET');
  const [storedItems, setStoredItems] = useState();
  const [storedRecipes, setStoredRecipes] = useState();
  const [searchId, setSearchId] = useState('');

  const [currentRecipe, setCurrentRecipe] = useState(emptyRecipe);

  let selectedItems = [];

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
    selectedItems = { ...ingredients };
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
            placeholder='Directions'
          ></TextField>
        </FormControl>
      </div>
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
      <ul>
        {Array.isArray(storedRecipes) &&
          storedRecipes.map((recipe) => {
            return (
              <li key={recipe.id}>
                Recipe ID: {recipe.id}
                <Button
                  value={recipe.id}
                  color='primary'
                  onClick={(event) => {
                    handleUpdateSelect(recipe);
                  }}
                >
                  Edit
                </Button>
                <Button
                  value={recipe.id}
                  color='secondary'
                  onClick={deleteRecipe}
                >
                  Delete
                </Button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default AdminPage;
