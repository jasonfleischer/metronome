#pip3 install googletrans
#python3 ./google_translations.py

from googletrans import Translator
translator = Translator(service_urls=['translate.googleapis.com'])
#language_codes = ['fr','es','de','it','pt','ru','ja','ko','zh-cn'];
#language_codes = ['fr']; # works better on own
#language_codes = ['es']; # works better on own
#language_codes = ['de']; # works better on own
#language_codes = ['it']; # works better on own
#language_codes = ['pt']; # works better on own
#language_codes = ['ru']; # works better on own
language_codes = ['ja']; # works better on own
#language_codes = ['ko']; # works better on own
#language_codes = ['zh-cn']; # works better on own

# html generated variables from translations.js
en = [
"Metronome", 
"Configure then press 'Play' to begin", 
"Tap", 
"Play", 
"Click", 
"Drum", 
"Talking", 
"Solkattu", 
"2 / 4", 
"3 / 4", 
"4 / 4", 
"5 / 4", 
"6 / 4", 
"7 / 4", 
"8 / 4", 
"9 / 4", 
"None", 
"(2) Eighths", 
"(3) Triplets", 
"(4) Sixteenths", 
"(5) Quintuplet", 
"(6) Sextuplet", 
"5 min", 
"10 min", 
"15 min", 
"20 min", 
"30 min", 
"45 min", 
"1 hour", 
"Infinite", 
"English", 
"French", 
"Spanish", 
"German", 
"Italian", 
"Portuguese", 
"Russian", 
"Japan", 
"Korean", 
"Chinese", 
"Support the Developer", 
"Tone", 
"Time Signature", 
"Subdivision", 
"Duration", 
"Accent First Beat", 
"Flash Screen", 
"Language", 
"Dark Mode", 
"Space",
"Keep Tapping",
"Configure then press 'Play' to begin. Talking setting works best at lower BPMs.",
"Increment subdivision",
"Decrement tempo",
"Left arrow",
"Stop",
"Key",
"Letter",
"Metronome Website Feedback",
"Right arrow",
"Decrement subdivision",
"Play or stop",
"Digit",
"Down arrow",
"Command",
"Half tempo",
"Tap tempo",
"Increment tempo",
"Double tempo",
"Up arrow"];

print("Fetching...\n")
for code in language_codes:
	translations = translator.translate(en, dest=code)
	print("var "+code.replace("zh-cn", "zh")+"=[")
	i = 0
	for translation in translations:
		#print(translation.origin, ' -> ', translation.text)
		text = translation.text.replace("\"", "'")
		print("\""+text+  ( "\"" if i==(len(translations)-1) else "\","))
		i += 1
	print("];\n")

print("FINISHED")
