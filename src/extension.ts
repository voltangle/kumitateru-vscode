import * as vscode from 'vscode';
import { runKmtrFunction } from './buildApi';

export function activate(context: vscode.ExtensionContext) {
	console.log('Kumitateru is now active!');
	context.subscriptions.push(vscode.commands.registerCommand('kumitateru.buildProject', () => runKmtrFunction('build')));
	context.subscriptions.push(vscode.commands.registerCommand("kumitateru.runProject", () => runKmtrFunction('run')));
	context.subscriptions.push(vscode.commands.registerCommand('kumitateru.packageRelease', () => runKmtrFunction('package')));
}

export function deactivate() {
	console.log("Kumitateru plugin was deactivated.");
}
