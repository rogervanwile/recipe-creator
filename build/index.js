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


/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */

var recipeManagerProMigrationDone = false;
function Edit(props) {
  // Workaround for https://github.com/WordPress/gutenberg/issues/7342
  if (!recipeManagerProMigrationDone) {
    var cleanedDefaultData = {};
    Object.keys(props.attributes).forEach(function (key) {
      cleanedDefaultData[key] = props.attributes[key].replace("::STORE_DEFAULT_VALUE_HACK", "");
    });
    props.setAttributes(cleanedDefaultData);
    recipeManagerProMigrationDone = true;
  }

  var ALLOWED_MEDIA_TYPES = ["image"];
  var categoryOptions = [Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Breakfast", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Bread", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Appetizers & Snacks", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Salads", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Soups & Stews", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Main Dishes", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Side Dishes", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Desserts", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Drinks", "recipe-manager-pro"), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Sweets", "recipe-manager-pro")].map(function (value) {
    return {
      label: value,
      value: value
    };
  });
  categoryOptions.unshift({
    value: null,
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Select a category", "recipe-manager-pro"),
    disabled: true
  });

  function updateTime(settingKey, value) {
    var prepTime = parseInt(props.attributes.prepTime, 10) || 0;
    var restTime = parseInt(props.attributes.restTime, 10) || 0;
    var cookTime = parseInt(props.attributes.cookTime, 10) || 0;
    var update = {};

    switch (settingKey) {
      case "prepTime":
        prepTime = parseInt(value, 10);
        update["prepTime"] = prepTime;
        break;

      case "restTime":
        restTime = parseInt(value, 10);
        update["restTime"] = restTime;
        break;

      case "cookTime":
        cookTime = parseInt(value, 10);
        update["cookTime"] = cookTime;
        break;
    }

    update["totalTime"] = prepTime + restTime + cookTime;
    props.setAttributes(update);
  }

  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: props.className
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "container"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-6"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "h2",
    value: props.attributes.name,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Title of your recipe", "kantina-delicacy-plugin"),
    onChange: function onChange(name) {
      props.setAttributes({
        name: name
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "p",
    value: props.attributes.description,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Short description of your recipe", "kantina-delicacy-plugin"),
    onChange: function onChange(description) {
      props.setAttributes({
        description: description
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "components-base-control__field"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("label", {
    className: "components-base-control__label"
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Difficulty", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadioGroup"], {
    onChange: function onChange(difficulty) {
      return props.setAttributes({
        difficulty: difficulty
      });
    },
    checked: props.attributes.difficulty
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadio"], {
    value: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Simple", "recipe-manager-pro")
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Simple", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadio"], {
    value: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Moderate", "kantina-delicacy-plugin")
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Moderate", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["__experimentalRadio"], {
    value: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Challenging", "kantina-delicacy-plugin")
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Challenging", "kantina-delicacy-plugin"))))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-6"
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
    render: function render(_ref) {
      var open = _ref.open;
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
        src: props.attributes.image4_3,
        className: "img-fluid mb-4 d-block mx-auto",
        onClick: open
      });
    }
  })))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row icon-row"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "meta-with-icon"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Prep time", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
    src: "https://placehold.it/64x64",
    width: "64",
    height: "64"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    type: "number",
    min: "0",
    value: props.attributes.prepTime,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("15", "kantina-delicacy-plugin"),
    onChange: function onChange(prepTime) {
      updateTime("prepTime", prepTime);
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.attributes.prepTimeUnit)))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "meta-with-icon"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Rest time", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
    src: "https://placehold.it/64x64",
    width: "64",
    height: "64"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    type: "number",
    min: "0",
    value: props.attributes.restTime,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("15", "kantina-delicacy-plugin"),
    onChange: function onChange(restTime) {
      updateTime("restTime", restTime);
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.attributes.restTimeUnit)))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "meta-with-icon"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Cook time", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
    src: "https://placehold.it/64x64",
    width: "64",
    height: "64"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    type: "number",
    min: "0",
    value: props.attributes.cookTime,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("15", "kantina-delicacy-plugin"),
    onChange: function onChange(cookTime) {
      updateTime("cookTime", cookTime);
    }
  }), " ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.attributes.cookTimeUnit)))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "meta-with-icon"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Total time", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
    src: "https://placehold.it/64x64",
    width: "64",
    height: "64"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.attributes.totalTime), "\xA0", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, props.attributes.totalTimeUnit)))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "meta-with-icon"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Yield", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
    src: "https://placehold.it/64x64",
    width: "64",
    height: "64"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    type: "number",
    min: "0",
    value: props.attributes.recipeYield,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("4", "kantina-delicacy-plugin"),
    onChange: function onChange(recipeYield) {
      props.setAttributes({
        recipeYield: recipeYield
      });
    }
  }), " ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("piece", "kantina-delicacy-plugin"))))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "meta-with-icon"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("header", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Servings", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
    src: "https://placehold.it/64x64",
    width: "64",
    height: "64"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    type: "number",
    min: "0",
    value: props.attributes.servings,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("4", "kantina-delicacy-plugin"),
    onChange: function onChange(servings) {
      props.setAttributes({
        servings: servings
      });
    }
  }), " ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("servings", "kantina-delicacy-plugin"))))))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Ingredients", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "ul",
    multiline: "li",
    className: "recipe-ingredients-list",
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Add the ingredients here...", "recipe-manager-pro"),
    value: props.attributes.ingredients,
    onChange: function onChange(ingredients) {
      return props.setAttributes({
        ingredients: ingredients
      });
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Steps of preparation", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "ol",
    multiline: "li",
    className: "recipe-preparation-steps-list",
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Add the steps of preparation here...", "recipe-manager-pro"),
    value: props.attributes.preparationSteps,
    onChange: function onChange(preparationSteps) {
      return props.setAttributes({
        preparationSteps: preparationSteps
      });
    }
  }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Notes", "kantina-delicacy-plugin")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__["RichText"], {
    tagName: "p",
    value: props.attributes.notes,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Additional notes ...", "kantina-delicacy-plugin"),
    onChange: function onChange(notes) {
      props.setAttributes({
        notes: notes
      });
    }
  }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, "Nutrition"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("p", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("em", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Please provide the incredients related to the given servings, so this plugin cna calculate the nutrion automatically.", "recipe-manager-pro"))))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, "Video")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Video-URL", "recipe-manager-pro"),
    value: props.attributes.videoUrl,
    type: "number",
    onChange: function onChange(videoUrl) {
      return props.setAttributes({
        videoUrl: videoUrl
      });
    }
  }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row seo-section"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("SEO", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("p", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Google and other search enginges needs some more informations to process your recipe. These informations are not visible to your user, but will have impact on the ranking of your recipe in search engines. So we recommend to provide all these informations.", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-4"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Cuisine", "recipe-manager-pro"),
    value: props.attributes.recipeCuisine,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])('e.g. "Italian" or "German"', "recipe-manager-pro"),
    onChange: function onChange(recipeCuisine) {
      props.setAttributes({
        recipeCuisine: recipeCuisine
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-4"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["SelectControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Category", "recipe-manager-pro"),
    value: props.attributes.recipeCategorys,
    options: categoryOptions,
    onChange: function onChange(recipeCategory) {
      return props.setAttributes({
        recipeCategory: recipeCategory
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-4"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["TextControl"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Keywords", "recipe-manager-pro"),
    value: props.attributes.keywords,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("quick & easy, vegetarian", "kantina-delicacy-plugin"),
    onChange: function onChange(keywords) {
      props.setAttributes({
        keywords: keywords
      });
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h4", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Picture of the finished dish", "recipe-manager-pro")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("p", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("You should add 3 pictures in different aspect ratios to this recipe to have a change for a more prominent display in the Google search results. The 16:9 or sometimes the 4:3 aspect ratio is used for the featured snipped. If you provide a square image, Google sometimes display it in your search result.", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
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
  }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "seo-preview"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "row"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h5", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Previews", "recipe-manager-pro"))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-12"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", {
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
    render: function render(_ref5) {
      var open = _ref5.open;
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
  }, "Titel des Blogs"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--rating"
  }, "4,7", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
    className: "features-snipped-preview--stars"
  }), "(199)"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--total-time"
  }, "30 Min.")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", {
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
    render: function render(_ref6) {
      var open = _ref6.open;
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
  }, "Titel des Blogs"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--rating"
  }, "4,7", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
    className: "features-snipped-preview--stars"
  }), "(199)"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-snipped-preview--total-time"
  }, "30 Min."))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "col-8"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("section", {
    className: "features-result-preview"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-result-preview--url"
  }, "www.chefkoch.de", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
    className: "features-result-preview--breadcrumb"
  }, "\u203A ... \u203A Kategorien \u203A Men\xFCart \u203A Dessert")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", {
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
  }, " ", "08.05.2002 \u2014", " "), "franz\xF6sische, hauchd\xFCnne Pfannkuchen. \xDCber 667 Bewertungen und f\xFCr schmackhaft befunden. Mit \u25BB Portionsrechner \u25BB Kochbuch\xA0..."), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "features-result-preview--meta"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
    className: "features-result-preview--rating"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, "Bewertung: 4,7"), " \xB7 \u200E", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, "667 Ergebnisse"), " \xB7 \u200E", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, "30 Min."), " \xB7 \u200E", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, "Kalorien: 163"))))))))))));
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
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/block/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/block/edit.js");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */



