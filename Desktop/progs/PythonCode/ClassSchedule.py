# A script to scrape SSOL and pull class name, date, and time data

import requests, bs4, re, sys

    
if sys.argv[3] == '2016':
    constant = 3
else:
    constant = 1

url = 'http://www.columbia.edu/cu/bulletin/uwb/subj/' + sys.argv[1] + '/' + sys.argv[2] + '-' + sys.argv[3] + str(constant) + '-' + sys.argv[4] + '/'

res = requests.get(url)

soup = bs4.BeautifulSoup(res.text, "lxml")

info = soup.find_all(bgcolor='#DADADA')

callNum = str(info[0])
timeText = str(info[1])
professor = str(info[4])

def striphtml(data):
    p = re.compile(r'<.*?>')
    return p.sub('', data)

timeList = striphtml(timeText).split()
callNum = striphtml(callNum)
professor = striphtml(professor)

# regex = r'(1[012]|[1-9]):[0-5][0-9](am|pm)(-)(1[012]|[1-9]):[0-5][0-9](am|pm)'

timeOut = re.split(r'(am|pm)', timeList[1])

classTime = ''
for x in range(0,4):
    classTime += timeOut[x]

days = {
    "MW":"Monday, Wednesday",
    "TR": "Tuesday, Thursday",
    "F": "Friday"
    }

classInfo = [days[timeList[0]], classTime, professor, callNum]
    
print("Meets: " + days[timeList[0]])
print('Time: ' + classTime)
print("Professor: " + professor)
print("Call Number: " + callNum)

