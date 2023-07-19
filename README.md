<div align="center">
    <br />
    <img src="https://raw.githubusercontent.com/phil1436/VSToolKit/main/assets/logo.png" alt="OwnVscodeExtensionLogo" width="35%"/>
    <h1>VSToolKit</h1>
    <p>
    Providing tools for <a href="https://code.visualstudio.com/">Microsoft's Visual Studio Code</a>.
    </p>
</div>

<div align="center">
    <a href="https://github.com/phil1436/ownvscodeextension/releases">
        <img src= "https://img.shields.io/github/v/release/phil1436/VSToolKit?display_name=tag" alt="current release">
    </a>
    <a href="https://github.com/phil1436/VSToolKit/blob/master/LICENSE">
        <img src="https://img.shields.io/github/license/phil1436/VSToolKit" alt="license">
    </a>
    <a href="https://github.com/phil1436/VSToolKit/stargazers">
        <img src="https://img.shields.io/github/stars/phil1436/VSToolKit" alt="stars">
    </a>
    <a href="https://github.com/phil1436/VSToolKit/commits/master">
        <img src="https://img.shields.io/github/last-commit/phil1436/VSToolKit" alt="last commit">
    </a>
</div>

---

-   [Features](#features)
    -   [Move Selection](#move-selection)
    -   [Translate Text](#translate-text)
    -   [Working with Snapshots](#working-with-snapshots)
    -   [Advanced Clipboard](#advanced-clipboard)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Workspace](#workspace)
-   [Commands](#commands)
-   [Configuration](#configuration)
-   [Bugs](#bugs)
-   [Release Notes](#release-notes)

---

## Features

### Move Selection

Move the selected text to a direction.

> Keyboard Shortcut: `Alt + LeftArrow/RightArrow` _(Mac: `Options + LeftArrow/RightArrow`)_

### Translate Text

Translates the selected text to a specified language.

> Tip: Just put the cursor inside a word to translate to select the word.

### Working with Snapshots

Create Snapshots of your currently opened file, so you can restore it later.

### Advanced Clipboard

An advanced Clipboard, that can store multiple entries.

> Keyboard Shortcut: `Ctrl + Alt + C/V` _(Mac: `Cmd + Options + C/V`)_

---

## Requirements

-   Visual Studio Code 1.80.0 or higher

---

## Installation

### Install from VSCode Marketplace

-   Open the Extensions sidebar in Visual Studio Code
-   Search for `VSToolKit`
-   Click `Install`

### Install from GitHub

-   Clone this repository (recommended under `~/.vscode/extensions`):

```shell
git clone https://github.com/phil1436/VSToolKit C:\Users\<your-user>\.vscode\extensions\VSToolKit
```

or download the [latest realease](https://github.com/phil1436/VSToolKit/releases/latest) and extract the file into `~/.vscode/extensions`.

-   Then go into the project folder an run:

```shell
npm install
```

-   If the extension did not got installed, run the command `Developer: Install Extension from Location...` and choose the extension folder.

---

## Workspace

This extension will create a directory named _vstoolkit-workspace_ in the same directory as the extension. The workspace contains all files, so your changes in those files will not be lost when installing a new version.

---

## Commands

### VSToolKit Move

-   `Move Selection To Left`: Moves selected text to the left. (`Alt+LeftArrow`)
-   `Move Selection To Right`: Moves selected text to the right. (`Alt+RightArrow`)

### VSToolKit Language

-   `Translate Selection`: Translates selected text.
-   `Check Spelling`: Check the selected text for spelling and suggest other words in case of wrong spelling (**only works for en-US!**).

### VSToolKit Snapshot

-   `Create Snapshot of Active File`: Create a snapshot of your active file. You can specify a optional name for identification (leave empty if not needed).
-   `Restore Snapshot of Active File`: Overwrites your active file with the snapshot.
-   `Delete Snapshot`: Deletes a snapshot.
-   `Delete All Snapshots from Active File`: Deletes all snapshot that are saved for the active file.
-   `Delete All Snapshots`: Deletes all snapshots.
-   `View Snapshot`: View a snapshot.
-   `View Snapshot of Active File`: View a snapshot of your active file.

### VSToolKit Clipboard

-   `Copy To Advanced Clipboard`: Copies a new entry to the Clipboard.

> Keyboard Shortcut: `Ctrl + Alt + C` _(Mac: `Cmd + Options + C`)_

-   `Paste From Advanced Clipboard`: Paste a entry from the clipboard.

> Keyboard Shortcut: `Ctrl + Alt + V` _(Mac: `Cmd + Options + V`)_

-   `Clear Advanced Clipboard`: Deletes all entries in the clipboard.
-   `Delete from Advanced Clipboard`: Deletes one entry from the clipboard.

---

## Configuration

Go to `File > Preferences > Settings` and than navigate to `Extensions > vstoolkit`.

### Snapshot

-   `Create Snapshot When Restore`: If enabled creates a snapshot of the active file when a snapshot get restored (Default: _enabled_).
-   `Delete Snapshot After Restore`: If enabled deletes a snapshot after it gets restored (Default: _disabled_).

### Move

-   `Move Between Lines`: If enabled move a word from the beginning of a line to the end of the line above or from the end of a line to the beginning of the line below (Default: _disabled_).

### Clipboard

-   `Delete Clipboard After Paste`: If enabled deletes the Clipboard entry after paste(Default: _disabled_).
-   `Empty Clipboard When Copy`: If enable overwrites all entries in the clipboard with the new entry (like normal clipboard)(Default: _disabled_).

### Translate

-   `Default Translate`: Default translate configuration for [VSToolKit Translate: Translate Selection](#translate-text). Value is a array of objects:

```json
[
  {"from":"en","to":"de"},
  {"from":"en","to":"es"} ...
]
```

Edit via: _Edit in settings.json_.

---

## Bugs

-   _no known bugs_

---

## [Release Notes](https://github.com/phil1436/VSToolKit/blob/main/CHANGELOG.md)

### [v1.0.1](https://github.com/phil1436/VSToolKit/tree/1.0.1)

-   Bug fixes

---

by [Philipp B.](https://github.com/phil1436)
