# Location Flow

Weather searches should normalize location input before requesting data.

## Manual search
Trim whitespace, reject an empty query, and keep the submitted location visible while results load.

## Geolocation
When browser geolocation is available, request it only from an explicit user action. Permission denial should fall back to manual search without breaking the page.

## Result rendering
Weather data should be rendered only after the response has been validated, with unavailable fields represented clearly instead of producing broken labels.
