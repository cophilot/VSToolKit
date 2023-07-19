const vscode = require('vscode');
const fs = require('fs');

const WorkspaceManager = require('../WorkspaceManager.js');
const workspaceManager = new WorkspaceManager();
workspaceManager.init();

async function createSnapshot() {
    //snapshot name
    if (vscode.window.activeTextEditor == undefined) return;
    let name = await vscode.window.showInputBox({
        placeHolder: 'Snapshot Name',
        title: 'Snapshot Name',
    });
    if (name == undefined) {
        return;
    }

    let fileText = fs.readFileSync(
        vscode.window.activeTextEditor.document.uri.fsPath,
        'utf-8'
    );
    let snapshotObj = {
        path: vscode.window.activeTextEditor.document.uri.fsPath,
        text: fileText,
        timestamp: new Date().toUTCString(),
        name: name,
    };
    workspaceManager.addSnapshot(snapshotObj);
    vscode.window.setStatusBarMessage('Snapshot saved!', 3000);
}

async function restoreSnapshot() {
    if (vscode.window.activeTextEditor == undefined) return;
    let snapshots = [];
    for (let i in workspaceManager.snapshotJSON) {
        if (
            workspaceManager.snapshotJSON[i]['path'] ==
            vscode.window.activeTextEditor.document.uri.fsPath
        ) {
            snapshots.push(workspaceManager.snapshotJSON[i]);
        }
    }
    if (snapshots.length == 0) {
        vscode.window.showInformationMessage('No Snapshot for active file!');
        return;
    }
    let snapshotSelection = undefined;
    await vscode.window
        .showQuickPick(
            snapshots.map((value, index, array) => {
                return (
                    'Snapshot from ' +
                    value['timestamp'] +
                    ' (' +
                    value['name'] +
                    ')'
                );
            })
        )
        .then((value) => {
            snapshotSelection = value;
        });
    if (snapshotSelection == undefined) return;

    snapshotSelection = snapshotSelection.replace('Snapshot from ', '');
    let snapshot = undefined;
    for (let i in snapshots) {
        if (
            snapshots[i]['timestamp'] + ' (' + snapshots[i]['name'] + ')' ==
            snapshotSelection
        ) {
            snapshot = snapshots[i];
            break;
        }
    }
    if (snapshot == undefined) return;

    let settings = vscode.workspace.getConfiguration('vstoolkit.snapshot');

    //create snapshot
    if (settings['CreateSnapshotWhenRestore']) {
        let fileText = fs.readFileSync(
            vscode.window.activeTextEditor.document.uri.fsPath,
            'utf-8'
        );
        let snapshotObj = {
            path: vscode.window.activeTextEditor.document.uri.fsPath,
            text: fileText,
            timestamp: new Date().toUTCString(),
            name: '',
        };
        workspaceManager.snapshotJSON.push(snapshotObj);
        fs.writeFileSync(
            workspaceManager.snapshotFile,
            JSON.stringify(workspaceManager.snapshotJSON, null, 2)
        );
    }

    //write snapshot
    fs.writeFileSync(snapshot['path'], snapshot['text']);

    //delete snapshot after restore
    if (settings['DeleteSnapshotAfterRestore']) {
        for (let i in workspaceManager.snapshotJSON) {
            if (
                workspaceManager.snapshotJSON[i]['path'] == snapshot['path'] &&
                workspaceManager.snapshotJSON[i]['timestamp'] ==
                    snapshot['timestamp'] &&
                workspaceManager.snapshotJSON[i]['text'] == snapshot['text'] &&
                workspaceManager.snapshotJSON[i]['name'] == snapshot['name']
            ) {
                workspaceManager.snapshotJSON.splice(i, 1);
            }
        }
        fs.writeFileSync(
            workspaceManager.snapshotFile,
            JSON.stringify(workspaceManager.snapshotJSON, null, 2)
        );
    }
}

async function viewSnapshot() {
    if (workspaceManager.snapshotJSON.length == 0) {
        vscode.window.showInformationMessage('No Snapshot saved!');
        return;
    }
    let snapshotSelection = undefined;
    await vscode.window
        .showQuickPick(
            workspaceManager.snapshotJSON.map((value, index, array) => {
                return (
                    value['name'] +
                    ': ' +
                    value['path'] +
                    ' | ' +
                    value['timestamp']
                );
            })
        )
        .then((value) => {
            snapshotSelection = value;
        });
    if (snapshotSelection == undefined) return;
    for (let i in workspaceManager.snapshotJSON) {
        if (
            workspaceManager.snapshotJSON[i]['name'] +
                ': ' +
                workspaceManager.snapshotJSON[i]['path'] +
                ' | ' +
                workspaceManager.snapshotJSON[i]['timestamp'] ==
            snapshotSelection
        ) {
            viewSnapshotHelper(workspaceManager.snapshotJSON[i]);
            break;
        }
    }
}

