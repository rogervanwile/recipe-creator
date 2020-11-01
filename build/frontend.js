/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/frontend.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/frontend.js":
/*!*************************!*\
  !*** ./src/frontend.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener("DOMContentLoaded", function () {
  var ratingElements = document.querySelectorAll(".recipe-manager-pro--block--rating.recipe-manager-pro--block--interactive");

  var storeRatingInDatabase = function storeRatingInDatabase(postId, rating) {
    fetch(RecipeManagerPro.config.ajaxUrl, {
      method: "POST",
      body: new URLSearchParams({
        _ajax_nonce: RecipeManagerPro.config.nonce,
        action: "recipe_manager_pro_set_rating",
        postId: postId,
        rating: rating
      })
    }).then(function (response) {
      if (response === 0 || response.status === 400) {
        return;
      }

      response.json().then(function (responseData) {
        if (responseData && responseData.data && responseData.data.averageRating) {
          var averageVotingElement = document.querySelector('[data-post-id="' + postId + '"] .recipe-manager-pro--block--average-voting');

          if (averageVotingElement) {
            averageVotingElement.innerHTML = responseData.data.averageRating;
          }
        }
      });
    }).catch(function (error) {
      console.error(error);
    });
  };

  var markAsSelected = function markAsSelected(selectedStarElement) {
    var foundItem = false;

    var _iterator = _createForOfIteratorHelper(selectedStarElement.parentElement.children),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var element = _step.value;

        if (element === selectedStarElement) {
          element.classList.add("selected");
          foundItem = true;
        } else if (!foundItem) {
          element.classList.add("selected");
        } else if (foundItem) {
          element.classList.remove("selected");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  if (ratingElements) {
    ratingElements.forEach(function (ratingElement) {
      var postId = ratingElement.getAttribute("data-post-id");
      var savedRating = window.localStorage.getItem("recipe-manager-pro::" + postId);

      if (!savedRating) {
        ratingElement.querySelectorAll(".recipe-manager-pro--block--star").forEach(function (starElement) {
          starElement.addEventListener("click", function (event) {
            markAsSelected(starElement);
            var rating = starElement.getAttribute("data-rating"); // To show the users vote and prevent multiple votes

            window.localStorage.setItem("recipe-manager-pro::" + postId, rating);
            storeRatingInDatabase(postId, rating);
          });
        });
      } else {
        try {
          // Hide the user rating section if the user has already voted.
          ratingElement.closest(".recipe-manager-pro--block--user-rating").style.display = "none";
        } catch (e) {
          console.error(e);
          debugger;
        } // ratingElement.classList.remove(
        //   "recipe-manager-pro--block--interactive"
        // );
        // var selectedStarElement = ratingElement.querySelector(
        //   '.recipe-manager-pro--block--star[data-rating="' + savedRating + '"]'
        // );
        // if (selectedStarElement) {
        //   markAsSelected(selectedStarElement);
        // }

      }
    });
  }

  var servings = null;
  var ingredientsTable = null;
  var shrinkButton = null;
  var increaseButton = null;
  var servingsDisplay = null; // Servings calculator

  var initServingCalculator = function initServingCalculator() {
    var servingsEditorElement = document.querySelector(".recipe-manager-pro--block--servings-editor");
    ingredientsTable = document.querySelector(".recipe-manager-pro--block--ingredients");

    if (servingsEditorElement) {
      shrinkButton = servingsEditorElement.querySelector(".recipe-shrink-servings");
      increaseButton = servingsEditorElement.querySelector(".recipe-increase-servings");
      servingsDisplay = servingsEditorElement.querySelector(".recipe-servings");

      if (servingsDisplay) {
        servings = parseInt(servingsDisplay.innerHTML.trim(), 10);

        if (shrinkButton) {
          shrinkButton.addEventListener("click", function () {
            if (servings > 1) {
              servings--;
              refreshServingsDisplay();
              refreshIngredients();
            }
          });
        }

        if (increaseButton) {
          increaseButton.addEventListener("click", function () {
            servings++;
            refreshServingsDisplay();
            refreshIngredients();
          });
        }
      }
    }
  };

  var refreshServingsDisplay = function refreshServingsDisplay() {
    servingsDisplay.innerText = servings;
  };

  var refreshIngredients = function refreshIngredients() {
    if (ingredientsTable) {
      ingredientsTable.querySelectorAll("tr .recipe-manager-pro--block--amount").forEach(function (amountElement) {
        var baseAmount = parseFloat(amountElement.getAttribute("data-recipe-base-amount"), 10);
        var baseUnit = amountElement.getAttribute("data-recipe-base-unit");

        if (baseAmount) {
          var amount = baseAmount * servings;
          var unit = baseUnit; // TODO: Umrechnen ^^

          if (amount >= 1000) {
            switch (unit) {
              case "g":
                unit = "kg";
                amount = amount / 1000;
                break;

              case "ml":
                unit = "l";
                amount = amount / 1000;
                break;
            }
          }

          var formattedAmount = amount;

          try {
            formattedAmount = new Intl.NumberFormat("de-DE").format(amount);
          } catch (e) {}

          if (amountElement) {
            amountElement.innerText = formattedAmount + " " + unit;
          }
        }
      });
    }
  };

  initServingCalculator();
});

/***/ })

/******/ });
//# sourceMappingURL=frontend.js.map