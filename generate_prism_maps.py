import csv

output = 'public dumpTypeMap  = {\r\n"None": "none",\r\n'
outputInverted = 'public invertedDumpTypeMap  = {\r\n"none": "None",\r\n'

file = open("prism.txt", "r")
csvReader = csv.reader(file)
for row in csvReader:
    name = row[0]
    identifier = row[1]

    output += '\t"' + name + '": "' + identifier + '",\r\n'
file.close()
output += "};\r\n\r\n"

file = open("prism.txt", "r")
csvReader = csv.reader(file)
for row in csvReader:
    name = row[1]
    identifier = row[0]

    outputInverted += '\t"' + name + '": "' + identifier + '",\r\n'
file.close()
outputInverted += "};"

file = open("maps.txt", "w")
file.write(output)
file.write(outputInverted)
file.close()

