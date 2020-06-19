import os

useNewline = True

path = 'ROMS/'

files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if '.ch8' in file:
            files.append(os.path.join(r, file))

outstring = '["CLEARMEM", '

newlineCounter = 0

for f in files:
	outstring += '"' + (f[5:]) + '", '
	newlineCounter += 1
	if newlineCounter == 3:
		outstring += "\n"
		newlineCounter = 0

outstring = outstring [:-2] + "]"

print outstring
