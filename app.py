from flask import Flask, render_template, request, jsonify
import pandas as pd  # 导入 pandas 库
from peewee import fn

import Model

df = pd.read_csv('./static/data/data.csv', encoding="utf-8")  # 读取数据集
app = Flask(__name__)


@app.route('/survey')
def survey():  # put application's code here
    return render_template('survey.html')


@app.route('/')
def map():  # put application's code here
    return render_template('map.html')


# 创建一个GET请求的路由 ./getCity?province=广东
@app.route('/getCity', methods=['GET'])
def getCity():
    province_name = request.args.get('province')
    cities = df[df['province'] == province_name]['city'].tolist()
    return jsonify([{'city': city} for city in cities])


@app.route('/getProvince', methods=['GET'])
def getProvince():
    # 先获取传递过来的province_name
    province_name = request.args.get('province_name')
    # 先随机获取user为province_name的用户，如果没有则返回空
    local_food = Model.LocalFood.select().where(Model.LocalFood.province == province_name).order_by(fn.Random()).limit(10)

    if local_food:
        list_item = []
        for item in local_food:
            list_item.append({"name": item.name, "food_img_base64": item.food_img_base64})

        return jsonify({"status": "success", "data": list_item,"city":province_name})

    else:
        return jsonify({"status": "error", "msg": "没有找到对应的用户"})


# 根据用户获取LocalFood
#getCity
@app.route("/getCityFood", methods=["GET"])
def getCityFood():
    city=request.args.get("city_name")
    user=Model.User.select().where(Model.User.city==city).order_by(fn.Random()).limit(1).execute()
    if user:
        list_item = []
        for item in user[0].local_foods:
            list_item.append({"name": item.name, "food_img_base64": item.food_img_base64})
        return jsonify({"status": "success", "data": list_item,"city":city})
    else:
        return jsonify({"status": "error", "msg": "没有找到对应的分享"})


@app.route('/submit', methods=['POST'])
def submit():
    # 获取前端传递过来的全部数据
    data = request.get_json()
    # 简化用户名获取逻辑
    username = data.get('username', "user" + str(Model.User.select().count() + 1))
    # 直接从data中获取省份和城市
    province = data['province_dropdown']
    city = data['city_dropdown']
    # 创建用户
    user = Model.User.create(username=username, province=province, city=city)

    # 遍历local_food，直接迭代而不是使用索引
    for i, food in enumerate(data['local_food'], start=1):
        # 创建LocalFood记录，根据food_image的存在与否来调整参数
        food_params = {
            'user': user,
            'name': food['food_name'],
            'weight': i,
            "province": province,
        }
        if "food_image" in food:
            food_params['food_img_base64'] = food["food_image"][0]['content']

        Model.LocalFood.create(**food_params)
    return 'Submit Success'  # 确保函数有返回值


@app.route('/checkUsername', methods=['GET'])
def checkUsername():
    username = request.args.get('username')
    if Model.User.select().where(Model.User.username == username).exists():
        return jsonify({'status': 'error', 'msg': '用户名已存在'})
    else:
        return jsonify({'status': 'success', 'msg': '用户名可用'})


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5764)
