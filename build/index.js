(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{8:function(e,t,c){}}]),function(e){function t(t){for(var i,l,a=t[0],o=t[1],s=t[2],u=0,p=[];u<a.length;u++)l=a[u],Object.prototype.hasOwnProperty.call(n,l)&&n[l]&&p.push(n[l][0]),n[l]=0;for(i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i]);for(b&&b(t);p.length;)p.shift()();return r.push.apply(r,s||[]),c()}function c(){for(var e,t=0;t<r.length;t++){for(var c=r[t],i=!0,a=1;a<c.length;a++){var o=c[a];0!==n[o]&&(i=!1)}i&&(r.splice(t--,1),e=l(l.s=c[0]))}return e}var i={},n={1:0},r=[];function l(t){if(i[t])return i[t].exports;var c=i[t]={i:t,l:!1,exports:{}};return e[t].call(c.exports,c,c.exports,l),c.l=!0,c.exports}l.m=e,l.c=i,l.d=function(e,t,c){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:c})},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var c=Object.create(null);if(l.r(c),Object.defineProperty(c,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)l.d(c,i,function(t){return e[t]}.bind(null,i));return c},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="";var a=window.webpackJsonp=window.webpackJsonp||[],o=a.push.bind(a);a.push=t,a=a.slice();for(var s=0;s<a.length;s++)t(a[s]);var b=o;r.push([10,2]),c()}([function(e,t){!function(){e.exports=this.wp.element}()},function(e,t){!function(){e.exports=this.wp.i18n}()},function(e,t){!function(){e.exports=this.wp.components}()},function(e,t){!function(){e.exports=this.wp.blockEditor}()},function(e,t,c){},function(e,t){!function(){e.exports=this.wp.blocks}()},function(e,t){!function(){e.exports=this.wp.data}()},function(e,t){!function(){e.exports=this.wp.date}()},,,function(e,t,c){"use strict";c.r(t);var i=c(5),n=c(1),r=c(6),l=c(7),a=(c(8),c(0)),o=c(2),s=c(3);c(4);function b(e){var t=e.props,c=e.keyName,i=e.label,r=e.className;return Object(a.createElement)(s.MediaUploadCheck,null,Object(a.createElement)(s.MediaUpload,{onSelect:function(e){if(e){var i={};i[c]=e.url,i[c+"Id"]=e.id,t.setAttributes(i)}},allowedTypes:["image"],value:t.attributes[c],render:function(e){var l=e.open;return Object(a.createElement)(a.Fragment,null,Object(a.createElement)("div",{className:"image-preview image-preview-"+r,style:{backgroundImage:"url("+t.attributes[c]+")"},onClick:l},t.attributes[c]?"":Object(a.createElement)("span",{className:"aspect-ratio"},i)),t.attributes[c]?Object(a.createElement)(a.Fragment,null,Object(a.createElement)(o.Button,{isSecondary:"true",onClick:l},Object(n.__)("Change image","foodblogkitchen-recipes")),Object(a.createElement)(o.Button,{onClick:function(){var e={};e[c]=null,e[c+"Id"]=null,t.setAttributes(e)}},Object(n.__)("Remove image","foodblogkitchen-recipes"))):Object(a.createElement)(o.Button,{isSecondary:"true",onClick:l},Object(n.__)("Select image","foodblogkitchen-recipes")))}}))}var u=!1;Object(i.registerBlockType)("foodblogkitchen-recipes/block",{title:Object(n.__)("Recipe","foodblogkitchen-recipes"),description:Object(n.__)("Create recipes and optimize them easily for search engines.","foodblogkitchen-recipes"),category:"formatting",icon:"carrot",supports:{html:!1,align:["center","wide","full"]},edit:foodblogkitchenRecipesAdditionalData.hasValidLicense?Object(r.withSelect)((function(e){var t=e("core").getSite(),c=Object(l.format)("d.m.Y",wp.data.select("core/editor").getEditedPostAttribute("date"));return{data:{title:t?t.title:null,publishDate:c,meta:e("core/editor").getEditedPostAttribute("meta")}}}))((function(e){if(!u){var t={};Object.keys(e.attributes).forEach((function(c){"string"==typeof e.attributes[c]&&-1!==e.attributes[c].indexOf("::STORE_DEFAULT_VALUE_HACK")?t[c]=e.attributes[c].replace("::STORE_DEFAULT_VALUE_HACK",""):"string"==typeof e.attributes[c]&&-1!==e.attributes[c].indexOf("::STORE_DEFAULT_VALUE_NUMBER_HACK")?t[c]=parseInt(e.attributes[c].replace("::STORE_DEFAULT_VALUE_NUMBER_HACK",""),10):t[c]=e.attributes[c]})),u=!0,e.setAttributes(t)}e.attributes.servings&&(e.attributes.recipeYield?e.setAttributes({servings:"",recipeYieldUnit:"piece"}):e.setAttributes({recipeYield:e.attributes.servings,recipeYieldUnit:"servings",servings:""})),e.attributes.recipeYield&&!e.attributes.recipeYieldUnit&&e.setAttributes({recipeYieldUnit:"piece"}),[Object(n.__)("Breakfast","foodblogkitchen-recipes"),Object(n.__)("Bread","foodblogkitchen-recipes"),Object(n.__)("Appetizers & Snacks","foodblogkitchen-recipes"),Object(n.__)("Salads","foodblogkitchen-recipes"),Object(n.__)("Soups & Stews","foodblogkitchen-recipes"),Object(n.__)("Main Dishes","foodblogkitchen-recipes"),Object(n.__)("Side Dishes","foodblogkitchen-recipes"),Object(n.__)("Desserts","foodblogkitchen-recipes"),Object(n.__)("Drinks","foodblogkitchen-recipes"),Object(n.__)("Sweets","foodblogkitchen-recipes")].map((function(e){return{label:e,value:e}})).unshift({value:"",label:Object(n.__)("Select a category","foodblogkitchen-recipes")});var c=[{value:"servings",label:Object(n.__)("servings","foodblogkitchen-recipes")},{value:"piece",label:Object(n.__)("piece","foodblogkitchen-recipes")}];function i(t,c){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=parseInt(e.attributes.prepTime,10)||0,r=parseInt(e.attributes.restTime,10)||0,l=parseInt(e.attributes.cookTime,10)||0,a=parseInt(c,10);if(!isNaN(a)){switch(t){case"prepTime":n=a,i.prepTime=""+n;break;case"restTime":r=a,i.restTime=""+r;break;case"cookTime":l=a,i.cookTime=""+l}i.totalTime=""+(n+r+l),e.setAttributes(i)}}function r(e){return e?13*e:0}return Object(a.createElement)(a.Fragment,null,Object(a.createElement)(s.InspectorControls,null,Object(a.createElement)(o.PanelBody,{title:Object(n.__)("SEO","foodblogkitchen-recipes"),className:"foodblogkitchen-recipes--sidebar"},Object(a.createElement)(o.PanelRow,null,Object(a.createElement)("p",null,Object(n.__)("Google and other search engines need more information to present your recipe in the best possible way. You should provide this information as good as possible.","foodblogkitchen-recipes"))),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)(o.TextControl,{label:Object(n.__)("Cuisine","foodblogkitchen-recipes"),value:e.attributes.recipeCuisine,placeholder:Object(n.__)('e.g. "Italian" or "German"',"foodblogkitchen-recipes"),onChange:function(t){e.setAttributes({recipeCuisine:t})}})),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)(o.TextControl,{type:"number",label:Object(n.__)("Calories","foodblogkitchen-recipes"),value:e.attributes.calories,description:Object(n.__)("Calories per serving or piece"),suffix:"kcal",onChange:function(t){e.setAttributes({calories:t})}})),Object(a.createElement)("hr",null),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)("h4",null,Object(n.__)("Picture of the finished dish","foodblogkitchen-recipes")),Object(a.createElement)("p",null,Object(n.__)("Depending on the usage Google uses different image formats of your recipe. You can find more information","foodblogkitchen-recipes")," ",Object(a.createElement)("a",{href:Object(n.__)("https://foodblogkitchen.de/mehr-klicks-durch-optimierte-rezeptbilder/","foodblogkitchen-recipes"),target:"_blank"},Object(n.__)("here","foodblogkitchen-recipes")),".")),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)(b,{props:e,keyName:"image3_2",label:"3:2",className:"3-2"})),Object(a.createElement)("hr",null),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)(b,{props:e,keyName:"image1_1",label:"1:1",className:"1-1"})),Object(a.createElement)("hr",null),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)(b,{props:e,keyName:"image4_3",label:"4:3",className:"4-3"})),Object(a.createElement)("hr",null),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)(b,{props:e,keyName:"image16_9",label:"16:9",className:"16-9"})),Object(a.createElement)("hr",null),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)("h3",null,Object(n.__)("Previews","foodblogkitchen-recipes")),Object(a.createElement)("h4",null,Object(n.__)("Featured Snippet","foodblogkitchen-recipes"))),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)("section",{className:"featured-snipped-preview"},Object(a.createElement)("div",{className:"featured-snipped-preview--image-wrapper"},Object(a.createElement)("div",{className:"featured-snipped-preview--image",style:{backgroundImage:"url("+e.attributes.image16_9+")"}})),Object(a.createElement)("div",{className:"featured-snipped-preview--title"},e.attributes.name),Object(a.createElement)("div",{className:"featured-snipped-preview--blog-title"},e.data.title),e.data.meta.rating_count?Object(a.createElement)("div",{className:"featured-snipped-preview--rating"},e.data.meta.average_rating," ",Object(a.createElement)("span",{className:"featured-snipped-preview--stars"},Object(a.createElement)("span",{className:"featured-snipped-preview--stars--rated",style:{width:r(e.data.meta.average_rating)+"px"}}))," (",e.data.meta.rating_count,")"):Object(a.createElement)("div",{className:"featured-snipped-preview--rating"},Object(n.__)("No reviews","foodblogkitchen-recipes")),Object(a.createElement)("div",{className:"featured-snipped-preview--total-time"},e.attributes.totalTime," Min."))),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)("h4",null,Object(n.__)("Mobile Search Result","foodblogkitchen-recipes"))),Object(a.createElement)(o.PanelRow,null,Object(a.createElement)("section",{className:"featured-result-preview-mobile"},Object(a.createElement)("header",{className:"featured-result-preview-mobile--header"},Object(a.createElement)("span",{className:"featured-result-preview-mobile--breadcrumb"},"www.domain.com"),Object(a.createElement)("h3",{className:"featured-result-preview-mobile--headline"},e.attributes.name)),Object(a.createElement)("div",{className:"featured-result-preview-mobile--image-text"},Object(a.createElement)("div",{className:"featured-result-preview-mobile--image",style:{backgroundImage:"url("+e.attributes.image1_1+")"}}),Object(a.createElement)("div",{className:"featured-result-preview-mobile--text"},Object(a.createElement)("div",{className:"featured-result-preview-mobile--extract"},"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec lectus gravida, sollicitudin velit sed, consectetur quam."))),Object(a.createElement)("div",{className:"featured-result-preview-mobile--footer"},Object(a.createElement)("div",{className:"featured-result-preview-mobile--rating-col"},Object(a.createElement)("header",null,Object(n.__)("Rating","foodblogkitchen-recipes")),Object(a.createElement)("p",null,Object(a.createElement)("span",null,e.data.meta.average_rating),Object(a.createElement)("span",{className:"featured-snipped-preview--stars"},Object(a.createElement)("span",{className:"featured-snipped-preview--stars--rated",style:{width:r(e.data.meta.average_rating)+"px"}})),Object(a.createElement)("span",null,"(",e.data.meta.rating_count,")")," ")),Object(a.createElement)("div",{className:"featured-result-preview-mobile--time-col"},Object(a.createElement)("header",null,Object(n.__)("Preparation","foodblogkitchen-recipes")),Object(a.createElement)("p",null,e.attributes.totalTime," Min."))))))),Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block "+e.className},Object(a.createElement)(s.RichText,{tagName:"h2",value:e.attributes.name,placeholder:Object(n.__)("Title of your recipe","foodblogkitchen-recipes"),onChange:function(t){e.setAttributes({name:t})}}),Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block--intro"},Object(a.createElement)("div",null,Object(a.createElement)("span",{className:"foodblogkitchen-recipes--block--difficulty"+("simple"!==e.attributes.difficulty?" unselected":""),onClick:function(){e.setAttributes({difficulty:"simple"})}},Object(n.__)("simple","foodblogkitchen-recipes")),Object(a.createElement)("span",{className:"foodblogkitchen-recipes--block--difficulty"+("moderate"!==e.attributes.difficulty?" unselected":""),onClick:function(){e.setAttributes({difficulty:"moderate"})}},Object(n.__)("moderate","foodblogkitchen-recipes")),Object(a.createElement)("span",{className:"foodblogkitchen-recipes--block--difficulty"+("challenging"!==e.attributes.difficulty?" unselected":""),onClick:function(){e.setAttributes({difficulty:"challenging"})}},Object(n.__)("challenging","foodblogkitchen-recipes")),Object(a.createElement)(s.RichText,{tagName:"p",value:e.attributes.description,placeholder:Object(n.__)("Short description of your recipe","foodblogkitchen-recipes"),onChange:function(t){e.setAttributes({description:t})}})),Object(a.createElement)("div",null,Object(a.createElement)(s.MediaUploadCheck,null,Object(a.createElement)(s.MediaUpload,{onSelect:function(t){t&&e.setAttributes({image3_2:t.url,image3_2Id:t.id})},allowedTypes:["image"],value:e.attributes.image3_2,render:function(t){var c=t.open;return Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block--main-image"+(e.attributes.image3_2?"":" foodblogkitchen-recipes--empty"),style:{backgroundImage:e.attributes.image3_2?"url("+e.attributes.image3_2+")":""},onClick:c})}})))),Object(a.createElement)("hr",null),Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block--timing-list"},Object(a.createElement)("ul",null,Object(a.createElement)("li",null,Object(a.createElement)("header",null,Object(n.__)("Prep time","foodblogkitchen-recipes"),":"),Object(a.createElement)("span",null,Object(a.createElement)(o.__experimentalInputControl,{type:"number",min:"0",value:e.attributes.prepTime,placeholder:"0",onChange:function(e){i("prepTime",e)},suffix:Object(n.__)("Minutes","foodblogkitchen-recipes")}))),Object(a.createElement)("li",null,Object(a.createElement)("header",null,Object(n.__)("Rest time","foodblogkitchen-recipes"),":"),Object(a.createElement)("span",null,Object(a.createElement)(o.__experimentalInputControl,{type:"number",min:"0",value:e.attributes.restTime,placeholder:"0",onChange:function(e){i("restTime",e)},suffix:Object(n.__)("Minutes","foodblogkitchen-recipes")}))),Object(a.createElement)("li",null,Object(a.createElement)("header",null,Object(n.__)("Cook time","foodblogkitchen-recipes"),":"),Object(a.createElement)("span",null,Object(a.createElement)(o.__experimentalInputControl,{type:"number",min:"0",value:e.attributes.cookTime,placeholder:"0",onChange:function(e){i("cookTime",e)},suffix:Object(n.__)("Minutes","foodblogkitchen-recipes")}))),Object(a.createElement)("li",null,Object(a.createElement)("header",null,Object(n.__)("Total time","foodblogkitchen-recipes"),":"),Object(a.createElement)("span",null,e.attributes.totalTime||"0"," ",Object(n.__)("Minutes","foodblogkitchen-recipes"))))),Object(a.createElement)("hr",null),Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block--headline"},Object(a.createElement)("h3",null,Object(n.__)("Ingredients","foodblogkitchen-recipes"))),Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block--flex-container"},Object(a.createElement)(o.__experimentalInputControl,{label:Object(n.__)("Results in","foodblogkitchen-recipes"),type:"number",min:"0",value:e.attributes.recipeYield,placeholder:"0",onChange:function(t){e.setAttributes({recipeYield:t})}}),Object(a.createElement)(o.SelectControl,{label:Object(n.__)("Unit","foodblogkitchen-recipes"),value:e.attributes.recipeYieldUnit,options:c,onChange:function(t){return e.setAttributes({recipeYieldUnit:t})}})),Object(a.createElement)(s.RichText,{tagName:"ul",multiline:"li",className:"foodblogkitchen-recipes--block--ingredients",placeholder:Object(n.__)("Add the ingredients here...","foodblogkitchen-recipes"),value:e.attributes.ingredients,onChange:function(t){return e.setAttributes({ingredients:t})}}),Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block--headline"},Object(a.createElement)("h3",null,Object(n.__)("Steps of preparation","foodblogkitchen-recipes"))),Object(a.createElement)(s.RichText,{tagName:"ol",multiline:"li",className:"foodblogkitchen-recipes--block--preparation-steps",placeholder:Object(n.__)("Add the steps of preparation here...","foodblogkitchen-recipes"),value:e.attributes.preparationSteps,onChange:function(t){return e.setAttributes({preparationSteps:t})}}),Object(a.createElement)("hr",null),Object(a.createElement)("div",{className:"foodblogkitchen-recipes--block--headline"},Object(a.createElement)("h3",null,Object(n.__)("Notes","foodblogkitchen-recipes"))),Object(a.createElement)(s.RichText,{tagName:"p",value:e.attributes.notes,placeholder:Object(n.__)("Additional notes ...","foodblogkitchen-recipes"),onChange:function(t){e.setAttributes({notes:t})}})))})):function(){return Object(a.createElement)("div",{class:"wp-block components-placeholder is-large"},Object(a.createElement)("div",{class:"components-placeholder__label"},Object(n.__)("You have not activated the license yet","foodblogkitchen-recipes")),Object(a.createElement)("div",{class:"components-placeholder__instructions"},Object(n.__)("Please enter a valid license key in the settings of the recipe plugin. You have received this key by email with your purchase.","foodblogkitchen-recipes")),Object(a.createElement)("div",{class:"components-placeholder__instructions"},Object(n.__)("If you can no longer find your license key, please contact us at ","foodblogkitchen-recipes"),Object(a.createElement)("a",{href:"mailto:support@foodblogkitchen.de"},"support@foodblogkitchen.de"),"."),Object(a.createElement)("a",{href:foodblogkitchenRecipesAdditionalData.licensePage,class:"components-button is-primary"},Object(n.__)("Go to settings","foodblogkitchen-recipes")))},save:function(e){return e}})}]);