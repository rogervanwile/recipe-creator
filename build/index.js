(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["style-index"],{

/***/ "./src/blocks/block/style.scss":
/*!*************************************!*\
  !*** ./src/blocks/block/style.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

}]);

/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"index": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/index.js","style-index"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/blocks/block/edit.js":
/*!**********************************!*\
  !*** ./src/blocks/block/edit.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Edit; });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/block/editor.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_editor_scss__WEBPACK_IMPORTED_MODULE_4__);






var recipeManagerProMigrationDone = false;
function Edit(props) {
  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!recipeManagerProMigrationDone) {
    var cleanedDefaultData = {};
    Object.keys(props.attributes).forEach(function (key) {
      if (typeof props.attributes[key] === "string" && props.attributes[key].indexOf("::STORE_DEFAULT_VALUE_HACK") !== -1) {
        cleanedDefaultData[key] = props.attributes[key].replace("::STORE_DEFAULT_VALUE_HACK", "");
      } else if (typeof props.attributes[key] === "string" && props.attributes[key].indexOf("::STORE_DEFAULT_VALUE_NUMBER_HACK") !== -1) {
        cleanedDefaultData[key] = parseInt(props.attributes[key].replace("::STORE_DEFAULT_VALUE_NUMBER_HACK", ""), 10);
      } else {
        cleanedDefaultData[key] = props.attributes[key];
      }
    });
    recipeManagerProMigrationDone = true;
    props.setAttributes(cleanedDefaultData);
  }

  if (props.attributes.servings) {
    if (!props.attributes.recipeYield) {
      props.setAttributes({
        recipeYield: props.attributes.servings,
        recipeYieldUnit: "servings",
        servings: ""
      });
    } else {
      props.setAttributes({
        servings: "",
        recipeYieldUnit: "piece"
      });
    }
  }

  if (props.attributes.recipeYield && !props.attributes.recipeYieldUnit) {
    props.setAttributes({
      recipeYieldUnit: "piece"
    });
  }

  var ALLOWED_MEDIA_TYPES = ["image"];
  var categoryOptions = [Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Breakfast", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Bread", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Appetizers & Snacks", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Salads", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Soups & Stews", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Main Dishes", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Side Dishes", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Desserts", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Drinks", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Sweets", "recipe-manager-pro")].map(function (value) {
    return {
      label: value,
      value: value
    };
  });
  categoryOptions.unshift({
    value: '',
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Select a category", "recipe-manager-pro")
  });
  var recipeYieldUnitOptions = [{
    value: "servings",
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("servings", "recipe-manager-pro")
  }, {
    value: "piece",
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("piece", "recipe-manager-pro")
  }];

  function updateTime(settingKey, value) {
    var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var prepTime = parseInt(props.attributes.prepTime, 10) || 0;
    var restTime = parseInt(props.attributes.restTime, 10) || 0;
    var cookTime = parseInt(props.attributes.cookTime, 10) || 0;
    var intValue = parseInt(value, 10);

    if (!isNaN(intValue)) {
      switch (settingKey) {
        case "prepTime":
          prepTime = intValue;
          update["prepTime"] = "" + prepTime;
          break;

        case "restTime":
          restTime = intValue;
          update["restTime"] = "" + restTime;
          break;

        case "cookTime":
          cookTime = intValue;
          update["cookTime"] = "" + cookTime;
          break;
      }

      update["totalTime"] = "" + (prepTime + restTime + cookTime);
      props.setAttributes(update);
    }
  }

  function getRatedStarsWidth(averageRating) {
    if (averageRating) {
      return 65 / 5 * averageRating;
    } else {
      return 0;
    }
  }

  function getRatingElement() {
    if (props.data.meta.rating_count) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "features-snipped-preview--rating"
      }, props.data.meta.average_rating, "\xA0", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
        className: "features-snipped-preview--stars"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
        className: "features-snipped-preview--stars--rated",
        style: {
          width: getRatedStarsWidth(props.data.meta.average_rating) + "px"
        }
      })), "\xA0(", props.data.meta.rating_count, ")");
    } else {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "features-snipped-preview--rating"
      }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("No reviews", "recipe-manager-pro"));
    }
  }

  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["InspectorControls"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["PanelBody"], {
    title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Settings", "recipe-manager-pro")
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["PanelRow"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Timings", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["PanelRow"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["CheckboxControl"], {
    checked: props.attributes.showPrepTime,
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Show prep time", "recipe-manager-pro"),
    onChange: function onChange(showPrepTime) {
      updateTime("prepTime", 0, {
        showPrepTime: showPrepTime
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["PanelRow"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["CheckboxControl"], {
    checked: props.attributes.showRestTime,
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Show prep time", "recipe-manager-pro"),
    onChange: function onChange(showRestTime) {
      updateTime("restTime", 0, {
        showRestTime: showRestTime
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["PanelRow"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["CheckboxControl"], {
    checked: props.attributes.showCookTime,
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Show prep time", "recipe-manager-pro"),
    onChange: function onChange(showCookTime) {
      updateTime("cookTime", 0, {
        showCookTime: showCookTime
      });
    }
  })))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block " + props.className
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "h2",
    value: props.attributes.name,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Title of your recipe", "recipe-manager-pro"),
    onChange: function onChange(name) {
      props.setAttributes({
        name: name
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--intro"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadioGroup"], {
    onChange: function onChange(difficulty) {
      return props.setAttributes({
        difficulty: difficulty
      });
    },
    checked: props.attributes.difficulty
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadio"], {
    value: "simple"
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("simple", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadio"], {
    value: "moderate"
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("moderate", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadio"], {
    value: "challenging"
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("challenging", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "p",
    value: props.attributes.description,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Short description of your recipe", "recipe-manager-pro"),
    onChange: function onChange(description) {
      props.setAttributes({
        description: description
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUploadCheck"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUpload"], {
    onSelect: function onSelect(media) {
      if (media) {
        props.setAttributes({
          image4_3: media.url
        });
      }
    },
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: props.attributes.image4_3,
    render: function render(_ref) {
      var open = _ref.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "recipe-manager-pro--block--main-image",
        style: {
          backgroundImage: "url(" + props.attributes.image4_3 + ")"
        },
        onClick: open
      });
    }
  })))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--timing-list"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("ul", null, function () {
    return props.attributes.showPrepTime ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Prep time", "recipe-manager-pro"), ":"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalInputControl"], {
      type: "number",
      min: "0",
      value: props.attributes.prepTime,
      placeholder: "0",
      onChange: function onChange(prepTime) {
        updateTime("prepTime", prepTime);
      },
      suffix: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Minutes", "recipe-manager-pro")
    }))) : null;
  }(), function () {
    return props.attributes.showRestTime ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Rest time", "recipe-manager-pro"), ":"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalInputControl"], {
      type: "number",
      min: "0",
      value: props.attributes.restTime,
      placeholder: "0",
      onChange: function onChange(restTime) {
        updateTime("restTime", restTime);
      },
      suffix: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Minutes", "recipe-manager-pro")
    }))) : null;
  }(), function () {
    return props.attributes.showCookTime ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Cook time", "recipe-manager-pro"), ":"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalInputControl"], {
      type: "number",
      min: "0",
      value: props.attributes.cookTime,
      placeholder: "0",
      onChange: function onChange(cookTime) {
        updateTime("cookTime", cookTime);
      },
      suffix: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Minutes", "recipe-manager-pro")
    }))) : null;
  }(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Total time", "recipe-manager-pro"), ":"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.attributes.totalTime, " ", Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Minutes", "recipe-manager-pro"))))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--headline"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Ingredients", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--flex-container"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Results in", "recipe-manager-pro"),
    type: "number",
    min: "0",
    value: props.attributes.recipeYield,
    placeholder: "0",
    onChange: function onChange(recipeYield) {
      props.setAttributes({
        recipeYield: recipeYield
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["SelectControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Unit", "recipe-manager-pro"),
    value: props.attributes.recipeYieldUnit,
    options: recipeYieldUnitOptions,
    onChange: function onChange(recipeYieldUnit) {
      return props.setAttributes({
        recipeYieldUnit: recipeYieldUnit
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "ul",
    multiline: "li",
    className: "recipe-manager-pro--block--ingredients",
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Add the ingredients here...", "recipe-manager-pro"),
    value: props.attributes.ingredients,
    onChange: function onChange(ingredients) {
      return props.setAttributes({
        ingredients: ingredients
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--headline"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Steps of preparation", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "ol",
    multiline: "li",
    className: "recipe-manager-pro--block--preparation-steps",
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Add the steps of preparation here...", "recipe-manager-pro"),
    value: props.attributes.preparationSteps,
    onChange: function onChange(preparationSteps) {
      return props.setAttributes({
        preparationSteps: preparationSteps
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--headline"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Notes", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "p",
    value: props.attributes.notes,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Additional notes ...", "recipe-manager-pro"),
    onChange: function onChange(notes) {
      props.setAttributes({
        notes: notes
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--headline"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Video", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Video-URL", "recipe-manager-pro"),
    value: props.attributes.videoUrl,
    type: "number",
    onChange: function onChange(videoUrl) {
      return props.setAttributes({
        videoUrl: videoUrl
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", {
    className: "seo-section"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--headline"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("SEO", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("p", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Google and other search enginges needs some more informations to process your recipe. These informations are not visible to your user, but will have impact on the ranking of your recipe in search engines. So we recommend to provide all these informations.", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "recipe-manager-pro--block--flex-container"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Cuisine", "recipe-manager-pro"),
    value: props.attributes.recipeCuisine,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])('e.g. "Italian" or "German"', "recipe-manager-pro"),
    onChange: function onChange(recipeCuisine) {
      props.setAttributes({
        recipeCuisine: recipeCuisine
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["SelectControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Category", "recipe-manager-pro"),
    value: props.attributes.recipeCategory,
    options: categoryOptions,
    onChange: function onChange(recipeCategory) {
      return props.setAttributes({
        recipeCategory: recipeCategory
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Keywords", "recipe-manager-pro"),
    value: props.attributes.keywords,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("quick & easy, vegetarian", "recipe-manager-pro"),
    onChange: function onChange(keywords) {
      props.setAttributes({
        keywords: keywords
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h4", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Picture of the finished dish", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("p", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("You should add 3 pictures in different aspect ratios to this recipe to have a change for a more prominent display in the Google search results. The 16:9 or sometimes the 4:3 aspect ratio is used for the featured snipped. If you provide a square image, Google sometimes display it in your search result.", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUploadCheck"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUpload"], {
    onSelect: function onSelect(media) {
      if (media) {
        props.setAttributes({
          image1_1: media.url
        });
      }
    },
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: props.attributes.image1_1,
    render: function render(_ref2) {
      var open = _ref2.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "image-preview image-preview-1-1",
        style: {
          backgroundImage: "url(" + props.attributes.image1_1 + ")"
        },
        onClick: open
      }, !props.attributes.image1_1 ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
        className: "aspect-ratio"
      }, "1:1") : "");
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUploadCheck"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUpload"], {
    onSelect: function onSelect(media) {
      if (media) {
        props.setAttributes({
          image4_3: media.url
        });
      }
    },
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: props.attributes.image4_3,
    render: function render(_ref3) {
      var open = _ref3.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "image-preview image-preview-4-3",
        style: {
          backgroundImage: "url(" + props.attributes.image4_3 + ")"
        },
        onClick: open
      }, !props.attributes.image4_3 ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
        className: "aspect-ratio"
      }, "4:3") : "");
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUploadCheck"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUpload"], {
    onSelect: function onSelect(media) {
      if (media) {
        props.setAttributes({
          image16_9: media.url
        });
      }
    },
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: props.attributes.image16_9,
    render: function render(_ref4) {
      var open = _ref4.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "image-preview image-preview-16-9",
        style: {
          backgroundImage: "url(" + props.attributes.image16_9 + ")"
        },
        onClick: open
      }, !props.attributes.image16_9 ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
        className: "aspect-ratio"
      }, "16:9") : "");
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h5", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Previews", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", {
    className: "features-snipped-preview"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUploadCheck"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUpload"], {
    onSelect: function onSelect(media) {
      if (media) {
        props.setAttributes({
          image4_3: media.url
        });
      }
    },
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: props.attributes.image4_3,
    render: function render(_ref5) {
      var open = _ref5.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "features-snipped-preview--image-wrapper features-snipped-preview--43",
        onClick: open
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "features-snipped-preview--image",
        style: {
          backgroundImage: "url(" + props.attributes.image4_3 + ")"
        }
      }));
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--title"
  }, props.attributes.name), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--blog-title"
  }, props.data.title), getRatingElement(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--total-time"
  }, props.attributes.totalTime, " Min.")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", {
    className: "features-snipped-preview"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUploadCheck"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUpload"], {
    onSelect: function onSelect(media) {
      if (media) {
        props.setAttributes({
          image16_9: media.url
        });
      }
    },
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: props.attributes.image16_9,
    render: function render(_ref6) {
      var open = _ref6.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "features-snipped-preview--image-wrapper",
        onClick: open
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "features-snipped-preview--image",
        style: {
          backgroundImage: "url(" + props.attributes.image16_9 + ")"
        }
      }));
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--title"
  }, props.attributes.name), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--blog-title"
  }, props.data.title), getRatingElement(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--total-time"
  }, props.attributes.totalTime, " Min.")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", {
    className: "features-result-preview"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", {
    className: "features-result-preview--headline"
  }, props.attributes.name), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-result-preview--image-text"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUploadCheck"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["MediaUpload"], {
    onSelect: function onSelect(media) {
      if (media) {
        props.setAttributes({
          image1_1: media.url
        });
      }
    },
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: props.attributes.image1_1,
    render: function render(_ref7) {
      var open = _ref7.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
        className: "features-result-preview--image",
        onClick: open,
        style: {
          backgroundImage: "url(" + props.attributes.image1_1 + ")"
        }
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-result-preview--text"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-result-preview--extract"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
    className: "features-result-preview--date"
  }, props.data.publishDate, " \u2014"), "\xA0Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec lectus gravida, sollicitudin velit sed, consectetur quam."), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-result-preview--meta"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
    className: "features-snipped-preview--stars"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
    className: "features-snipped-preview--stars--rated",
    style: {
      width: getRatedStarsWidth(props.data.meta.average_rating) + "px"
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, "\xA0", Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Rating", "recipe-manager-pro"), ":", " ", props.data.meta.average_rating), " ", "\xB7 \u200E", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.data.meta.rating_count, " ", Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("reviews", "recipe-manager-pro")), " ", "\xB7 \u200E", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.attributes.totalTime, " Min.")))))))));
}

/***/ }),

