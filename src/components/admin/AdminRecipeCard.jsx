import React from 'react';
import { Card, CardContent, CardActions, Button } from '@material-ui/core';
const AdminRecipeCard = ({ recipe, deleteRecipe, editRecipe }) => {
  return (
    <Card>
      <CardContent>
        <h1>Recipe: {recipe.id}</h1>
        <p>Directions: {recipe.directions}</p>
        <p>{recipe.preparationTime} mins</p>
        <ul>
          {recipe.ingredients.map(({ ingredient, amount }) => {
            return (
              <div key={ingredient.id}>
                <p>
                  {ingredient.name} --- {amount}g
                </p>
              </div>
            );
          })}
        </ul>
      </CardContent>
      <CardActions>
        <Button
          value={recipe.id}
          variant='outlined'
          color='primary'
          onClick={() => {
            editRecipe(recipe);
          }}
        >
          Edit
        </Button>
        <Button
          value={recipe.id}
          variant='outlined'
          color='secondary'
          onClick={deleteRecipe}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default AdminRecipeCard;
