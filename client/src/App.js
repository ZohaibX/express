import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ImageUpload from './multer/image-upload';

function App() {
  return (
    <Switch>
      <Route path='/' component={ImageUpload}></Route>
    </Switch>
  );
}
export default App;
