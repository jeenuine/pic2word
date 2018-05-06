from bs4 import BeautifulSoup
import requests
import json
import sys

word = sys.argv[1]
print(word)
def main(word):
	url = "http://dic.naver.com/search.nhn?dicQuery="+word+"&query="+word+"&target=dic&ie=utf8&query_utf=&isOnlyViewEE=&x=0&y=0"
	response = requests.get(url)
	res = response.text

	soup = BeautifulSoup(res,"html.parser")
	result = ""
	result = soup.find('dd')
	result = str(result)
	res = result.replace(" ","").split("<")[1]
	data = { 'lable' : res }
	json_data = json.dumps(data)
	print(json_data)
	return json_data

	
if __name__ == "__main__":
    main(word)
