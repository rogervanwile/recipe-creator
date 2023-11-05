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
      ".recipe-plugin-for-wp--recipe-block--title"
    );
    const introContainer = recipeContainerClone.querySelector(
      ".recipe-plugin-for-wp--recipe-block--intro"
    );
    const timingListContainer = recipeContainerClone.querySelector(
      ".recipe-plugin-for-wp--recipe-block--timings"
    );
    const ingredientsContainer = recipeContainerClone.querySelector(
      ".recipe-plugin-for-wp--recipe-block--ingredients"
    );
    const preparationStepsContainer = recipeContainerClone.querySelector(
      ".recipe-plugin-for-wp--recipe-block--preparation-steps"
    );
    const notesContainer = recipeContainerClone.querySelector(
      ".recipe-plugin-for-wp--recipe-block--notes"
    );
    const imageContainer = recipeContainerClone.querySelector(
      ".recipe-plugin-for-wp--recipe-block--thumbnail"
    );

    printIframe.addEventListener("load", () => {
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();
    });

    const printStyleUrl = `${
      (window as any).foodblogkitchenRecipeBlockConfig.printStyleUrl
    }?cb=${new Date().getTime()}`;

    const svgStringQrCode = await toString(window.location.href, {
      type: "svg",
      margin: 0,
    });

    const topline =
      window.RecipePluginForWP.config.blogName || location.hostname;

    printIframe.contentWindow?.document.write(
      `<html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link href="${printStyleUrl}" rel="stylesheet" />
        </head>
        <body class="recipe-plugin-for-wp--block">
          <div class="title">
            <div class="left">
              <div class="topline">${topline}</div>
              ${titleContainer?.outerHTML || ''}
            </div>
            <div class="right">
            ${svgStringQrCode || ''}
            <p class="qr-hint"><small>Link zum Rezept</small></p>
            </div>
          </div>
          <header>
            ${introContainer?.outerHTML || ''}
            ${timingListContainer?.outerHTML || ''}
          </header>
          ${imageContainer?.outerHTML || ''}
          <aside>
            ${ingredientsContainer?.outerHTML || ''}
          </aside>
          <main>
            ${preparationStepsContainer?.outerHTML || ''}
            ${notesContainer?.outerHTML || ''}
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
    // => This is not working on Android devices, so there is no cleanup for now.
    // printIframe.contentWindow?.addEventListener("afterprint", (event) => {
    //   printIframe.parentElement?.removeChild(printIframe);
    // });
  }
}
