#! /usr/bin/env node
import browse from './browse.js'

const args = process.argv.slice(2)
browse(args[0] /* TODO options */)
