import React from 'react';
import {render} from 'react-dom';
import Scrollbar from '../src/index';

render(
    <Scrollbar
        style={
            {
                width: '100%',
                height: 600,
                background: "#438bca"
            }
        }
        thumbStyle={
            {
                width:8
            }
        }
        trackStyle={
            {
                width:8
            }
        }
    >
        <div style={{
            height: 2000,
            padding: 20
        }}>
            <Scrollbar
                style={
                    {
                        width: '100%',
                        height: 300,
                        background: "#3ffb3f"
                    }
                }
                thumbStyle={
                    {
                        background: "#bbb"
                    }
                }
                trackStyle={
                    {
                        background: "#eee",
                    }
                }
            >
                <div style={{
                    height: 1000
                }}>
                    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                </div>
            </Scrollbar>
        </div>
    </Scrollbar>,
    document.getElementById('app')
);

