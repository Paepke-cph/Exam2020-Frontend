import React, { useEffect, useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import RecipeCard from './RecipeCard.jsx';
import { apiUtils } from '../../utils/apiUtils.js';

const Recipes = () => {
  const opts = apiUtils.makeOptions('GET');
  const [storedItems, setStoredItems] = useState();
  const [storedRecipes, setStoredRecipes] = useState();
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    apiUtils.fetchData('/item', opts).then((data) => setStoredItems(data));
    apiUtils.fetchData('/recipe', opts).then((data) => setStoredRecipes(data));
  }, []);

  const selectedItems = [];

  const handleSearch = () => {
    if (searchId !== '') {
      console.log(searchId);
    } else {
      let opts = apiUtils.makeOptions('POST', { selectedItems });
      apiUtils.fetchData('/recipe', opts).then((data) => setStoredItems(data));
    }
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
                    type='search'
                    onChange={(event) => {
                      setSearchId(event.target.value);
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
