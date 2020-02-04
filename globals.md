# Globals

```
{
    "rootBase": "", // Set to the relative/absolute path to the host's root
    "assetsBase": "/assets", // Set to the relative/absolute path or external CDN where all CSS, JS and fonts are located
    "disableAds": true, // Disables all ad containers
    "metadata": [
      {
          "name": "author",
          "itemprop": "author",
          "content": "RP ONLINE", // Name of the author, in respect to Google indexing
      },
      {
          "name": "theme-color",
          "content": "#ffc100", // Theme color for browsers supporting theming (e.g. Chrome mobile)
      },
      {
          "name": "twitter:dnt",
          "content": "on", // Activate "Do not track" for Twitter
      }
    ],
    "keys": {
      "googleAnalytics": "",
      "googleTagManager": "GTM-N938K5"
      "imageEngine": "ujgu", // Your WURFL Image Engine key, if present. Leave out if you do not use Image Engine.
    }
}
```

The `globals` variable holds configuration that affects all pages and their components at once. It will be passed to every page template.

