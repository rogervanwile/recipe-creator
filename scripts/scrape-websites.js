const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// Liste der Domains
const domains = [
  "https://einfachkartoffel.de",
  "https://recipe-creator.de",
  "https://www.uebersee-maedchen.de",
  "https://kaleidoscopic-kitchen.com",
  "https://ahalnisweethome.de",
  "https://facettenreich-vegan.de",
  "https://thecookingglobetrotter.com",
  "https://kuechenstuebchen.de",
  "https://puenktchens-mama.de",
  "https://meinbackglueck.de",
  "https://ver.ellla.de",
  "https://houseno15.de",
  "https://lowcarb-fit.de",
  "https://einfachkartoffel.de",
  "https://gutermann.xyz",
  "https://nadineschulz.com",
  "https://herbstblueten.de",
  "https://bestes-rezept.de",
  "https://webshop.martinshof-ballreich.de",
  "https://sabrinaheller.com",
  "https://foerster.xyz",
  "https://theveggiecamper.de",
  "https://mealpreperia.com",
  "https://nadines-kuechenmagie.de",
  "https://kalekarousel.ch",
  "https://foodbylari.de",
  "https://www.genuesslichkeiten.com",
  "https://xn--geflgelspezialitten-vwb50c.de",
  "https://frautamtam.de",
  "https://marileykreationen.de",
  "https://andersbacken.de",
  "https://appeteyezing.de",
  "https://makeitsweet.de",
  "https://xn--grnfutterkche-xobi.de",
  "https://cookingdiary.de",
  "https://sabrinahofstaedter.de",
  "https://zimtliebe.de",
  "https://einfach-bine.de",
  "https://leichtgelassen.de",
];

const elementsToCheck = [".foodblogkitchen-toolkit--recipe-block", ".foodblogkitchen-toolbar--faq-block", '.foodblogkitchen-toolkit--recipe-block--share-on-pinterest'];

// Funktion zum Abrufen der Sitemap und Extrahieren der URLs
async function fetchSitemapUrls(domain) {
  try {
    const sitemapUrl = `${domain}/sitemap.xml`;
    const urls = await fetchSitemap(sitemapUrl);

    return urls;
  } catch (error) {
    console.error("Fehler beim Abrufen der Sitemap:", domain, error.message);
    return [];
  }
}

async function fetchSitemap(sitemapUrl) {
  const response = await axios.get(sitemapUrl);
  const $ = cheerio.load(response.data, { xmlMode: true });
  let urls = $("url loc")
    .map((_, element) => $(element).text())
    .get();

  if (!urls.length) {
    urls = $("sitemap loc")
      .map((_, element) => $(element).text())
      .get();
  }

  // Extrahiere auch URLs aus Unter-Sitemaps
  for (const sitemapUrl of urls) {
    if (sitemapUrl.endsWith(".xml")) {
      const subSitemapUrls = await fetchSitemap(sitemapUrl);
      urls.push(...subSitemapUrls);
    }
  }

  return urls;
}

// Funktion zum Scrapen einer Seite nach dem gesuchten Element
async function scrapePageForElement(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const foundElements = {};

    elementsToCheck.forEach((element) => {
      if ($(element).length > 0) {
        foundElements[url] = foundElements[url] || {};
        foundElements[url][element] = $(element).length;
      }
    });

    if (Object.keys(foundElements).length) {
      return foundElements;
    }

    return null;
  } catch (error) {
    console.error("Fehler beim Abrufen der Seite:", url, error.message);
  }
}

// Hauptfunktion
async function main() {
  let foundElements = [];

  for (const domain of domains) {
    const domainResults = [];

    // Extrahiere die URLs aus der Sitemap für jede Domain
    const sitemapUrls = await fetchSitemapUrls(domain);

    console.log("sitemapUrls", sitemapUrls);

    // Überprüfe jede URL nach dem gesuchten Element
    for (let i = 0; i < sitemapUrls.length; i++) {
      const url = sitemapUrls[i];

      if (i % 10 === 0) {
        console.log(i + " / " + sitemapUrls.length);
      }

      const result = await scrapePageForElement(url);
      if (result) {
        domainResults.push(result);
      }
    }

    fs.writeFileSync(`./scripts/statistics/${new URL(domain).hostname}.json`, JSON.stringify(domainResults, null, 2));

    foundElements = [...foundElements, ...domainResults];
  }

  // Ausgabe der gesammelten URLs
  console.log("Gefundene URLs mit dem Element:", JSON.stringify(foundElements, null, 2));

  fs.writeFileSync("./scripts/result.json", JSON.stringify(foundElements, null, 2));
}

// Starte das Scraping
main();