async function viewSnapshotFromActiveFile() {
    if (vscode.window.activeTextEditor == undefined) return;
    if (workspaceManager.snapshotJSON.length == 0) {
        vscode.window.showInformationMessage('No Snapshot for active file!');
        return;
    }
    let snapshotSelection = undefined;
    let filteredSnapshots = workspaceManager.snapshotJSON.filter((value) => {
        return (
            value['path'] == vscode.window.activeTextEditor.document.uri.fsPath
        );
    });
    if (filteredSnapshots.length == 0) {
        vscode.window.showInformationMessage('No Snapshot for active file!');
        return;
    }
    await vscode.window
        .showQuickPick(
            filteredSnapshots.map((value, index, array) => {
                return (
                    value['name'] +
                    ': ' +
                    value['path'] +
                    ' | ' +
                    value['timestamp']
                );
            })
        )
        .then((value) => {
            snapshotSelection = value;
        });
    if (snapshotSelection == undefined) return;

    for (let i in workspaceManager.snapshotJSON) {
        if (
            workspaceManager.snapshotJSON[i]['name'] +
                ': ' +
                workspaceManager.snapshotJSON[i]['path'] +
                ' | ' +
                workspaceManager.snapshotJSON[i]['timestamp'] ==
            snapshotSelection
        ) {
            viewSnapshotHelper(workspaceManager.snapshotJSON[i]);
            break;
        }
    }
}

function viewSnapshotHelper(snapshot) {
    let text =
        '/*\nSnapshot\npath: ' +
        snapshot['path'] +
        '\nfrom: ' +
        snapshot['timestamp'] +
        '\n';
    if (snapshot['name'] != '') text += 'name: ' + snapshot['name'] + '\n';
    text += '*/\n\n' + snapshot['text'];
    vscode.workspace.openTextDocument({ content: text }).then((a) => {
        vscode.window.showTextDocument(a, 1, false);
    });
}

async function deleteAllSnapshots() {
    if (workspaceManager.snapshotJSON.length == 0) return;
    let deleteAll = false;
    await vscode.window
        .showWarningMessage('Delete all Snapshots?', ...['Yes', 'Cancel'])
        .then((value) => {
            if (value == 'Cancel' || value == undefined) return;
            deleteAll = true;
        });
    if (!deleteAll) return;
    workspaceManager.snapshotJSON = [];
    workspaceManager.saveSnapshots();
}

async function deleteAllSnapshotsFromActiveFile() {
    if (vscode.window.activeTextEditor == undefined) return;
    if (workspaceManager.snapshotJSON.length == 0) return;
    let deleteAll = false;
    await vscode.window
        .showWarningMessage(
            'Delete all Snapshots from active file?',
            ...['Yes', 'Cancel']
        )
        .then((value) => {
            if (value == 'Cancel' || value == undefined) return;
            deleteAll = true;
        });
    if (!deleteAll) return;

    workspaceManager.snapshotJSON = workspaceManager.snapshotJSON.filter(
        (value, index, arr) => {
            return (
                value['path'] !=
                vscode.window.activeTextEditor.document.uri.fsPath
            );
        }
    );
    workspaceManager.saveSnapshots();
}

async function deleteSnapshot() {
    if (workspaceManager.snapshotJSON.length == 0) return;
    let snapshotSelection = undefined;
    await vscode.window
        .showQuickPick(
            workspaceManager.snapshotJSON.map((value, index, array) => {
                return (
                    value['name'] +
                    ': ' +
                    value['path'] +
                    ' | ' +
                    value['timestamp']
                );
            })
        )
        .then((value) => {
            snapshotSelection = value;
        });
    if (snapshotSelection == undefined) return;
    for (let i in workspaceManager.snapshotJSON) {
        if (
            workspaceManager.snapshotJSON[i]['name'] +
                ': ' +
                workspaceManager.snapshotJSON[i]['path'] +
                ' | ' +
                workspaceManager.snapshotJSON[i]['timestamp'] ==
            snapshotSelection
        ) {
            workspaceManager.snapshotJSON.splice(i, 1);
        }
    }
    workspaceManager.saveSnapshots();
}

module.exports = {
    createSnapshot,
    restoreSnapshot,
    viewSnapshot,
    viewSnapshotFromActiveFile,
    deleteAllSnapshots,
    deleteAllSnapshotsFromActiveFile,
    deleteSnapshot,
};
