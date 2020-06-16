import React from 'react';
import { Card, CardContent, CardActions, Button } from '@material-ui/core';
const RecipeCard = ({ recipe }) => {
  return (
    <Card>
      <CardContent>
        <h1>Recipe: {recipe.id}</h1>
        <p>Directions: {recipe.directions}</p>
        <p>{recipe.preparationTime} mins</p>
      </CardContent>
      <CardActions>
        <Button size='small'>Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
