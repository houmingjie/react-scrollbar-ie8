import React from 'react';
import { render } from 'react-dom';
import Scrollbar from 'Scrollbar';

render(
  <Scrollbar 
    style={
        {
            width: '100%',
            height:600,
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
          height: 2000,
          padding:20
      }}>
        <Scrollbar 
            style={
                {
                    width: '100%',
                    height:300,
                    background:"#141"
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
                
            </div>
        </Scrollbar>
      </div>
  </Scrollbar>,
  document.getElementById('app')
);

