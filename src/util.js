function getCurrentStyle(el){
    return el.currentStyle? el.currentStyle : window.getComputedStyle(el, null)
}

export function getInnerWidth(el) {
    const { clientWidth } = el;
    const { paddingLeft, paddingRight } = getCurrentStyle(el);
    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

export function getInnerHeight(el) {
    const { clientHeight } = el;
    const { paddingTop, paddingBottom } = getCurrentStyle(el);
    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

export default {
    getInnerHeight,
    getInnerWidth
}