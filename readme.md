# Rec'd-CLI

`rec'd-cli` is a command line utility written in node.js for recording mp3 streams to disk. The name comes from another project [Rec'd](https://github.com/aeewhite/Recd), which is basically a GUI for the same purpose.

## Installation

Requires node and npm, then  `npm install -g recd-cli`

## Usage

Usage details can be found with `recd-cli -h`

```
Usage: recd-cli -u [streamUrl] -f [filename] -b [bitrate] -d [minutes]

Options:
  -f, --file      path to file                               [required]
  -u, --url       URL of mp3 stream                          [required]
  -b, --bitrate   bitrate in kbs                             [required]
  -d, --duration  Duration to record, in minutes
  -h, --help      Show help                                   [boolean]

```

