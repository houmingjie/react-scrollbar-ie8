import React from 'react';
import { render } from 'react-dom';
import Scrollbar from 'Scrollbar';

render(
  <Scrollbar 
    style={
        {
            width: '100%',
            height:300,
            background:"#438bca"
        }
    }
    thumbStyle={
        {   
            background:"#bbb"
        }
    }
    trackStyle={
        {
            background:"#eee",
            width:8
        }
    }
  >
      <div style={{
          height: 1000
      }}>
          <p>

          </p>
      </div>
  </Scrollbar>,
  document.getElementById('app')
);

