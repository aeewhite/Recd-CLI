#!/usr/bin/env node

// Argument Parsing
var argv	= require('yargs')
				.usage('Usage: $0 -u [streamUrl] -f [filename] -b [bitrate] -d [minutes]')
				.demand(['u','f','b'])
				.argv,
	cursor	= require('ansi')(process.stdout),
	path 	= require('path');


var url			= argv.u,
	filename	= argv.f,
	bitrate		= argv.b,
	duration	= argv.d;

// Create stream objects
var networkStream, fileStream;

// Create timing objects
var startTime, elapsedTime, timeUpdater;

// Calculate bitrate
var recordingBitrate = (bitrate * 1000) / 8; // Converts from kbs to bit/s

startTime = getCurrentTimeInSeconds();

setInterval(printElapsedTime, 500);

// Do some checking of the user inputs

if(filename === true || filename === ""){
	console.log("Filename must not be empty");
	process.exit(1);
}

filename = makeAbsoluteFilepath(filename);


// 
// Utility Functions
//

function makeAbsoluteFilepath(filename){
	filename = path.normalize(filename);
	if(!path.isAbsolute(filename)){
		// Make filename absolute, if it isn't already
		abs = process.cwd() + filename;
	}
	else{
		abs = filename;
	}
	return abs;
}

function getCurrentTimeInSeconds() {
	return new Date().getTime() / 1000;
}

/*
Input:  time in seconds
Output: HH:MM:SS (String) 
 */
function formatTime(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s  < 10 ? "0" + s : s);
}

function printTime(time){
	var formatted = "\r" + formatTime(time);
	cursor.hide();
	process.stdout.write(formatted);
	return;
}

function printElapsedTime(){
	printTime(getCurrentTimeInSeconds() - startTime);
}

//
// Cleanup functions
// 

process.on('exit',function(){
	process.stdout.write("\n");
	cursor.show();
});

process.on('SIGINT',function(){
	cursor.show();
	process.exit();
});