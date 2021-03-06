#!/usr/bin/env node

// Argument Parsing
var yargs	 	= require('yargs')
					.usage('Usage: $0 (-u [streamUrl] | -m [m3uFile]) -f [filename] -b [bitrate] -d [minutes]')
					.alias('u','url')
					.describe('u','URL of mp3 stream')
					.alias('m','m3u')
					.describe('m','path to m3u playlist file')
					.alias('f','file')
					.describe('f','path to file')
					.alias('b', 'bitrate')
					.describe('b', 'bitrate in kbs')
					.alias('d','duration')
					.describe('d','Duration to record, in minutes')
					.help('h')
					.alias('h','help')
					.demand(['f','b']),
	cursor	 	= require('ansi')(process.stdout),
	path 	 	= require('path'),
	validUrl 	= require('valid-url'),
	fs		 	= require('fs'),
	request	 	= require('request');
	throttle 	= require('stream-throttle');



// Require either url or m3u, but not both
var src;
if(yargs.argv.u && yargs.argv.m){
	error('Options -u and -m are mutually exclusive');
}
else if (!(yargs.argv.u || yargs.argv.m)){
	error('Must supply either -u or -m option');
}
else{
	if(yargs.argv.u) src = "url";
	if(yargs.argv.m) src = "m3u";
}


var url			= yargs.argv.u,
	m3u 		= yargs.argv.m,
	filename	= yargs.argv.f,
	bitrate		= yargs.argv.b,
	duration	= yargs.argv.d;

//
// User Input Checking
//


// Parse the url from the m3u
if(src == "m3u" && (m3u === true || m3u === "")){
	error("m3u path must not be empty");
}

if(src == "m3u"){
	m3u = makeAbsoluteFilepath(m3u);
	url = fs.readFileSync(m3u).toString().split('\n')[0].trim();
}

if(url === true || !validUrl.isUri(url)){
	error('Stream URL is not valid');
}

if(filename === true || filename === ""){
	error("Filename must not be empty");
}

if(bitrate === true || isNaN(Number(bitrate))){
	error("Bitrate must be a number");
}

if(duration && (duration === true || isNaN(Number(duration)))){
	error("Duration must be a number");
}

filename = makeAbsoluteFilepath(filename);



// 
// Get set up for recording
// 


// Create stream objects
var networkStream, fileStream;

// Create timing objects
var startTime, elapsedTime, timeUpdater;

// Calculate bitrate
var recordingBitrate = (bitrate * 1000) / 8; // Converts from kbs to bit/s

// Create file stream for saving
fileStream = fs.createWriteStream(filename);

// Start network stream
networkStream = request
					.get(url)
					.pipe(new throttle.Throttle({rate:recordingBitrate}))
					.pipe(fileStream);

// Start stream timer
startTime = getCurrentTimeInSeconds();
setInterval(printElapsedTime, 500);

// Close up the file stream when stream is finished
networkStream.on('end',function(){
	fileStream.end();
});
// Handle network streaming errors
networkStream.on('error', function(err) {
	console.log('something is wrong :( ');
	console.log(err);
	fileStream.close();
});


// 
// Utility Functions
//

function makeAbsoluteFilepath(filename){
	filename = path.normalize(filename);
	if(!path.isAbsolute(filename)){
		// Make filename absolute, if it isn't already
		abs = process.cwd() + "/" + filename;
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
	var elapsedTime = getCurrentTimeInSeconds() - startTime;
	printTime(elapsedTime);
	if(duration < (elapsedTime / 60)){
		stopRecording();
	}
}

//
// Cleanup functions
//

function error(message){
	console.log("ERROR: "+ message);
	console.log("\n" + yargs.help());
	process.exit(1);
}

function stopRecording(){
	if(networkStream){
		networkStream.end();
	}
	process.exit();
}

process.on('exit',function(){
	process.stdout.write("\n");
	cursor.show();
});

process.on('SIGINT',function(){
	cursor.show();
	process.exit();
});