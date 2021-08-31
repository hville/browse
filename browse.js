#!/usr/bin/env node

import * as http from 'http'
import {resolve} from 'path'

import esbuild from 'esbuild'
import ChromeLauncher from 'chrome-launcher'

//https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
const flags = ChromeLauncher.Launcher.defaultFlags()
	.filter(flag => flag !== '--disable-extensions' && flag !== '--mute-audio')
	.concat(['--autoplay-policy=no-user-gesture-required', '--auto-open-devtools-for-tabs'])

export default function(path, {port=8080}={}) {
	let html = '',
			pendingResponse = null

	http.createServer(function (req, res) {
		console.log('request', req.url, req.method, !!req.socket)
		if (req.url === '/') res.writeHead(200).end(html)
		else if (req.url === '/RELOAD?') pendingResponse = res
		//else /favicon.ico
	}).listen(port)

	esbuild.build({
	entryPoints: [resolve(process.cwd(), path)],
	bundle: true,
	write: false,
	watch: {
		onRebuild(error, result) {
			if (error) console.error('watch rebuild failed:', error)
			else {
				html = createHTML(result.outputFiles[0].text)
				if (pendingResponse) pendingResponse.writeHead(200).end()
				pendingResponse = null
				console.log('rebuild and reloaded')
			}
		}
	}
	}).then(result => {
	html = createHTML(result.outputFiles[0].text)
	ChromeLauncher.launch({
		startingUrl: `http://localhost:${ port }`,
		ignoreDefaultFlags: true,
		chromeFlags: flags,
	})
	})
}

function createHTML(code) {
	return /* html */`<!DOCTYPE html><script>${ code }</script><script>fetch('RELOAD?').then( response => location.reload() )</script>\n`
}
