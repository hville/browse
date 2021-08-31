#!/usr/bin/env node

import * as http from 'http'
import esbuild from 'esbuild'
import ChromeLauncher from 'chrome-launcher'
import {resolve} from 'path'

//https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
const flags = ChromeLauncher.Launcher.defaultFlags()
	.filter(flag => flag !== '--disable-extensions' && flag !== '--mute-audio')
	.concat(['--autoplay-policy=no-user-gesture-required', '--auto-open-devtools-for-tabs'])

const args = process.argv.slice(2),
			path = resolve(process.cwd(), args[0]),
			port = 8080

let html = '',
		pendingResponse = null

function createHTML(result) {
	html = /* html */`<!DOCTYPE html>
	<script>${	result.outputFiles[0].text }</script>
	<script>fetch('RELOAD?').then( response => location.reload() )</script>
	`
}

http.createServer(function (req, res) {
	console.log('request', req.url, req.method, !!req.socket)
	if (req.url === '/') res.writeHead(200).end(html)
	else if (req.url === '/RELOAD?') pendingResponse = res
	//else /favicon.ico
}).listen(port)

esbuild.build({
	entryPoints: [path],
	bundle: true,
	write: false,
	watch: {
    onRebuild(error, result) {
      if (error) console.error('watch rebuild failed:', error)
      else {
				createHTML(result)
				if (pendingResponse) pendingResponse.writeHead(200).end()
				pendingResponse = null
				console.log('rebuild and reloaded')
			}
    }
	}
}).then(result => {
	createHTML(result)
	ChromeLauncher.launch({
		startingUrl: `http://localhost:${ port }`,
		ignoreDefaultFlags: true,
		chromeFlags: flags,
	})
})
