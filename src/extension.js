const vscode = require('vscode');
const Move = require('./commands/Move');
const Language = require('./commands/Language');
const Snapshot = require('./commands/Snapshot');
const Clipboard = require('./commands/Clipboard');
const Markdown = require('./commands/Markdown');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    //move selection to left
    vscode.commands.registerCommand(
        'vstoolkit.moveSelectionToLeft',
        Move.moveSelectionToLeft
    );

    //move selection to left
    vscode.commands.registerCommand(
        'vstoolkit.moveSelectionToRight',
        Move.moveSelectionToRight
    );

    // translate
    vscode.commands.registerCommand(
        'vstoolkit.translateSelection',
        Language.translateSelection
    );

    //check spelling
    vscode.commands.registerCommand(
        'vstoolkit.checkSpelling',
        Language.checkSpelling
    );

    //createSnapshot
    vscode.commands.registerCommand(
        'vstoolkit.createSnapshot',
        Snapshot.createSnapshot
    );

    //createSnapshot
    vscode.commands.registerCommand(
        'vstoolkit.restoreSnapshot',
        Snapshot.restoreSnapshot
    );

    //delete snapshot
    vscode.commands.registerCommand(
        'vstoolkit.deleteSnapshot',
        Snapshot.deleteSnapshot
    );

    //delete all snapshots from active file
    vscode.commands.registerCommand(
        'vstoolkit.deleteAllSnapshotsFromActiveFile',
        Snapshot.deleteAllSnapshotsFromActiveFile
    );

    //delete all snapshots
    vscode.commands.registerCommand(
        'vstoolkit.deleteAllSnapshots',
        Snapshot.deleteAllSnapshots
    );

    //view snapshot
    vscode.commands.registerCommand(
        'vstoolkit.viewSnapshot',
        Snapshot.viewSnapshot
    );

    //view snapshot from active file
    vscode.commands.registerCommand(
        'vstoolkit.viewSnapshotFromActiveFile',
        Snapshot.viewSnapshotFromActiveFile
    );

    //copyToAdvancedClipboard
    vscode.commands.registerCommand(
        'vstoolkit.copyToAdvancedClipboard',
        Clipboard.copyToAdvancedClipboard
    );

    //pasteToAdvancedClipboard
    vscode.commands.registerCommand(
        'vstoolkit.pasteFromAdvancedClipboard',
        Clipboard.pasteFromAdvancedClipboard
    );

    //deleteFromAdvancedClipboard
    vscode.commands.registerCommand(
        'vstoolkit.deleteFromAdvancedClipboard',
        Clipboard.deleteFromAdvancedClipboard
    );

    //clearToAdvancedClipboard
    vscode.commands.registerCommand(
        'vstoolkit.clearAdvancedClipboard',
        Clipboard.clearAdvancedClipboard
    );

    //clearToAdvancedClipboard
    vscode.commands.registerCommand(
        'vstoolkit.addMarkdownOverview',
        Markdown.addMarkdownOverview
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
