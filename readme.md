# Rec'd-CLI

`recd-cli` is a command line utility written in node.js for recording mp3 streams to disk. The name comes from another project [Rec'd](https://github.com/aeewhite/Recd), which is a GUI for the same purpose.

## Installation

Requires node and npm, then  `npm install -g recd-cli`

## Usage

Usage details can be found with `recd-cli --help`

```
$ recd-cli --help                                              
Usage: recd-cli.js (-u [streamUrl] | -m [m3uFile]) -f [filename] -b [bitrate] -d [minutes]

Options:
  -u, --url       URL of mp3 stream
  -m, --m3u       path to m3u playlist file
  -f, --file      path to file                                        [required]
  -b, --bitrate   bitrate in kbs                                      [required]
  -d, --duration  Duration to record, in minutes
  -h, --help      Show help                                            [boolean]


```

