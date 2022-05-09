
import React from 'react';
import './App.css';
import { ImageZoom } from './components/ImageZoom';
import computer from './image.jpg'

function App() {
  const [isActive, setIsActive] = React.useState(false);

  const onClose = () => {
    setIsActive(false);
  };

  const onZoom = () => {
    setIsActive(true);
  };

  return (
    <div className="imageContainer">
      <ImageZoom
        isActive={isActive}
        imageURL={
          computer
        }
        onZoom={onZoom}
        onClose={onClose}
      />
      {/* <div id="lens"></div>
      <img id="featured" src={computer} /> */}
    </div>
  );
}

export default App;
