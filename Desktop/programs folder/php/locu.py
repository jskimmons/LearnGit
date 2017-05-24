import urllib2
import json
def locu_search(query):
    api_key = 'd9a6121479b9e273f0d97074c87321705736bcaf'
    locality = query.replace(' ','%20')
    newurl = 'https://api.locu.com/v1_0/venue/search/?locality=' + locality + '&' + 'api_key=' + api_key
    json_obj = urllib2.urlopen(newurl)
    data = json.load(json_obj)
    for item in data['objects']:
        print item['name'], item['phone']