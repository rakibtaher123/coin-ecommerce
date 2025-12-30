// dataWithMeta.js
// This file enriches the base `data.js` dataset with small helper metadata
// fields that make it easier to search/filter, generate URLs and show
// short summary information in the UI.
//
// The file intentionally keeps all original fields and only adds the
// following optional helper fields to each product:
//  - slug: a URL-friendly version of the product name (used if you want /product/:slug)
//  - searchTags: an array of lowercase tokens derived from the name and image to help searching
//  - category: not added here — Category pages add `__category` on the fly

import baseData from './data';

// Basic slugify helper: convert text to a safe, lower-cased url token
const slugify = (text = '') => text
  .toString()
  .trim()
  .toLowerCase()
  .replace(/['"()\[\]]+/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// Create a new object so we don't accidentally mutate the original dataset
const coinData = Object.keys(baseData).reduce((acc, categoryKey) => {
  const items = baseData[categoryKey].map((product) => {
    const name = product.name || '';
    const image = product.image || '';

    const tagsFromName = name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);

    const tagsFromImage = (image.replace(/\.[^.]+$/, '') || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);

    const slug = slugify(`${name} ${product.id || ''}`);

    return {
      ...product,
      slug,
      searchTags: [...new Set([...tagsFromName, ...tagsFromImage])]
    };
  });

  acc[categoryKey] = items;
  return acc;
}, {});

export default coinData;
