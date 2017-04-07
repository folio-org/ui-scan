# Change history for ui-scan

## [0.0.2](https://github.com/folio-org/ui-scan/tree/v0.0.2) (2017-03-23)
[Full Changelog](https://github.com/folio-org/ui-scan/compare/v0.0.1...v0.0.2)

* Port to react-router v4.x
* Items for checkin are found by barcode rather than UUID.
* Checkins and checkouts now happen immediately rather than all together in a batch.
* Checkin and checkout processes create and modify loan objects as well as items.
* `<Scan>` component keeps state in local stripes-connect resources.
* Convert `<Checkin>` and `<Checkout>` components to functional style.
* Add ESLint configuration.
* Clean up code in accordance with ESLint.
* Add some documentation boilerplate: `LICENSE`, `CONTRIBUTING.md`.

## [0.0.1](https://github.com/folio-org/ui-scan/tree/v0.0.1) (2017-02-27)

* First version to have a documented change-log. Each subsequent version will
  describe its differences from the previous one.

