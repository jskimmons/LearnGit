# Takes in a file with classes in order:
# COMS W3137 2017 001
# for use in ClassSchedule.py

import requests, bs4, re, sys

def getClassInfo(classList):
    
    if classList[2] == '2016':
        constant = 3
    else:
        constant = 1
    
    url = 'http://www.columbia.edu/cu/bulletin/uwb/subj/' + classList[0] + '/' + classList[1] + '-' + classList[2] + str(constant) + '-' + classList[3] + '/'
    res = requests.get(url)

    soup = bs4.BeautifulSoup(res.text, "lxml")

    info = soup.find_all(bgcolor='#DADADA')
    className = soup.find_all(size='+2')

    callNum = str(info[0])
    timeText = str(info[1])
    professor = str(info[4])
    className = str(className[0])

    def striphtml(data):
        p = re.compile(r'<.*?>')
        return p.sub('', data)

    def cleanClass(className):
        cleanClass = className.split()
        for x in range(0, len(cleanClass)-1):
            if cleanClass[x] == r'&amp;':
                del cleanClass[x]
        className = ' '.join(cleanClass)
        return className

    timeList = striphtml(timeText).split()
    callNum = striphtml(callNum)
    professor = striphtml(professor)
    className = cleanClass(striphtml(className))

    # regex = r'(1[012]|[1-9]):[0-5][0-9](am|pm)(-)(1[012]|[1-9]):[0-5][0-9](am|pm)'

    timeOut = re.split(r'(am|pm)', timeList[1])

    classTime = ''
    for x in range(0,4):
        classTime += timeOut[x]

    days = {
        "MW":"Monday, Wednesday",
        "TR": "Tuesday, Thursday",
        "F": "Friday",
        "W": "Wednesday"
        }

    classInfo = [className, days[timeList[0]], classTime, professor, callNum]

    return classInfo


target = open("classOutput.txt", 'w')

classList = []
tmp = []
with open(sys.argv[1]) as f:
	for line in f:
		tmp = getClassInfo(line.split())
		classList.append(tmp)


for x in range(0,5):
    for y in range(0,5):
        target.write(classList[x][y] + ' ')
            
    target.write('\n')


