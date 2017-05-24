'''
Joe Skimmons
'''

class Market(object):

    def __init__(self, state='', market_name='', street_address='', zip_code="", city=''):
        self.market_name = market_name
        self.state = state
        self.zip_code = zip_code
        self.city = city
        self.street_address = street_address

    def __str__(self):
        return '{} \n{} \n{}, {} {}'.format(self.market_name, self.street_address, self.city, self.state, self.zip_code);

def read_markets(filename):
    file = open(filename, "r")
    market_dict = {}
    for line in file:
        dataList = line.split("#")
        if dataList[4] not in market_dict:
            market_dict[dataList[4]] = []
            market_dict[dataList[4]].append(Market(dataList[0], dataList[1], dataList[2], dataList[4], dataList[3]))
        else:
            market_dict[dataList[4]].append(Market(dataList[0], dataList[1], dataList[2], dataList[4], dataList[3]))
    return market_dict
    

def main():
    zipDict = read_markets("markets.txt")
    s = input("Enter a zipcode\n")
    results = []
    try:
        results = zipDict[s]
    except KeyError:
        print("No farmer's markets found in your area")
    else:
        for element in results:
            print(str(element))

if __name__ == "__main__":
    main()
