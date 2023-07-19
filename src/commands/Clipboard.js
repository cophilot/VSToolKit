const vscode = require('vscode');
const WorkspaceManager = require('../WorkspaceManager.js');
const workspaceManager = new WorkspaceManager();
workspaceManager.init();

async function copyToAdvancedClipboard() {
    let selection = vscode.window.activeTextEditor.selection;
    if (selection == undefined) {
        vscode.window.showWarningMessage('Could not find a selection');
        return;
    }
    let text = undefined;
    if (selection.isEmpty) {
        text =
            '\n' +
            vscode.window.activeTextEditor.document.lineAt(selection.start.line)
                .text;
        if (text == undefined || text == '' || text == '\n') {
            vscode.window.showInformationMessage('Select a Text!');
            return;
        }
    } else {
        text = vscode.window.activeTextEditor.document.getText(selection);
    }
    if (workspaceManager.clipboardJSON.includes(text)) return;

    if (
        vscode.workspace
            .getConfiguration('vstoolkit.clipboard')
            .get('EmptyClipboardWhenCopy')
    ) {
        workspaceManager.clipboardJSON = [];
    }

    workspaceManager.clipboardJSON.push(text);
    vscode.window.setStatusBarMessage(
        workspaceManager.clipboardJSON.length + ' Items in Clipboard',
        3000
    );
    workspaceManager.saveClipboardFile();
}

async function pasteFromAdvancedClipboard() {
    let deleteClipboard = vscode.workspace
        .getConfiguration('vstoolkit.clipboard')
        .get('DeleteClipboardAfterPaste');
    let text = undefined;
    if (workspaceManager.clipboardJSON.length == 0) return;
    else if (workspaceManager.clipboardJSON.length == 1) {
        text = workspaceManager.clipboardJSON[0];
        if (deleteClipboard) {
            workspaceManager.clipboardJSON.pop();
        }
    } else {
        await vscode.window
            .showQuickPick(workspaceManager.clipboardJSON, {
                title: 'Paste from Advanced Clipboard',
            })
            .then((value) => {
                text = value;
            });
        if (deleteClipboard) {
            for (let i in workspaceManager.clipboardJSON) {
                if (workspaceManager.clipboardJSON[i] == text) {
                    workspaceManager.clipboardJSON.splice(i, 1);
                    break;
                }
            }
        }
    }
    if (text == undefined) return;
    vscode.window.activeTextEditor.edit(async (editBuilder) => {
        if (vscode.window.activeTextEditor.selection.isEmpty)
            editBuilder.insert(
                vscode.window.activeTextEditor.selection.start,
                text
            );
        else {
            editBuilder.replace(vscode.window.activeTextEditor.selection, text);
        }
        workspaceManager.saveClipboardFile();
    });
}

async function deleteFromAdvancedClipboard() {
    if (workspaceManager.clipboardJSON.length == 0) return;
    let text = undefined;
    await vscode.window
        .showQuickPick(workspaceManager.clipboardJSON, {
            title: 'Delete from Advanced Clipboard',
        })
        .then((value) => {
            text = value;
        });
    if (text == undefined) return;
    for (let i in workspaceManager.clipboardJSON) {
        if (workspaceManager.clipboardJSON[i] == text) {
            workspaceManager.clipboardJSON.splice(i, 1);
            break;
        }
    }

    workspaceManager.saveClipboardFile();
}

async function clearAdvancedClipboard() {
    workspaceManager.clipboardJSON = [];
    workspaceManager.saveClipboardFile();
}

module.exports = {
    copyToAdvancedClipboard,
    pasteFromAdvancedClipboard,
    deleteFromAdvancedClipboard,
    clearAdvancedClipboard,
};
