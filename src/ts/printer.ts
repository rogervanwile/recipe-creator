import { toString } from "qrcode";

export class Printer {
  constructor(element: HTMLElement) {
    this.printContainer(element);
  }

  private async printContainer(recipeContainer: HTMLElement) {
    const printIframe = document.createElement("iframe");
    printIframe.src = "about:blank";
    printIframe.style.position = "fixed";
    printIframe.style.top = "0px";
    printIframe.style.left = "-999em";

    document.body.appendChild(printIframe);

    const recipeContainerClone = recipeContainer.cloneNode(true) as HTMLElement;

    // Remove Ad Slots
    const adSlots = recipeContainerClone.querySelectorAll(".adsbygoogle");
    adSlots.forEach((adSlot) => {
      adSlot.parentElement?.removeChild(adSlot);
    });

    const titleContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--title"
    );
    const introContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--intro"
    );
    const timingListContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--timings"
    );
    const ingredientsContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--ingredients"
    );
    const preparationStepsContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--preparation-steps"
    );
    const notesContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--notes"
    );
    const imageContainer = recipeContainerClone.querySelector(
      ".foodblogkitchen-toolkit--recipe-block--thumbnail"
    );

    Promise.all([
      new Promise((resolve, reject) => {
        printIframe.onload = resolve;
      }),
      (printIframe.contentDocument as any)?.fonts.ready,
    ])
      .then(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
      })
      .catch((error) => {
        console.error(error);
      });

    const styleElement = document.getElementById(
      "foodblogkitchen-toolkit-recipe-block-css"
    );
    const url =
      styleElement?.getAttribute("href") ||
      window.location.origin +
        "/wp-content/plugins/foodblogkitchen-toolkit/build/style-editor.css?cb=" +
        new Date().getTime();

    const svgStringQrCode = await toString(window.location.href, {
      type: "svg",
      margin: 0,
    });

    const topline =
      window.FoodblogkitchenToolkit.config.blogName || location.hostname;

    printIframe.contentWindow?.document.write(
      `<html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link href="${url}" rel="stylesheet" />
        </head>
        <body class="foodblogkitchen-toolkit--block">
          <div class="title">
            <div class="left">
              <div class="topline">${topline}</div>
              ${titleContainer?.outerHTML}
            </div>
            <div class="right">
              ${svgStringQrCode}
              <p class="qr-hint"><small>Link zum Rezept</small></p>
            </div>
          </div>
          <header>
            ${introContainer?.outerHTML}
            ${timingListContainer?.outerHTML}
          </header>
          ${imageContainer?.outerHTML}
          <aside>
            ${ingredientsContainer?.outerHTML}
          </aside>
          <main>
            ${preparationStepsContainer?.outerHTML}
            ${notesContainer?.outerHTML}
          </main>
          <footer>
            <div class="footer-inner">
            </div>
          </footer>
        </body>
      </html>`
    );
    printIframe.contentWindow?.document.close();

    // Cleanup after closing the print dialog
    printIframe.contentWindow?.addEventListener("afterprint", (event) => {
      printIframe.parentElement?.removeChild(printIframe);
    });
  }
}