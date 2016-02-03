#!/usr/bin/env node

// Argument Parsing
var argv = require('yargs')
			.usage('Usage: $0 -u [streamUrl] -f [filename] -b [bitrate] -d [minutes]')
			.demand(['u','f','b'])
			.argv;

var url			= argv.u,
	filename	= argv.f,
	bitrate		= argv.b,
	duration	= argv.d;

	