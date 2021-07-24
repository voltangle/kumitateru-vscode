import * as vscode from 'vscode';
import * as bombadil from '@sgarciac/bombadil';
import * as fs from 'fs';
import * as child_process from 'child_process';

export function buildProject() {
    let workspaceUri = vscode.workspace.workspaceFolders;
    if (workspaceUri === undefined) {
        vscode.window.showErrorMessage('No workspaces were found, can\'t execute this command.');
    } else {
        let rawConfig = fs.readFileSync(workspaceUri[0].uri.path + '/kumitateru.toml', 'utf-8');
        let reader = new bombadil.TomlReader;
        reader.readToml(rawConfig);
        vscode.window.showQuickPick(reader.result["package_meta"]["devices"], { title: 'Select the target device', canPickMany: false }).then((value) => {
            let statusBarMessage = vscode.window.setStatusBarMessage('Building the project...');
            let process = child_process.exec(workspaceUri[0].uri.path + '/kmtr build --target ' + value, { cwd: workspaceUri[0].uri.path });
            process.on('exit', (code) => {
                if (code !== 0) {
                    vscode.window.showErrorMessage('Build finished with errors. Rerun from the command line for details.');
                } else {
                    vscode.window.showInformationMessage('Build finished successfully.');
                }
                statusBarMessage.dispose();
            });
        });
    }
}

export function runProject() {
    let workspaceUri = vscode.workspace.workspaceFolders;
    if (workspaceUri === undefined) {
        vscode.window.showErrorMessage('No workspaces were found, can\'t execute this command.');
    } else {
        let rawConfig = fs.readFileSync(workspaceUri[0].uri.path + '/kumitateru.toml', 'utf-8');
        let reader = new bombadil.TomlReader;
        reader.readToml(rawConfig);
        vscode.window.showQuickPick(reader.result["package_meta"]["devices"], { title: 'Select the target device', canPickMany: false }).then((value) => {
            let statusBarMessage = vscode.window.setStatusBarMessage('Running the project...');
            let process = child_process.exec(workspaceUri[0].uri.path + '/kmtr run --target ' + value, { cwd: workspaceUri[0].uri.path });
            process.on('exit', (code) => {
                if (code !== 0) {
                    vscode.window.showErrorMessage('Build finished with errors. Rerun from the command line for details.');
                } else {
                    vscode.window.showInformationMessage('Run finished successfully.');
                }
                statusBarMessage.dispose();
            });
        });
    }
}