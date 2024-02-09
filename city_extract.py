import json
import os
import pandas as pd
# Load the JSON data from the file
#file_path = '/mnt/data/贵州省.json'  # Path to the JSON file

#pandas 创建dataframe

city_data=[]

def extract_city(name,json_path):
    print(name)
    with open(json_path, 'r', encoding='utf-8') as file:
        guizhou_data = json.load(file)

    # Extract city names from the 'features' list, accessing 'properties' then 'name' for each feature
    city_names = [feature['properties']['name'] for feature in guizhou_data['features']]

    for city in city_names:
        city_data.append([name,city])

basefile='./static/data/'

for item in os.listdir(basefile):
    #如果包含中文
    if '\u4e00' <= item <= '\u9fff':
        extract_city(item.split(".")[0], basefile+item)

       # extract_city(basefile+item)

#将数据写入csv文件
df = pd.DataFrame(city_data, columns=['province', 'city'])
df.to_csv('./static/data/data.csv', index=False, encoding="utf-8")

# city_names will contain the list of city names extracted from the JSON datae
#extract_city(basefile)
