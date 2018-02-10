export const containerStyleDefault = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
};

export const viewStyleDefault = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch'
};

const trackStyleDefault = {
    position: 'absolute',
    right: 2,
    bottom: 2,
    left: 2,
    borderRadius: 3,
    background: '#eee',
};

export const trackVerticalStyleDefault = {
    ...trackStyleDefault,
};

export const trackHorizontalStyleDefault = {
};

export const thumbStyleDefault = {
    position: 'relative',
    display: 'block',
    height: '100%',
    cursor: 'pointer',
    borderRadius: 'inherit',
    backgroundColor: 'rgba(0,0,0,.2)',
    background: '#ccc', // IE8
    transform: 'translateZ(0)'
};

export const disableSelectStyle = {
    userSelect: 'none'
};

export const disableSelectStyleReset = {
    userSelect: ''
};
