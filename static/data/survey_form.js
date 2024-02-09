const province_data=[
  "北京市",
  "天津市",
  "上海市",
  "重庆市",
  "河北省",
  "山西省",
  "辽宁省",
  "吉林省",
  "黑龙江省",
  "江苏省",
  "浙江省",
  "安徽省",
  "福建省",
  "江西省",
  "山东省",
  "河南省",
  "湖北省",
  "湖南省",
  "广东省",
  "海南省",
  "四川省",
  "贵州省",
  "云南省",
  "陕西省",
  "甘肃省",
  "青海省",
  "内蒙古自治区",
  "广西壮族自治区",
  "西藏自治区",
  "宁夏回族自治区",
  "新疆维吾尔自治区",
  "香港特别行政区",
  "澳门特别行政区"
]


const survey_data={
 "logoPosition": "right",
 "pages": [
  {
   "name": "页面1",
   "elements": [
    {
     "type": "panel",
     "name": "问题3",
     "elements": [
      {
       "type": "dropdown",
       "name": "province_dropdown",
       "title": "请选择你的省份",
       "isRequired": true,
       "choices": province_data
      },
      {
       "type": "dropdown",
       "name": "city_dropdown",
       "visibleIf": "{province_dropdown} notempty",
       "title": "请选择所属城市",
       "isRequired": true,
      "choicesByUrl": {
        "url": "./getCity?province={province_dropdown}",
        "valueName": "city"
      }
      }
     ]
    },
    {
     "type": "paneldynamic",
     "name": "local_food",
     "title": "必吃排行榜，排名靠前则越推荐",
     // "isRequired": true,
     "templateElements": [
      {
       "type": "text",
       "name": "food_name",
       "title": "菜名/小吃名",
       "isRequired": true
      },
      {
       "type": "file",
       "name": "food_image",
       "title": "如果有图就更好啦",
       "filePlaceholder": "如果能附带实拍图，能够让大家更直观了解美食哦 （可选)"
      }
     ],
     "noEntriesText": "目前还没有添加美食哦",
     "panelAddText": "添加新美食",
     "panelRemoveText": "删除该美食"
    },
    {
     "type": "text",
     "name": "username",
     "title": "您的昵称(可选)"
    }
   ]
  }
 ]
}