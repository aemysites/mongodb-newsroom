/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import columns2Parser from './parsers/columns2.js';
import columns3Parser from './parsers/columns3.js';
import hero5Parser from './parsers/hero5.js';
import cardsNoImages4Parser from './parsers/cardsNoImages4.js';
import accordion6Parser from './parsers/accordion6.js';
import cards7Parser from './parsers/cards7.js';
import cards1Parser from './parsers/cards1.js';
import hero8Parser from './parsers/hero8.js';
import columns11Parser from './parsers/columns11.js';
import hero10Parser from './parsers/hero10.js';
import cards15Parser from './parsers/cards15.js';
import columns14Parser from './parsers/columns14.js';
import hero16Parser from './parsers/hero16.js';
import accordion18Parser from './parsers/accordion18.js';
import hero17Parser from './parsers/hero17.js';
import cards12Parser from './parsers/cards12.js';
import hero20Parser from './parsers/hero20.js';
import columns21Parser from './parsers/columns21.js';
import hero24Parser from './parsers/hero24.js';
import accordion25Parser from './parsers/accordion25.js';
import hero27Parser from './parsers/hero27.js';
import columns22Parser from './parsers/columns22.js';
import accordion26Parser from './parsers/accordion26.js';
import hero30Parser from './parsers/hero30.js';
import columns32Parser from './parsers/columns32.js';
import cards33Parser from './parsers/cards33.js';
import columns34Parser from './parsers/columns34.js';
import columns35Parser from './parsers/columns35.js';
import columns37Parser from './parsers/columns37.js';
import search38Parser from './parsers/search38.js';
import cards28Parser from './parsers/cards28.js';
import tableBordered40Parser from './parsers/tableBordered40.js';
import columns39Parser from './parsers/columns39.js';
import tabs43Parser from './parsers/tabs43.js';
import columns45Parser from './parsers/columns45.js';
import columns44Parser from './parsers/columns44.js';
import cards41Parser from './parsers/cards41.js';
import columns47Parser from './parsers/columns47.js';
import columns48Parser from './parsers/columns48.js';
import accordion46Parser from './parsers/accordion46.js';
import hero50Parser from './parsers/hero50.js';
import hero49Parser from './parsers/hero49.js';
import accordion53Parser from './parsers/accordion53.js';
import columns56Parser from './parsers/columns56.js';
import columns54Parser from './parsers/columns54.js';
import carousel59Parser from './parsers/carousel59.js';
import cards52Parser from './parsers/cards52.js';
import columns61Parser from './parsers/columns61.js';
import columns63Parser from './parsers/columns63.js';
import cards60Parser from './parsers/cards60.js';
import cards62Parser from './parsers/cards62.js';
import columns65Parser from './parsers/columns65.js';
import cards64Parser from './parsers/cards64.js';
import columns67Parser from './parsers/columns67.js';
import columns66Parser from './parsers/columns66.js';
import columns68Parser from './parsers/columns68.js';
import columns70Parser from './parsers/columns70.js';
import columns71Parser from './parsers/columns71.js';
import columns72Parser from './parsers/columns72.js';
import columns73Parser from './parsers/columns73.js';
import columns74Parser from './parsers/columns74.js';
import hero76Parser from './parsers/hero76.js';
import hero75Parser from './parsers/hero75.js';
import columns69Parser from './parsers/columns69.js';
import columns77Parser from './parsers/columns77.js';
import columns78Parser from './parsers/columns78.js';
import columns79Parser from './parsers/columns79.js';
import columns80Parser from './parsers/columns80.js';
import columns82Parser from './parsers/columns82.js';
import cards83Parser from './parsers/cards83.js';
import cards81Parser from './parsers/cards81.js';
import cards85Parser from './parsers/cards85.js';
import tabs86Parser from './parsers/tabs86.js';
import cards87Parser from './parsers/cards87.js';
import accordion89Parser from './parsers/accordion89.js';
import columns84Parser from './parsers/columns84.js';
import columns90Parser from './parsers/columns90.js';
import columns91Parser from './parsers/columns91.js';
import cardsNoImages93Parser from './parsers/cardsNoImages93.js';
import accordion94Parser from './parsers/accordion94.js';
import hero95Parser from './parsers/hero95.js';
import hero96Parser from './parsers/hero96.js';
import hero97Parser from './parsers/hero97.js';
import accordion88Parser from './parsers/accordion88.js';
import cardsNoImages98Parser from './parsers/cardsNoImages98.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  columns2: columns2Parser,
  columns3: columns3Parser,
  hero5: hero5Parser,
  cardsNoImages4: cardsNoImages4Parser,
  accordion6: accordion6Parser,
  cards7: cards7Parser,
  cards1: cards1Parser,
  hero8: hero8Parser,
  columns11: columns11Parser,
  hero10: hero10Parser,
  cards15: cards15Parser,
  columns14: columns14Parser,
  hero16: hero16Parser,
  accordion18: accordion18Parser,
  hero17: hero17Parser,
  cards12: cards12Parser,
  hero20: hero20Parser,
  columns21: columns21Parser,
  hero24: hero24Parser,
  accordion25: accordion25Parser,
  hero27: hero27Parser,
  columns22: columns22Parser,
  accordion26: accordion26Parser,
  hero30: hero30Parser,
  columns32: columns32Parser,
  cards33: cards33Parser,
  columns34: columns34Parser,
  columns35: columns35Parser,
  columns37: columns37Parser,
  search38: search38Parser,
  cards28: cards28Parser,
  tableBordered40: tableBordered40Parser,
  columns39: columns39Parser,
  tabs43: tabs43Parser,
  columns45: columns45Parser,
  columns44: columns44Parser,
  cards41: cards41Parser,
  columns47: columns47Parser,
  columns48: columns48Parser,
  accordion46: accordion46Parser,
  hero50: hero50Parser,
  hero49: hero49Parser,
  accordion53: accordion53Parser,
  columns56: columns56Parser,
  columns54: columns54Parser,
  carousel59: carousel59Parser,
  cards52: cards52Parser,
  columns61: columns61Parser,
  columns63: columns63Parser,
  cards60: cards60Parser,
  cards62: cards62Parser,
  columns65: columns65Parser,
  cards64: cards64Parser,
  columns67: columns67Parser,
  columns66: columns66Parser,
  columns68: columns68Parser,
  columns70: columns70Parser,
  columns71: columns71Parser,
  columns72: columns72Parser,
  columns73: columns73Parser,
  columns74: columns74Parser,
  hero76: hero76Parser,
  hero75: hero75Parser,
  columns69: columns69Parser,
  columns77: columns77Parser,
  columns78: columns78Parser,
  columns79: columns79Parser,
  columns80: columns80Parser,
  columns82: columns82Parser,
  cards83: cards83Parser,
  cards81: cards81Parser,
  cards85: cards85Parser,
  tabs86: tabs86Parser,
  cards87: cards87Parser,
  accordion89: accordion89Parser,
  columns84: columns84Parser,
  columns90: columns90Parser,
  columns91: columns91Parser,
  cardsNoImages93: cardsNoImages93Parser,
  accordion94: accordion94Parser,
  hero95: hero95Parser,
  hero96: hero96Parser,
  hero97: hero97Parser,
  accordion88: accordion88Parser,
  cardsNoImages98: cardsNoImages98Parser,
  ...customParsers,
};

const transformers = [
  cleanupTransformer,
  imageTransformer,
  linkTransformer,
  sectionsTransformer,
  ...(Array.isArray(customTransformers)
    ? customTransformers
    : Object.values(customTransformers)),
];

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    transformers.forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, {
  fragment, inventory, publishUrl, ...source
}) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth, publishUrl,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (payload) => {
    const { document, params: { originalURL } } = payload;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...payload, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, {
        ...payload, fragment, inventory, publishUrl,
      });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...payload, inventory });
      path = generateDocumentPath(payload, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...payload, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
