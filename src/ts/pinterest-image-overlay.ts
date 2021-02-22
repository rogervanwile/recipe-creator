require('./../styles/pinterest-image-overlay.scss')

export class PinterestImageOverlay {
  private imageSelectors = [
    '.wp-block-image img',
    '.blocks-gallery-item figure img'
  ];

  constructor() {
    this.imageSelectors.forEach(selector => {
      const images = document.querySelectorAll(selector);
      Array.from(images).forEach((image: Element) => {
        const description = image.getAttribute('title') || image.getAttribute('alt') || '';
        const pinItLink = document.createElement('a');
        pinItLink.href = '#';
        pinItLink.classList.add('foodblogkitchen-toolkit--pinterest-image-overlay');

        pinItLink.addEventListener('click', (event) => {
          event.preventDefault();

          const imageUrl = image.getAttribute('src');
          if (imageUrl) {
            const url = this.createPinterestPinItUrl(imageUrl, description);
            window.open(url, '_blank');
          }
        });

        const tooltip = document.createElement('span');
        tooltip.innerText = 'Pin it';
        tooltip.classList.add('foodblogkitchen-toolkit--pinterest-image-overlay--tooltip');
        pinItLink.appendChild(tooltip);

        if (image.parentNode) {
          (<HTMLElement>image.parentNode).classList.add('foodblogkitchen-toolkit--pinterest-wrapper');
          image.parentNode.insertBefore(pinItLink, image.nextSibling);
        }
      });
    });
  }

  private createPinterestPinItUrl(mediaUrl: string, mediaDescription: string = '') {
    return 'https://www.pinterest.com/pin/create/button/' +
      '?url=' + encodeURIComponent(window.location.origin + window.location.pathname) +
      '&media=' + encodeURIComponent(mediaUrl) +
      (mediaDescription ? '&description=' + encodeURIComponent(mediaDescription) : '');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // TODO: URL erst beim Klick auslesen
  new PinterestImageOverlay();
});