/***/ "./src/blocks/block/editor.scss":
/*!**************************************!*\
  !*** ./src/blocks/block/editor.scss ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/blocks/block/index.js":
/*!***********************************!*\
  !*** ./src/blocks/block/index.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/block/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit */ "./src/blocks/block/edit.js");






Object(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__["registerBlockType"])("recipe-manager-pro/block", {
  title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Recipe Block", "recipe-manager-pro"),
  description: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Manage recipes and optimize them automatically for Google Featured Snippets.", "recipe-manager-pro"),
  category: "formatting",
  icon: "carrot",
  supports: {
    // Removes support for an HTML mode.
    html: false,
    align: ["center", "wide", "full"]
  },
  edit: Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__["withSelect"])(function (select) {
    var site = select("core").getSite();
    var publishDate = Object(_wordpress_date__WEBPACK_IMPORTED_MODULE_3__["format"])("d.m.Y", wp.data.select("core/editor").getEditedPostAttribute("date"));
    return {
      data: {
        title: site ? site.title : null,
        publishDate: publishDate,
        meta: select("core/editor").getEditedPostAttribute("meta")
      }
    };
  })(_edit__WEBPACK_IMPORTED_MODULE_5__["default"]),
  save: function save(props) {
    return props;
  }
});

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blocks/block */ "./src/blocks/block/index.js");


/***/ }),

/***/ "@wordpress/block-editor":
/*!**********************************************!*\
  !*** external {"this":["wp","blockEditor"]} ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["blockEditor"]; }());

/***/ }),

/***/ "@wordpress/blocks":
/*!*****************************************!*\
  !*** external {"this":["wp","blocks"]} ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["blocks"]; }());

/***/ }),

/***/ "@wordpress/components":
/*!*********************************************!*\
  !*** external {"this":["wp","components"]} ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["components"]; }());

/***/ }),

/***/ "@wordpress/data":
/*!***************************************!*\
  !*** external {"this":["wp","data"]} ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["data"]; }());

/***/ }),

/***/ "@wordpress/date":
/*!***************************************!*\
  !*** external {"this":["wp","date"]} ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["date"]; }());

/***/ }),

/***/ "@wordpress/element":
/*!******************************************!*\
  !*** external {"this":["wp","element"]} ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["element"]; }());

/***/ }),

/***/ "@wordpress/i18n":
/*!***************************************!*\
  !*** external {"this":["wp","i18n"]} ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["i18n"]; }());

/***/ })

/******/ });
//# sourceMappingURL=index.js.map