import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Kumitateru is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('kumitateru.buildProject', () => {
		// vscode.window.showInformationMessage('Hello World from Kumitateru!');
		vscode.window.showQuickPick(["item1", "item2"]);
	}));
	context.subscriptions.push(vscode.commands.registerCommand("kumitateru.runProject", () => {
		console.log("Run");
	}));
}

export function deactivate() {
	console.log("Kumitateru plugin was deactivated.");
}
