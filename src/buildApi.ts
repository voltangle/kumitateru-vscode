import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { getParsedConfig } from './configParser';
import * as process from 'process';

export function runKmtrFunction(action: string) {
    let workspaceUri = vscode.workspace.workspaceFolders;

    if (workspaceUri === undefined) {
        vscode.window.showErrorMessage('No workspaces were found, can\'t execute this command.');
    } else {
        let devicesArray = getParsedConfig(workspaceUri[0].uri.path + '/package.toml')["package_meta"]["devices"];
        let buildFunction = (value) => {
            if (value !== undefined) {
                let statusBarMessage = vscode.window.setStatusBarMessage(action === 'run' ? 'Running the project...' : 'Building the project...');
                let writeEmitter = new vscode.EventEmitter<string>();
                let runProcess: child_process.ChildProcess;
                const pty: vscode.Pseudoterminal = {
                    onDidWrite: writeEmitter.event,
                    open: () => {
                    },
                    close: () => {
                        runProcess.kill();
                    },
                    handleInput: async (data) => {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        let env = Object.assign({}, { 'KMTR_IDE_SILENT': 'true' }, process.env);

                        let runCommand: string;
                        switch (action) {
                            case 'run':
                                runCommand = 'kumitateru ' + action + ' --target ' + value;
                                break;
                            
                            case 'build':
                                runCommand = 'kumitateru ' + action + ' --target ' + value;
                                break;

                            case 'package':
                                runCommand = 'kumitateru package';
                                break;
                            case 'clean':
                                runCommand = 'kumitateru clean';
                            default:
                                break;
                        }

                        runProcess = child_process.exec(runCommand, {
                            cwd: workspaceUri[0].uri.path,
                            env
                        });
                        runProcess.stdout.on('data', (data: string) => {
                            let readyData = data.split('\n');
                            readyData.forEach((element) => {
                                element = element + '\r';
                            });
                            readyData.forEach((element) => {
                                markErrorsInEditor(element);
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
                                markErrorsInEditor(element);
                                writeEmitter.fire(element + '\n');
                                writeEmitter.fire('\r');
                            });
                        });
                        runProcess.on('exit', (code) => {
                            if (code === null) {
                                let message: string;
                                switch (action) {
                                    case 'build': message = 'Build finished'; break;
                                    case 'run': message = 'Run finished'; break;
                                    case 'package': message = 'Package finished'; break;
                                    case 'clean': message = 'Cleaned'; break;
                                }
                                vscode.window.showInformationMessage(message);
                            } else {
                                if (code !== 0) {
                                    let message: string;
                                    switch (action) {
                                        case 'build': message = 'Build finished with errors'; break;
                                        case 'run': message = 'Run finished with errors'; break;
                                        case 'package': message = 'Package finished with errors'; break;
                                        case 'clean': message = 'Cleaned'; break;
                                    }
                                    vscode.window.showErrorMessage(message);
                                } else {
                                    let message: string;
                                    switch (action) {
                                        case 'build': message = 'Build finished successfully'; break;
                                        case 'run': message = 'Run finished successfully'; break;
                                        case 'package': message = 'Package finished successfully'; break;
                                        case 'clean': message = 'Cleaned'; break;
                                    }
                                    vscode.window.showInformationMessage(message);
                                }
                            }
                            statusBarMessage.dispose();
                        });
                    }
                };
                let terminal = vscode.window.createTerminal({
                    name: action === 'run' ? 'Kumitateru Run' : 'Kumitateru Build',
                    pty
                });
                terminal.sendText('run');
                terminal.show();
            }
        };
        if (action === 'package' || action === 'clean') {
            buildFunction(action);
        } else {
            vscode.window.showQuickPick(devicesArray, { title: 'Select the target device', canPickMany: false }).then((value) => buildFunction(value));
        }
    }
}

function markErrorsInEditor(compilerOutput: string) {
    let compilerOutArr = compilerOutput.split(' ');
    switch (compilerOutArr[0]) {
        case 'WARNING:': 
            break;
        case 'ERROR:':
            let fileRefLength = compilerOutArr[2].length;
            let fileCursorLocation = compilerOutArr[2].match("\\d+");
            let fileLocation = compilerOutArr[2].slice(0, fileCursorLocation.index - 1);
            break;
    }
}