/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */


/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

Object(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__["registerBlockType"])("recipe-manager-pro/block", {
  /**
   * This is the display title for your block, which can be translated with `i18n` functions.
   * The block inserter will show this name.
   */
  title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Recipe Block", "recipe-manager-pro"),

  /**
   * This is a short description for your block, can be translated with `i18n` functions.
   * It will be shown in the Block Tab in the Settings Sidebar.
   */
  description: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])("Manage recipes and optimize them automatically for Google Featured Snippets.", "recipe-manager-pro"),

  /**
   * Blocks are grouped into categories to help users browse and discover them.
   * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
   */
  category: "formatting",

  /**
   * An icon property should be specified to make it easier to identify a block.
   * These can be any of WordPress’ Dashicons, or a custom svg element.
   */
  icon: "carrot",

  /**
   * Optional block extended support features.
   */
  supports: {
    // Removes support for an HTML mode.
    html: false,
    align: ['center', 'wide', 'full']
  },

  /**
   * @see ./edit.js
   */
  edit: Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__["withSelect"])(function (select) {
    console.log('withSelect');
    return {
      data: {
        foo: "bar"
      }
    };
  })(_edit__WEBPACK_IMPORTED_MODULE_4__["default"]),

  /**
   * @see ./save.js
   */
  save: function save(props) {
    console.log('props', props);
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