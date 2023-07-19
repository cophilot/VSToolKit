const vscode = require('vscode');
const translate = require('translate');
const spelling = require('spelling');
const dictionary = require('spelling/dictionaries/en_US');
const dict = new spelling(dictionary);

async function translateSelection() {
    if (vscode.window.activeTextEditor == undefined) return;
    let selection = vscode.window.activeTextEditor.selection;

    //get selected text
    if (selection.isEmpty) {
        let newRange =
            vscode.window.activeTextEditor.document.getWordRangeAtPosition(
                selection.start
            );
        if (newRange == undefined) {
            vscode.window.showInformationMessage('Select a Text!');
            return;
        }
        selection = new vscode.Selection(newRange.start, newRange.end);
    }
    //get selection text
    let text = vscode.window.activeTextEditor.document.getText(selection);

    //Get translation settings
    let from = undefined;
    let to = undefined;
    let settings = vscode.workspace.getConfiguration('vstoolkit.translate');
    if (settings['DefaultTranslate'].length == 0) {
        //Ask for translate settings
        //from
        from = await vscode.window.showInputBox({
            placeHolder: 'from-language',
            title: 'Translate: ' + text,
        });
        if (from == undefined) return;
        //to
        to = await vscode.window.showInputBox({
            placeHolder: 'to-language',
            title: 'Translate: ' + text,
        });
        if (to == undefined) return;
    } else {
        //Default translate
        let defaultTranslateSelection = undefined;
        let defaultOptions = settings['DefaultTranslate'].map(
            (value, index, array) => {
                return 'From ' + value['from'] + ' to ' + value['to'];
            }
        );
        defaultOptions.push('Custom');
        await vscode.window
            .showQuickPick(defaultOptions, {
                title: 'Translate: ' + text,
            })
            .then((value) => {
                defaultTranslateSelection = value;
            });
        if (defaultTranslateSelection == undefined) return;
        if (defaultTranslateSelection == 'Custom') {
            //from
            from = await vscode.window.showInputBox({
                placeHolder: 'from-language',
                title: 'Translate: ' + text,
            });
            if (from == undefined) return;
            //to
            to = await vscode.window.showInputBox({
                placeHolder: 'to-language',
                title: 'Translate: ' + text,
            });
            if (to == undefined) return;
        } else {
            from = defaultTranslateSelection.split(' ')[1];
            to = defaultTranslateSelection.split(' ')[3];
        }
    }

    //translate
    let translatedText;
    translate.from = from.toLowerCase();
    try {
        translatedText = await translate(text, to.toLowerCase());
    } catch (e) {
        vscode.window.showErrorMessage('' + e);
        return;
    }
    //make first character to lower or upper case
    if (text.charAt(0).toUpperCase() == text.charAt(0)) {
        translatedText =
            translatedText.charAt(0).toUpperCase() + translatedText.slice(1);
    } else {
        translatedText =
            translatedText.charAt(0).toLowerCase() + translatedText.slice(1);
    }
    //remove whitespaces if there are no whitespaces in the original text
    if (!text.includes(' ')) translatedText = translatedText.replace(/\s/g, '');

    //replace
    vscode.window.activeTextEditor.edit((editBuilder) => {
        editBuilder.replace(selection, translatedText);
    });
}

async function checkSpelling() {
    if (vscode.window.activeTextEditor == undefined) return;
    let selection = vscode.window.activeTextEditor.selection;

    //get selected text
    if (selection.isEmpty) {
        let newRange =
            vscode.window.activeTextEditor.document.getWordRangeAtPosition(
                selection.start
            );
        if (newRange == undefined) {
            vscode.window.showInformationMessage('Select a Text!');
            return;
        }
        selection = new vscode.Selection(newRange.start, newRange.end);
    }
    //get selection text
    let text = vscode.window.activeTextEditor.document.getText(selection);
    let textArr = text.split(' ');
    let allRight = true;
    for (let i in textArr) {
        let lookup = dict.lookup(textArr[i]);
        if (!lookup['found']) {
            allRight = false;
            let suggestions = [];
            for (let j in lookup['suggestions']) {
                suggestions.push(lookup['suggestions'][j]['word']);
            }
            if (suggestions.length == 0) {
                vscode.window.showInformationMessage(
                    'Did not found "' + lookup['word'] + '"!'
                );
                continue;
            }
            vscode.window
                .showInformationMessage(
                    'Did not found "' +
                        lookup['word'] +
                        '"! \nDid you mean: ' +
                        suggestions,
                    ...['Replace', 'Cancel']
                )
                .then(async (value) => {
                    if (value == 'Cancel' || value == undefined) return;
                    let replaceWord = undefined;
                    if (suggestions.length == 1) replaceWord = suggestions[0];
                    else {
                        //get replace word from suggestions
                        replaceWord = await vscode.window.showQuickPick(
                            suggestions,
                            { title: 'Replace: ' + lookup['word'] }
                        );
                    }
                    if (replaceWord == undefined) return;
                    text = text.replace(lookup['word'], replaceWord);

                    //replace word
                    vscode.window.activeTextEditor.edit((editBuilder) => {
                        editBuilder.replace(selection, text);
                    });

                    //Set new selection
                    let selectionLength =
                        selection.end.character - selection.start.character;
                    //make selection longer
                    if (selectionLength < text.length) {
                        selection = new vscode.Selection(
                            selection.start,
                            new vscode.Position(
                                selection.end.line,
                                selection.end.character +
                                    (text.length - selectionLength)
                            )
                        );
                    }
                    //make selection shorter
                    if (selectionLength > text.length) {
                        selection = new vscode.Selection(
                            selection.start,
                            new vscode.Position(
                                selection.end.line,
                                selection.end.character -
                                    (selectionLength - text.length)
                            )
                        );
                    }
                });
        }
    }
    if (allRight)
        vscode.window.setStatusBarMessage('Everthing spelled correct', 3000);
}

module.exports = {
    translateSelection,
    checkSpelling,
};
