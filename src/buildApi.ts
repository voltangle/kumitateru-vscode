import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { getParsedConfig } from './configParser';
import * as process from 'process';

export function buildProject() {
    let workspaceUri = vscode.workspace.workspaceFolders;
    if (workspaceUri === undefined) {
        vscode.window.showErrorMessage('No workspaces were found, can\'t execute this command.');
    } else {
        let devicesArray = getParsedConfig(workspaceUri[0].uri.path + '/package.toml')["package_meta"]["devices"];
        vscode.window.showQuickPick(devicesArray, { title: 'Select the target device', canPickMany: false }).then((value) => {
            if (value !== undefined) {
                let statusBarMessage = vscode.window.setStatusBarMessage('Building the project...');
                let writeEmitter = new vscode.EventEmitter<string>();
                let runProcess: child_process.ChildProcess;
                const pty: vscode.Pseudoterminal = {
                    onDidWrite: writeEmitter.event,
                    open: () => {
                    },
                    close: () => {
                        runProcess.kill();
                    },
                    handleInput: (data) => {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        let env = Object.assign({}, { 'KMTR_IDE_SILENT': 'true' }, process.env);
                        
                        runProcess = child_process.exec(workspaceUri[0].uri.path + '/kmtr build --target ' + value, {
                            cwd: workspaceUri[0].uri.path,
                            env
                        });
                        runProcess.stdout.on('data', (data: string) => {
                            let readyData = data.split('\n');
                            readyData.forEach((element) => {
                                element = element + '\r';
                            });
                            readyData.forEach((element) => {
                                writeEmitter.fire(element + '\n');
                                writeEmitter.fire('\r');
                            });
                        });
                        runProcess.stderr.on('data', (data) => {
                            let readyData = data.split('\n');
                            readyData.forEach((element) => {
                                element = element + '\r';
                            });
                            readyData.forEach((element) => {
                                writeEmitter.fire(element + '\n');
                                writeEmitter.fire('\r');
                            });
                        });
                        runProcess.on('exit', (code) => {
                            if (code === null) {
                                vscode.window.showInformationMessage('Build not completed.');
                            } else {
                                if (code !== 0) {
                                    vscode.window.showErrorMessage('Build finished with errors.');
                                } else {
                                    vscode.window.showInformationMessage('Build finished successfully.');
                                }
                            }
                            statusBarMessage.dispose();
                        });
                    }
                };
                let terminal = vscode.window.createTerminal({
                    name: 'Kumitateru Build',
                    pty
                });
                terminal.sendText('run');
                terminal.show();
            }
        });
    }
}

export function runProject() {    
    let workspaceUri = vscode.workspace.workspaceFolders;

    if (workspaceUri === undefined) {
        vscode.window.showErrorMessage('No workspaces were found, can\'t execute this command.');
    } else {        
        let devicesArray = getParsedConfig(workspaceUri[0].uri.path + '/package.toml')["package_meta"]["devices"];
        vscode.window.showQuickPick(devicesArray, { title: 'Select the target device', canPickMany: false }).then((value) => {
            if (value !== undefined) {
                let statusBarMessage = vscode.window.setStatusBarMessage('Running the project...');
                let writeEmitter = new vscode.EventEmitter<string>();
                let runProcess: child_process.ChildProcess;
                const pty: vscode.Pseudoterminal = {
                    onDidWrite: writeEmitter.event,
                    open: () => {
                    },
                    close: () => {
                        runProcess.kill();
                    },
                    handleInput: (data) => {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        let env = Object.assign({}, { 'KMTR_IDE_SILENT': 'true' }, process.env);
                        
                        runProcess = child_process.exec(workspaceUri[0].uri.path + '/kmtr run --target ' + value, {
                            cwd: workspaceUri[0].uri.path,
                            env
                        });
                        runProcess.stdout.on('data', (data: string) => {
                            let readyData = data.split('\n');
                            readyData.forEach((element) => {
                                element = element + '\r';
                            });
                            readyData.forEach((element) => {
                                writeEmitter.fire(element + '\n');
                                writeEmitter.fire('\r');
                            });
                        });
                        runProcess.stderr.on('data', (data) => {
                            let readyData = data.split('\n');
                            readyData.forEach((element) => {
                                element = element + '\r';
                            });
                            readyData.forEach((element) => {
                                writeEmitter.fire(element + '\n');
                                writeEmitter.fire('\r');
                            });
                        });
                        runProcess.on('exit', (code) => {
                            if (code === null) {
                                vscode.window.showInformationMessage('Run finished.');
                            } else {
                                if (code !== 0) {
                                    vscode.window.showErrorMessage('Run finished with errors.');
                                } else {
                                    vscode.window.showInformationMessage('Run finished successfully.');
                                }
                            }
                            statusBarMessage.dispose();
                        });
                    }
                };
                let terminal = vscode.window.createTerminal({
                    name: 'Kumitateru Run',
                    pty
                });
                terminal.sendText('run');
                terminal.show();
            }
        });
    }
}