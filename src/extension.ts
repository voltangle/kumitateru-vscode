import * as vscode from 'vscode';
import { buildProject, runProject } from './buildApi';

export function activate(context: vscode.ExtensionContext) {
	console.log('Kumitateru is now active!');
	context.subscriptions.push(vscode.commands.registerCommand('kumitateru.buildProject', () => buildProject()));
	context.subscriptions.push(vscode.commands.registerCommand("kumitateru.runProject", () => runProject()));
}

export function deactivate() {
	console.log("Kumitateru plugin was deactivated.");
}
