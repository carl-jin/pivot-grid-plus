/**
 * DevExtreme (esm/core/dom_adapter.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import injector from "./utils/dependency_injector";
import {
    noop
} from "./utils/common";
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var DOCUMENT_NODE = 9;
var nativeDOMAdapterStrategy = {
    querySelectorAll: (element, selector) => element.querySelectorAll(selector),
    elementMatches(element, selector) {
        var matches = element.matches || element.matchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector || (selector => {
            var doc = element.document || element.ownerDocument;
            if (!doc) {
                return false
            }
            var items = this.querySelectorAll(doc, selector);
            for (var i = 0; i < items.length; i++) {
                if (items[i] === element) {
                    return true
                }
            }
        });
        return matches.call(element, selector)
    },
    createElement(tagName, context) {
        context = context || this._document;
        return context.createElement(tagName)
    },
    createElementNS(ns, tagName, context) {
        context = context || this._document;
        return context.createElementNS(ns, tagName)
    },
    createTextNode(text, context) {
        context = context || this._document;
        return context.createTextNode(text)
    },
    isNode: element => element && "object" === typeof element && "nodeType" in element && "nodeName" in element,
    isElementNode: element => element && element.nodeType === ELEMENT_NODE,
    isTextNode: element => element && element.nodeType === TEXT_NODE,
    isDocument: element => element && element.nodeType === DOCUMENT_NODE,
    removeElement(element) {
        var parentNode = element && element.parentNode;
        if (parentNode) {
            parentNode.removeChild(element)
        }
    },
    insertElement(parentElement, newElement, nextSiblingElement) {
        if (parentElement && newElement && parentElement !== newElement) {
            if (nextSiblingElement) {
                parentElement.insertBefore(newElement, nextSiblingElement)
            } else {
                parentElement.appendChild(newElement)
            }
        }
    },
    getAttribute: (element, name) => element.getAttribute(name),
    setAttribute(element, name, value) {
        element.setAttribute(name, value)
    },
    removeAttribute(element, name) {
        element.removeAttribute(name)
    },
    setProperty(element, name, value) {
        element[name] = value
    },
    setText(element, text) {
        if (element) {
            element.textContent = text
        }
    },
    setClass(element, className, isAdd) {
        if (1 === element.nodeType && className) {
            if (element.classList) {
                if (isAdd) {
                    element.classList.add(className)
                } else {
                    element.classList.remove(className)
                }
            } else {
                var classNameSupported = "string" === typeof element.className;
                var elementClass = classNameSupported ? element.className : this.getAttribute(element, "class") || "";
                var classNames = elementClass.split(" ");
                var classIndex = classNames.indexOf(className);
                var resultClassName;
                if (isAdd && classIndex < 0) {
                    resultClassName = elementClass ? elementClass + " " + className : className
                }
                if (!isAdd && classIndex >= 0) {
                    classNames.splice(classIndex, 1);
                    resultClassName = classNames.join(" ")
                }
                if (void 0 !== resultClassName) {
                    if (classNameSupported) {
                        element.className = resultClassName
                    } else {
                        this.setAttribute(element, "class", resultClassName)
                    }
                }
            }
        }
    },
    setStyle(element, name, value) {
        element.style[name] = value || ""
    },
    _document: "undefined" === typeof document ? void 0 : document,
    getDocument() {
        return this._document
    },
    getActiveElement() {
        return this._document.activeElement
    },
    getBody() {
        return this._document.body
    },
    createDocumentFragment() {
        return this._document.createDocumentFragment()
    },
    getDocumentElement() {
        return this._document.documentElement
    },
    getLocation() {
        return this._document.location
    },
    getSelection() {
        return this._document.selection
    },
    getReadyState() {
        return this._document.readyState
    },
    getHead() {
        return this._document.head
    },
    hasDocumentProperty(property) {
        return property in this._document
    },
    listen(element, event, callback, options) {
        if (!element || !("addEventListener" in element)) {
            return noop
        }
        element.addEventListener(event, callback, options);
        return () => {
            element.removeEventListener(event, callback)
        }
    }
};
export default injector(nativeDOMAdapterStrategy);
