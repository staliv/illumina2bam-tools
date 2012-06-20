#Installation

Requires Node.js. In order to install you can use:

	git clone https://github.com/joyent/node.git
	cd node/
	git checkout v0.6.19 //for example
	./configure
	make
	make install
	
Now you have node and npm setup, continue to install illumina2bam-tools:	

	sudo npm install illumina2bam-tools -g

OR

	git clone http://github.com/staliv/illumina2bam-tools.git
	cd illumina2bam-tools
	sudo npm install . -g

This will create links in the `/usr/local/bin/` directory for the existing tools in this package. 

##Settings
	/usr/local/lib/node_modules/illumina2bam-tools/settings.json

- specify which directory contains the distributed jars from the illumina2bam project
- the scripts will automatically search for the jars by looking recursively one folder "up" from your current working directory (when invoking for example the `illumina2bam_demultiplex_wrapper`)
- the scripts will try to write to the `settings.json` file but they will fail (somewhat gracefully) as long as the scripts aren't running as a user with write permissions to the `/usr/local/lib/node_modules/illumina2bam-tools/` directory
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
	  --force                   Disables check if library already exists, hence overwrites files if they already exist                                        [default: false]
	  --omitLanes               Comma separated list with numbers identifying lanes to omit                                                                  [default: ""]
	  --skipUndetermined        Skips output of undetermined reads. Saves lots of I/O when re-running a single lane for example.                             [default: false]

###Samplesheet:

- Headers in the samplesheet that have (nn) after the header name will have that id added as meta data with the corresponding value in the read group of the resulting bam.
- Lines that begin with a "#" will be dismissed.
- The ReadString accepts the values:
	1. I = Index/Barcode
	2. Y = Bases are read
	3. N = Bases are skipped
	4. J = Joker positions in the barcode, useful if one cycle is messed up and you need to mask one of the bases in the barcode and still be able to demultiplex. For example if the barcode is TCTCGCCAT and the second index in the full read of I9Y90N2,I9Y90N2 has a bad cycle in the third position this can be masked with the ReadString I9Y90N2,I2J1I6Y90N2. The full barcode in the underlying matching algorithm will then be TCTCGCCATTCJCGCCAT. Now the IndexDecoder, which is a part of the subsequent splitting process, masks the specified base before counting mismatches on the barcode and determines if the barcode is a match or not.

Example samplesheet, values are seperated by one tab: 

	#FCID	Lane	Index	Library	Sample	Pool (po)	Project (pr)	Protocol (lp)	Isize	Control	Operator (op)	ReadString	Concentration	Priority	Sequencing_Center	Description
	FCID	5	TCTCGCCAT	Lib1	Sample1		projectName	protocolName	500	N	staliv	I9Y92,I9Y92	12		LuOnk	Test run
	FCID	5	AGATAGGTT	Lib1	Sample2		projectName	protocolName	500	N	staliv	I9Y92,I9Y92	12		LuOnk	Test run
	FCID	5	GTCGCTAGT	Lib1	Sample3		projectName	protocolName	500	N	staliv	I9Y92,I9Y92	12		LuOnk	Test run
	FCID	5	CAGATATCT	Lib1	Sample4		projectName	protocolName	500	N	staliv	I9Y92,I9Y92	12		LuOnk	Test run
