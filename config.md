# Config

```
{
    "metadata": [
      {
        "name": "description",
        "content": "Dies ist die Beispiel-Startseite"
      },
      {
        "name": "canonical",
        "content": "https://templates.park.works/"
      }
    ],
    "ads": { // ad configuration, if applicable
        "area": "aktuelles",
        "zone": "homepage"
    },
    "advertorial": true, // Mark the current page as advertorial and exclude it from being indexed
}
```

The `config` variable holds a per page configuration that affects all components of that specific page. `config` get merged on top of the site's `global` variable, so that it is also possible to override global settings.

