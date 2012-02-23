#Installation
sudo npm install illumina2bam-tools -g

##Settings
	/usr/local/lib/node_modules/illumina2bam-tools/settings.json

- specify which directory contains the distributed jars from the illumina2bam project
- the scripts will automatically search for the jars by looking recursively one folder "up" from your current working directory
- the scripts will try to write to the `settings.json` file but they will fail (somewhat gracefully) as long as the scripts aren't run as a user with write permission to the `/usr/local/lib/node_modules/illumina2bam-tools/` directory
- specify the directory where your jars are located (in the `settings.json` file) in order to speed up the process

##Usage

###`illumina2bam_demultiplex_wrapper`
Wrapper for performing illumina bcl to bam encoding and demultiplexing.

Usage: `illumina2bam_demultiplex_wrapper`

	Options:
	  -s, --samplesheet         Samplesheet                                                                                                                  [required]
	  -b, --basecallsDirectory  Basecalls directory                                                                                                          [required]
	  -o, --outputDirectory     Output directory, sub dirs /project/RunID will be created                                                                    [required]
	  -t, --tempDirectory       Temp directory, sub dirs will be created                                                                                     [required]
	  -f                        Output format [bam|sam], default to 'bam'                                                                                    [default: "bam"]
	  -v, --verbose             Verbose output                                                                                                             
	  -m                        Maximum mismatches for a barcode to be considered a match                                                                    [default: 0]
	  -d                        Minimum difference between number of mismatches in the best and second best barcodes for a barcode to be considered a match  [default: 2]
	  -n                        Maximum allowable number of no-calls in a barcode read before it is considered unmatchable                                   [default: 0]
	  --im                      Maximum memory heap size for illumina2bam process, defaults to 2g                                                            [default: "2g"]
	  --ib                      Maximum memory heap size for BamIndexDecoder process, defaults to 1g                                                         [default: "1g"]
	  --debug                   Parse the first tile in each lane                                                                                            [default: false]
	  --force                   Disables check if library already exists, hence overwrites files if the already exist                                        [default: false]
	  --omitLanes               Comma separated list with numbers identifying lanes to omit                                                                  [default: ""]