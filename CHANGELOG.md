# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.13] - 2024-12-19

- Fixed: In some cases, focus was still set even when explicitly expanding without focus.

## [1.1.12] - 2024-12-17

- Added: Set class `is-transitioning` while transitioning between expanded and collapsed states, and vice-versa.

## [1.1.11] - 2024-12-17

- Fixed: Do not set focus on element initialization.

## [1.1.10] - 2024-10-10

- Added: New methods `CollapsibleBlock.enableFocusOnExpand` and `CollapsibleBlock.disableFocusOnExpand` to control whether to focus on the first focusable element when expanding a block.

## [1.1.9] - 2024-06-28

- Fixed: Make sure to finish the "expand" state change after the duration of the height transition, so we don't need to rely completely on the browser's `transitionend` event.

## [1.1.8] - 2022-10-28

- Added: New parameter `withFocus` for the `CollapsibleBlock.expand` function which allows to expand a collapsible block without setting focus to the focusable elements inside it.

## [1.1.7] - 2021-12-23

- Fix: Detect links with `role="button"` as focusable elements.
- Fix: Do not try to select the contents of fields or other elements that do not support it.

## [1.1.6] - 2021-06-04

### Added

- Added option to select focusable field contents when expanding a collapsible-block. Defaults to `true`.

## [1.1.5] - 2021-05-26

### Fixed

- Fix: do not set auto-focus when initializing the collapsible blocks when the element's initialiation happens late (ie. after an ajax call)

## [1.1.4] - 2021-05-26

### Fixed

- Fix: do not set auto-focus when element is  not visible or inside nested collapsible blocks.

## [1.1.3] - 2021-05-24

### Fixed

- Fix: do not set auto-focus when initializing the collapsible blocks.

## [1.1.2] - 2021-05-12

### Added

- Added option to set focus to first focusable element within the collapsible block content element. Set the attribute `data-autofocus` on the collapsible block element or the element that should get the focus.
- Added option to toggle state of multiple collapsible blocks at once by setting the attribute `data-collapsible-targets` with more than one collapsible block ID.
- Added class `is-expanded` when blocks are expanded.

## [1.1.1] - 2021-04-29

### Fixed

- Fix an error where the element or event passed to `finishCollapse` or `finishExpand` contains a `target` property but it is not valid.

## [1.1.0] - 2021-04-29

### Added

- Added support for keyboard keys `SPACE` and `ENTER` to activate the collapsible handlers.
- Added accessibility `aria-` attributes to represent the state of the collapsible blocks.

### Changed

- Hides the content with `display: none;` when collapsing to prevent users from accessing collapsed content using the a keyboard.
- Improved `collapse` and `expand` functions to allow change the state of the block without transitions, and the initial state change will not "play" transitions, and to stop any transition playing switching from "collapsing" to "expanding" and vice versa.

### Fixed

- Fixed how `collapse` and `expand` functions calculate the limit values for each state, avoiding wrong values when the viewport or content site changes.

### Removed

- Replaced the attribute `data-collapsible-target` with `aria-controls` as the later serves for accessibility purposes and can also be used to point to the target of the handler element.

## [1.0.6] - 2021-04-27

### Fixed

- Fixed support for nested collapsible blocks without content element at initialization.

## [1.0.5] - 2021-04-27

### Added

- Added body class `has-collapsible-block` on initialization.

## [1.0.4] - 2021-04-09

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
