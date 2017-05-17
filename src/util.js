function getCurrentStyle(el) {
    return el.currentStyle || window.getComputedStyle(el, null);
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


const isSupport = !!document.addEventListener;

/**
 * addEventlistener兼容函数
 * ie9以上正常使用addEventlistener函数
 * ie7、ie8用传递的function的function.prototype._bindFun储存经过处理的事件和对应的节点
 * function.prototype._bindFun[index].type：绑定的事件类型
 * function.prototype._bindFun[index].element：绑定的节点
 * function.prototype._bindFun[index].handler：处理的事件
 */

/** addEventlistener **/
export const addListener = (() => {
    if (isSupport) {
        /* ie9以上正常使用addEventListener */
        return function (element, type, fun, useCapture) {
            element.addEventListener(type, fun, useCapture || false);
        };
    }
    /* ie7、ie8使用attachEvent */
    return function (element, type, fun) {
        if (!fun.prototype._bindFun) {
            fun.prototype._bindFun = [];
        }
        // 判断当前的element是否已经绑定过该事件
        let s = true;
        for (const i in fun.prototype._bindFun) {
            if (fun.prototype._bindFun[i].type === type && fun.prototype._bindFun[i].element === element) {
                s = false;
                break;
            }
        }
        // 没有绑定事件
        if (s === true) {
            const f = {
                type,
                element,
                handler: function handler(event) {
                    fun.call(element, event);
                }
            };
            fun.prototype._bindFun.push(f);
            element.attachEvent(`on${type}`, f.handler);
        }
    };
})();

/** removeEventlistener **/
export const removeListener = (() => {
    if (isSupport) {
        /* ie9以上正常使用removeEventListener */
        return function (element, type, fun) {
            element.removeEventListener(type, fun);
        };
    }
    /* ie7、ie8使用detachEvent */
    return function (element, type, fun) {
        for (const i in fun.prototype._bindFun) {
            if (fun.prototype._bindFun[i].type === type && fun.prototype._bindFun[i].element === element) {
                element.detachEvent(`on${type}`, fun.prototype._bindFun[i].handler);
                fun.prototype._bindFun.splice(i, 1);
                break;
            }
        }
    };
})();


export default {
    getInnerHeight,
    getInnerWidth,
    addListener,
    removeListener
};
