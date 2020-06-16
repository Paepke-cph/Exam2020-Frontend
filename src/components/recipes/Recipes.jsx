import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  TextField,
  Paper,
  FormControl,
  FormControlLabel,
  Button,
  Checkbox
} from '@material-ui/core';
import RecipeCard from './RecipeCard.jsx';
import { apiUtils } from '../../utils/apiUtils.js';

const Recipes = () => {
  const opts = apiUtils.makeOptions('GET');
  const [storedItems, setStoredItems] = useState();
  const [storedRecipes, setStoredRecipes] = useState();
  const [searchId, setSearchId] = useState(0);
  const [searchPrepTime, setSearchPrepTime] = useState(0);

  let selectedItems = [];

  useEffect(() => {
    apiUtils.fetchData('/item', opts).then((data) => setStoredItems(data));
    apiUtils.fetchData('/recipe', opts).then((data) => setStoredRecipes(data));
  }, []);

  const handleClear = () => {
    apiUtils.fetchData('/recipe', opts).then((data) => setStoredRecipes(data));
    setSearchId(0);
    setSearchPrepTime(0);
    selectedItems = { ...[] };
  };

  const handleSearch = () => {
    let filtered = storedRecipes.filter((recipe) => {
      if (Number(searchId) > 0) {
        if (Number(searchPrepTime) > 0) {
          return (
            recipe.id == Number(searchId) &&
            recipe.preparationTime <= Number(searchPrepTime)
          );
        } else {
          return recipe.id == Number(searchId);
        }
      } else if (Number(searchPrepTime) > 0) {
        return recipe.preparationTime <= Number(searchPrepTime);
      }
    });
    setStoredRecipes([...filtered]);
  };

  const handleItemSelect = (event) => {
    const toBeAdded = storedItems.filter((item) => {
      return item.name === event.target.value;
    })[0];
    if (!selectedItems.includes(toBeAdded)) selectedItems.push(toBeAdded);
  };

  return (
    <>
      <h1>Recipes</h1>
      {Array.isArray(storedRecipes) && (
        <Paper>
          <Grid item xs={12}>
            <Grid container justify='center'>
              {storedRecipes.map((recipe) => (
                <Grid key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      )}
      {Array.isArray(storedItems) && (
        <Grid>
          <Paper>
            <Grid container justify='center' alignItems='baseline'>
              <Grid item>
                <FormControl>
                  <TextField
                    id='search-id'
                    label='ID'
                    value={searchId}
                    type='number'
                    onChange={(event) => {
                      setSearchId(event.target.value);
                    }}
                  />
                  <TextField
                    id='search-prepTime'
                    label='Prep Time'
                    value={searchPrepTime}
                    type='number'
                    onChange={(event) => {
                      setSearchPrepTime(event.target.value);
                    }}
                  />
                  <Grid item xs={12}>
                    {storedItems.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        value={item.name}
                        control={
                          <Checkbox
                            onChange={handleItemSelect}
                            checked={
                              selectedItems.filter((entry) => {
                                return entry.name === item.name;
                              })[0]
                            }
                          />
                        }
                        label={item.name}
                      />
                    ))}
                  </Grid>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default Recipes;
