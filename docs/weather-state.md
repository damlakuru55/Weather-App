# Weather App State

The weather interface benefits from explicit states instead of relying on empty values to represent every condition.

## States
- Idle: no location has been requested.
- Loading: a request is in progress.
- Success: current weather and forecast data are available.
- Error: the request could not be completed.

The UI should preserve the selected location while loading and should provide a clear retry path after an error.
