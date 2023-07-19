const path = require('path');
const fs = require('fs');

class WorkspaceManager {
    constructor() {
        this.workspacePath = undefined;
        this.snapshotFile = undefined;
        this.snapshotJSON = undefined;
        this.clipboardFile = undefined;
        this.clipboardJSON = undefined;
    }

    addSnapshot(snapshot) {
        if (this.snapshotJSON == undefined) this.init();
        this.snapshotJSON.push(snapshot);
        fs.writeFileSync(
            this.snapshotFile,
            JSON.stringify(this.snapshotJSON, null, 2)
        );
    }

    saveSnapshots() {
        if (this.snapshotJSON == undefined) this.init();
        fs.writeFileSync(
            this.snapshotFile,
            JSON.stringify(this.snapshotJSON, null, 2)
        );
    }

    saveClipboardFile() {
        if (this.clipboardJSON == undefined) this.init();
        fs.writeFileSync(
            this.clipboardFile,
            JSON.stringify(this.clipboardJSON, null, 2)
        );
    }

    init() {
        this.workspacePath = path.join(
            __dirname,
            '../../',
            'vstoolkit-workspace'
        );

        try {
            this.snapshotFile = path.join(this.workspacePath, 'snapshots.json');
            this.snapshotJSON = JSON.parse(
                fs.readFileSync(this.snapshotFile).toString()
            );
        } catch (e) {
            this.createWorkspace();

            this.snapshotFile = path.join(this.workspacePath, 'snapshots.json');
            this.snapshotJSON = JSON.parse(
                fs.readFileSync(this.snapshotFile).toString()
            );
        }

        try {
            this.clipboardFile = path.join(
                this.workspacePath,
                'advancedClipboardFile.json'
            );

            this.clipboardJSON = JSON.parse(
                fs.readFileSync(this.clipboardFile).toString()
            );
        } catch (e) {
            this.createWorkspace();

            this.clipboardFile = path.join(
                this.workspacePath,
                'advancedClipboardFile.json'
            );

            this.clipboardJSON = JSON.parse(
                fs.readFileSync(this.clipboardFile).toString()
            );
        }
    }

    createWorkspace() {
        //make workspace
        fs.mkdir(this.workspacePath, (err) => {
            if (err) throw err;
        });
        //make snapshot.json
        fs.writeFileSync(path.join(this.workspacePath, 'snapshots.json'), '[]');
        //make advancedClipboardFile.json
        fs.writeFileSync(
            path.join(this.workspacePath, 'advancedClipboardFile.json'),
            '[]'
        );
    }
}

module.exports = WorkspaceManager;
