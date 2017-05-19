import React from 'react';
import { render } from 'react-dom';
// import Scrollbar from 'react-scrollbar-ie8';
import 'react-scrollbar-ie8/scrollbar.css'

render(
  <div style={
      {
          width: '100%',
          height: 100
      }
  }>
      <div style={{
          height: 1000
      }}>
          123
      </div>
  </div>,
  document.getElementById('app')
);

