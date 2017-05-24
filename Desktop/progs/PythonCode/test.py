
import requests, bs4

url = 'http://www.columbia.edu/cu/bulletin/uwb/subj/ENGI/E1102-20163-001/'
res = requests.get(url)

soup = bs4.BeautifulSoup(res.text, "lxml")


info = soup.find_all(size='+2')

print(info)