import {createServer} from 'http'
import esbuild from 'esbuild'
import ChromeLauncher from 'chrome-launcher'
import {resolve} from 'path'

//https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
const flags = ChromeLauncher.Launcher.defaultFlags()
	.filter(flag => flag !== '--disable-extensions' && flag !== '--mute-audio')
	.concat(['--autoplay-policy=no-user-gesture-required', '--auto-open-devtools-for-tabs'])

const args = process.argv.slice(2),
			path = resolve(process.cwd(), args[0]),
			html = wrap(await fuse(path)),
			{port} = serve(html),
			{kill} = open(port)
//server.on('close', ()=>console.log('CLOSE'))
//server.close()

async function fuse(path) {
	const bundle = await esbuild.build({
		entryPoints: [path],
		bundle: true,
		write: false,
		watch: {
			onRebuild(error, result) {
				if (error) console.error('watch build failed:', error)
				else console.log('watch build succeeded:', result)
			}
		}
	})
	return bundle.outputFiles[0].text
}

/*
,

*/


function wrap(code) {
	return /* html */`<!DOCTYPE html><script>${	code }</script>`
}

function serve(html) {
	return createServer(function (req, res) {
		//__dirname + req.url
		//res.writeHead(404);
		//res.end(JSON.stringify(err));
		res.writeHead(200)
		res.end(html)
	}).listen(8080)
}

async function open(port=8080) {
	return await ChromeLauncher.launch({
		startingUrl: `http://localhost:${ port }/`,
		ignoreDefaultFlags: true,
		chromeFlags: flags,
	})
	//await ChromeLauncher.killAll()
}
