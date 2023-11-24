const vscode = require('vscode');

function addMarkdownOverview() {
    if (vscode.window.activeTextEditor == undefined) {
        vscode.window.showErrorMessage('Please open an Markdown file first!');
        return;
    }

    // Check if TextEditor is Markdown
    if (!vscode.window.activeTextEditor.document.fileName.endsWith('.md')) {
        vscode.window.showErrorMessage('Only works with Markdown files!');
        return;
    }

    let repoName = undefined;
    let headings = [];
    for (
        let i = 0;
        i < vscode.window.activeTextEditor.document.lineCount;
        i++
    ) {
        let line = vscode.window.activeTextEditor.document.lineAt(i).text;

        let includeFirstLine = vscode.workspace
            .getConfiguration('vstoolkit.Markdown')
            .get('IncludeFirstHeading');

        if (line.startsWith('#')) {
            let level = line.match(/#/g).length - (includeFirstLine ? 0 : 1);
            line = line.replace(/#/g, '');
            line = line.replace(/\*/g, '').replace(/\`/g, '');
            if (line.includes('[') && line.includes(']')) {
                line = line.split('[')[1].split(']')[0];
            }
            if (line.startsWith(' ')) line = line.replace(' ', '');
            if (level == 0 && !includeFirstLine) {
                repoName = line;
                continue;
            }
            let header = {
                name: line,
                level: level,
            };
            headings.push(header);
        }
    }
    let overview = '';
    for (let i in headings) {
        let line = '';
        for (let j = 1; j < headings[i].level; j++) line += '  ';
        let trimmedName = headings[i].name
            .toLowerCase()
            .replace(/\./g, '')
            .replace(/\s/g, '-')
            .replace(/\&/g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/\]/g, '')
            .replace(/\[/g, '')
            .replace(/\_/g, '')
            .replace(/\>/g, '')
            .replace(/\</g, '')
            .replace(/\*/g, '')
            .replace(/\$/g, '')
            .replace(/\`/g, '')
            .replace(/\"/g, '')
            .replace(/\?/g, '')
            .replace(/\!/g, '')
            .replace(/\%/g, '')
            .replace(/\=/g, '')
            .replace(/\}/g, '')
            .replace(/\{/g, '')
            .replace(/\//g, '');
        line += '* [' + headings[i].name + '](#' + trimmedName + ')';
        overview += line + '\n';
    }

    //vscode.env.clipboard.writeText(overview);
    vscode.window.activeTextEditor.edit(function (editBuilder) {
        editBuilder.insert(
            vscode.window.activeTextEditor.selection.active,
            overview
        );
    });
}

module.exports = {
    addMarkdownOverview,
};
