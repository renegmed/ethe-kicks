webpackHotUpdate(4,{

/***/ "./ethereum/web3.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_web3__ = __webpack_require__("./node_modules/web3/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_web3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_web3__);
 //const web3 = new Web3(window.web3.currentProvider);  
// NOTE: using this, window would not be available in nodejs since window object is on the server side. 
// The solution below would check if the user is using a browser with metamask installed so it can grab the web3

var web3; // let -to be able to reassign this variable

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // executed in a browser and metamask installed in a browser
  // We are in the browser and metamask is running.
  web3 = new __WEBPACK_IMPORTED_MODULE_0_web3___default.a(window.web3.currentProvider);
} else {
  // We are on the server OR the user is not running metamask
  var provider = new __WEBPACK_IMPORTED_MODULE_0_web3___default.a.providers.HttpProvider('https://rinkeby.infura.io/v3/79a18556aa274a0a9a5ee7304da13e34' //'URL OF INFURA HERE'
  );
  web3 = new __WEBPACK_IMPORTED_MODULE_0_web3___default.a(provider);
}

/* harmony default export */ __webpack_exports__["a"] = (web3);

/***/ })

})
//# sourceMappingURL=4.a6faa1dfd0c818ff9f33.hot-update.js.map