# python <path>/find_js_translations.py

import os
import sys
#import subprocess as sp

ignore_files = ["midi_sounds.js", "translations.js", "webAudioFontPlayer.js"]
results = set()

TOKEN = "TR"

def main():

	#sp.call('cls', shell=True)
	os.chdir(sys.path[0])
	os.getcwd()
	os.chdir('../..')

	directory = os.getcwd()
	search(directory)
	print_results()

def search(directory):
	for filename in os.listdir(directory): 
		if filename.endswith(".js"):
			#print("JS " + os.path.join(directory, filename))
			print("FILE: "+ filename)
			if not filename in ignore_files:
				search_file(os.path.join(directory, filename))
		elif not "." in filename:
			#print("DIR " + os.path.join(directory, filename))
			search(os.path.join(directory, filename))
		else:
			continue

def search_file(file):
	file1 = open(file, 'r') 
	Lines = file1.readlines()  
	for line in Lines: 
		if TOKEN in line:
			parse_line(line)

def parse_line(line):
	print("INPUT: "+line.replace('\n', ''))

	parsed_line = line[line.index(TOKEN+"(")+4:]
	line_remainder = parsed_line[parsed_line.index(")"):]
	parsed_line = parsed_line[:parsed_line.index(")")-1]
	print("PARSED: "+parsed_line)
	results.add(parsed_line)
	
	#print("REM: "+line_remainder)
	if TOKEN in line_remainder:
		parse_line(line_remainder)

def print_results():
	print("\nRESULT:\nvar js_translations = [")
	i = 0
	for e in results:
		print("\""+e+  ( "\"" if i==(len(results)-1) else "\","))
		i += 1
	print("];")


main()



