import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NoMatch from '../components/NoMatch.jsx';
import Home from '../components/Home.jsx';
import ProtectedRoute from '../components/routes/ProtectedRoute.jsx';
import Unauthorized from '../components/Unauthorized.jsx';
import Recipes from '../components/recipes/Recipes.jsx';
import AdminPage from '../components/admin/AdminPage.jsx';

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <ProtectedRoute authenticatedRoles={['admin', 'user']} path='/recipe'>
        <Recipes />
      </ProtectedRoute>
      <ProtectedRoute authenticatedRoles={['admin']} path='/adminPage'>
        <AdminPage />
      </ProtectedRoute>
      <ProtectedRoute authenticatedRoles={['admin', 'user']} path='/scrape'>
        <NoMatch />
      </ProtectedRoute>
      <Route path='/unauthorized'>
        <Unauthorized />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  );
};

export default Routes;
