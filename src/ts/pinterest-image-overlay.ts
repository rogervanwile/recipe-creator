// import * as css from './../styles/pinterest-image-overlay.scss';
const css = require('./../styles/pinterest-image-overlay.scss')

export class PinterestImageOverlay {
  private imageSelectors = [
    '.wp-block-image img',
    '.blocks-gallery-item figure img'
  ];

  constructor() {
    this.imageSelectors.forEach(selector => {
      const images = document.querySelectorAll(selector);
      console.log('images', images);
      Array.from(images).forEach((image: Element) => {
        const url = image.getAttribute('src');

        if (url) {
          const description = image.getAttribute('title') || image.getAttribute('alt') || '';
          const pinItLink = document.createElement('a');
          pinItLink.href = this.createPinterestPinItUrl(url, description);
          pinItLink.target = '_blank';
          pinItLink.classList.add('foodblogkitchen-toolkit--pinterest-image-overlay');

          if (image.parentNode) {
            (<HTMLElement>image.parentNode).classList.add('foodblogkitchen-toolkit--pinterest-wrapper');
            image.parentNode.insertBefore(pinItLink, image.nextSibling);
          }
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
  const pinterestImageOverlay = new PinterestImageOverlay();
});
