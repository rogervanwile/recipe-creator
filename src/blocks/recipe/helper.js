export function extractTextFromHTMLString(value) {
  if (!value) {
    return value;
  }

  var brCode = "<br>";
  var brPlaceholder = "###BR###";
  var span = document.createElement("span");

  var safeValue = value.replace(new RegExp(brCode, "g"), brPlaceholder);

  span.innerHTML = safeValue;
  var result = span.textContent || span.innerText;

  return result.replace(new RegExp(brPlaceholder, "g"), brCode);
}

export function extractTextFromListString(value) {
  if (!value) {
    return value;
  }

  return value
    .split(/(<\/?li>)/)
    .map((str) => {
      if (["<li>", "</li>"].includes(str)) {
        return str;
      } else {
        return extractTextFromHTMLString(str);
      }
    })
    .join("");
}
