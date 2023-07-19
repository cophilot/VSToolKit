const vscode = require('vscode');

async function moveSelectionToLeft() {
    if (vscode.window.activeTextEditor == undefined) {
        return;
    }
    let selection = vscode.window.activeTextEditor.selection;
    if (selection.isEmpty) return;
    //return if at start of line
    if (selection.start.character == 0) {
        if (
            !vscode.workspace
                .getConfiguration('vstoolkit.move')
                .get('MoveBetweenLines')
        )
            return;
        let newLine = undefined;
        let newStartCharacter = undefined;
        let text = undefined;
        await vscode.window.activeTextEditor.edit(async (editBuilder) => {
            newLine = selection.start.line - 1;
            if (newLine < 0) return;
            newStartCharacter =
                vscode.window.activeTextEditor.document.lineAt(newLine).text
                    .length;
            text = vscode.window.activeTextEditor.document.getText(selection);
            editBuilder.delete(selection);
            editBuilder.insert(
                new vscode.Position(newLine, newStartCharacter),
                text
            );
        });
        if (newLine != undefined)
            vscode.window.activeTextEditor.selection = new vscode.Selection(
                new vscode.Position(newLine, newStartCharacter),
                new vscode.Position(newLine, newStartCharacter + text.length)
            );
        return;
    }
    let c = vscode.window.activeTextEditor.document.getText(
        new vscode.Range(
            new vscode.Position(
                selection.start.line,
                selection.start.character - 1
            ),
            new vscode.Position(selection.start.line, selection.start.character)
        )
    );
    await vscode.window.activeTextEditor.edit(async (editBuilder) => {
        editBuilder.delete(
            new vscode.Selection(
                new vscode.Position(
                    selection.start.line,
                    selection.start.character - 1
                ),
                new vscode.Position(
                    selection.start.line,
                    selection.start.character
                )
            )
        );
        editBuilder.insert(
            new vscode.Position(selection.end.line, selection.end.character),
            c
        );
    });
    vscode.window.activeTextEditor.selection = new vscode.Selection(
        new vscode.Position(
            selection.start.line,
            selection.start.character - 1
        ),
        new vscode.Position(selection.end.line, selection.end.character - 1)
    );
}

async function moveSelectionToRight() {
    if (vscode.window.activeTextEditor == undefined) {
        return;
    }
    let selection = vscode.window.activeTextEditor.selection;
    if (selection.isEmpty) return;
    //return if at end of line
    if (
        selection.end.character ==
        vscode.window.activeTextEditor.document.lineAt(selection.start.line)
            .range.end.character
    ) {
        if (
            !vscode.workspace
                .getConfiguration('vstoolkit.move')
                .get('MoveBetweenLines')
        )
            return;
        let newLine = undefined;
        let text = undefined;
        await vscode.window.activeTextEditor.edit(async (editBuilder) => {
            newLine = selection.start.line + 1;
            text = vscode.window.activeTextEditor.document.getText(selection);
            editBuilder.delete(selection);
            editBuilder.insert(new vscode.Position(newLine, 0), text);
        });
        if (newLine != undefined)
            vscode.window.activeTextEditor.selection = new vscode.Selection(
                new vscode.Position(newLine, 0),
                new vscode.Position(newLine, text.length)
            );
        return;
    }
    //get character after selection
    let c = vscode.window.activeTextEditor.document.getText(
        new vscode.Range(
            new vscode.Position(selection.end.line, selection.end.character),
            new vscode.Position(selection.end.line, selection.end.character + 1)
        )
    );
    await vscode.window.activeTextEditor.edit(async (editBuilder) => {
        editBuilder.delete(
            new vscode.Selection(
                new vscode.Position(
                    selection.end.line,
                    selection.end.character
                ),
                new vscode.Position(
                    selection.end.line,
                    selection.end.character + 1
                )
            )
        );
        editBuilder.insert(
            new vscode.Position(
                selection.start.line,
                selection.start.character
            ),
            c
        );
    });
    vscode.window.activeTextEditor.selection = new vscode.Selection(
        new vscode.Position(
            selection.start.line,
            selection.start.character + 1
        ),
        new vscode.Position(selection.end.line, selection.end.character + 1)
    );
}

module.exports = {
    moveSelectionToLeft,
    moveSelectionToRight,
};
