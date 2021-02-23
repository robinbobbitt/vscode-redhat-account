/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import Logger from './logger';

export class Keychain {
	constructor(private serviceId:string, private context: vscode.ExtensionContext) { }
	async setToken(token: string): Promise<void> {
		try {
			Logger.info(`Storing token for ${this.serviceId}`);
			return await this.context.secrets.store(this.serviceId, token);
		} catch (e) {
			// Ignore
			Logger.error(`Storing ${this.serviceId} token failed: ${e}`);
			const troubleshooting = "Troubleshooting Guide";
			const result = await vscode.window.showErrorMessage(`Writing login information to the keychain failed with error '${e.message}'.`, troubleshooting);
			if (result === troubleshooting) {
				vscode.env.openExternal(vscode.Uri.parse('https://code.visualstudio.com/docs/editor/settings-sync#_troubleshooting-keychain-issues'));
			}
		}
	}

	async getToken(): Promise<string | null | undefined> {
		try {
			return await this.context.secrets.get(this.serviceId);
		} catch (e) {
			// Ignore
			Logger.error(`Getting ${this.serviceId} token failed: ${e}`);
			return Promise.resolve(undefined);
		}
	}

	async deleteToken(): Promise<void> {
		try {
			Logger.info(`Deleting token for ${this.serviceId}`);
			return await this.context.secrets.delete(this.serviceId);
		} catch (e) {
			// Ignore
			Logger.error(`Deleting ${this.serviceId} token failed: ${e}`);
			return Promise.resolve(undefined);
		}
	}
}