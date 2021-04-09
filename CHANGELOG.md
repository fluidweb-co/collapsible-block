# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fixed first collapsible does not fully expand when styles are applied too late.
- Fixed documentation of default values on README.md.

## [1.0.3] - 2021-04-07

### Fixed

- Fixed how the script handles the `overflow` property for the content element, clear inline `overflow` property value after expanding.

## [1.0.2] - 2021-04-07

### Added

- Added support for collapsible content elements without the inner element by creating the content inner element at initialization.

## [1.0.1] - 2021-04-03

### Added

- Exposed the variable `_states` for public use as `CollapsibleBlock.states`.
- Added transition between collapsed and expanded states.
- Added CHANGELOG.md (this file).

### Fixed

- Fixed some typos and removed an unnecessary paragraph from README.md.

### Removed

- Removed unnecessary dependency `hammerjs`.

## [1.0.0] - 2021-04-01

### Added

- Initial commit.
