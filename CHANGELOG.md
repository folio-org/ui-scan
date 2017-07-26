# Change history for ui-scan

## 1.2.0 (IN PROGRESS)
* Click-through to item list/details (UIS-49)
* New permission `settings.loan-policies.all`. Fixes UIS-50.
* Add right click to open user and item in a new tab. Fixes UIS-67 and UIS-68.
* Clear barcode input after item is scanned. Fixes UIS-54.
* Clear loans after new patron is scanned. Fixes UIS-56.
* Clear text area after check in. Fixes UIS-60.
* Generate loan due date. Fixes UIS-52.

## [1.1.0](https://github.com/folio-org/ui-scan/tree/v1.1.0) (2017-07-14)
[Full Changelog](https://github.com/folio-org/ui-scan/compare/v1.0.0...v1.1.0)

* Bugfix, reinstate missing error messages for patron form (ref. requirements in LIBAPP-168)
* Align with new API versions of `circulation` and `loan-storage`. UIS-64
* Bump `circulation` interface dependency to v2.0
* Bump `loan-storage` interface dependency to v3.0
* Surface some back-end and front-end system errors as error messages in UI (UIS-48)
* Bump `users` interface dependency to v14.0. UIS-63.
* Click-through to Users tab from record of currently scanned patron ID
* Specify module name in settings second column. Part of STRPCOMP-1.
* Include label in loan-policies editor paneTitle. Part of STRPCOMP-1.
* Eliminate use of `componentWillMount` to provide initial values to resources. Part of STRIPES-433.
* Improvements to loan period form in settings. Fixes UIS-36, UIS-38.
* Rewrite nav menu selector in loan policy form to be reusable. Also fixes UIS-39.
* Bump `configuration` interface dependency to v2.0. Fixes UIS-41.

## [1.0.0](https://github.com/folio-org/ui-scan/tree/v1.0.0) (2017-07-03)
[Full Changelog](https://github.com/folio-org/ui-scan/compare/v0.5.0...v1.0.0)

* Add support for loan periods in settings. Fixes UIS-13, UIS-16, UIS-27 and UIS-28.
* Add `okapiInterfaces` and `permissionSets` in `package.json`. Fixes UIS-24.
* Upgrade dependencies on Stripes libraries. These had got very out of date: all three of them by one or more major versions. Fixes UIS-26.
* Depend on v1.0 of the `configuration` interface. Fixes UIS-33 and UIS-34.

## [0.5.0](https://github.com/folio-org/ui-scan/tree/v0.5.0) (2017-06-07)
[Full Changelog](https://github.com/folio-org/ui-scan/compare/v0.4.0...v0.5.0)

* Forms now submit when Enter is pressed in a text field (completes UIS-1).
* Better handling of user identifier prefs when not set in Settings.
* User identifier pref select list options now include keys to make React happy.

## [0.4.0](https://github.com/folio-org/ui-scan/tree/v0.4.0)
[Full Changelog](https://github.com/folio-org/ui-scan/compare/v0.3.0...v0.4.0)

* Add settings section, check-in subsection, and preference for user identifier type for user lookups (completes LIBAPP-205)
* In checkout form, uses preference-selected user identifier to do user lookups (completes LIBAPP-207)

## [0.3.0]
* Add validations to check-in and check-out forms

## [0.2.0](https://github.com/folio-org/ui-scan/tree/v0.2.0) (2017-04-12)
[Full Changelog](https://github.com/folio-org/ui-scan/compare/v0.1.0...v0.2.0)

* Upgrade dependencies; stripes-core v0.6.0, stripes-connect v0.3.0, and stripes-components v0.6.0.

## [0.1.0](https://github.com/folio-org/ui-scan/tree/v0.1.0) (2017-04-07)
[Full Changelog](https://github.com/folio-org/ui-scan/compare/v0.0.2...v0.1.0)

* Depend on v0.5.0 of stripes-components: needed so that `<IfPermission>` works correctly. See FOLIO-548.

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
