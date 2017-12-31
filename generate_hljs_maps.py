import csv

output = 'public dumpTypeMap  = {\r\n"None": "nohighlight",\r\n'
outputInverted = 'public invertedDumpTypeMap  = {\r\n"nohighlight": "None",\r\n'
build = 'node tools/build.js'

file = open("langs.txt", "r")
csvReader = csv.reader(file)
for row in csvReader:
    name = row[0].strip()
    identifier = row[1].strip()

    output += '\t"' + name + '": "' + identifier + '",\r\n'
file.close()
output += "};\r\n\r\n"

file = open("langs.txt", "r")
csvReader = csv.reader(file)
for row in csvReader:
    name = row[1].strip()
    identifier = row[0].strip()

    outputInverted += '\t"' + name + '": "' + identifier + '",\r\n'
file.close()
outputInverted += "};\r\n\r\n"

file = open("langs.txt", "r")
csvReader = csv.reader(file)
for row in csvReader:
    name = row[1].strip()
    build += ' ' + name
file.close()

file = open("maps.txt", "w")
file.write(output)
file.write(outputInverted)
file.write(build);
file.close()

