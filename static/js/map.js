//为0则显示全国地图，为1则显示省级地图
var map_state = 0;
var myChart = echarts.init(document.getElementById('allMap'));
const current_locate = document.getElementById("current_locate")
const food_list = document.getElementById("food_list");


function replaceAllMap() {
    current_locate.innerText = "全国";
    let element_all_map = document.getElementById('allMap');
    element_all_map.classList.remove("MapShow");

    let element_province = document.getElementById('provinceMap');

    element_province.classList.add("MapShow");
    food_list.classList.add("MapShow");


    myChart = echarts.init(element_all_map);
    $.get('./static/data/maps_full.json', function (data) {

        echarts.registerMap('China', data);

        let option = {

            geo: {
                map: "China",

                roam: true,
                zoom: 1.2, //默认显示级别
                scaleLimit: {min: 1, max: 3}, // 缩放级别
                regions: [
                    {
                        name: "香港特别行政区",
                        label: {
                            show: false
                        }
                    },
                    {
                        name: "澳门特别行政区",
                        label: {
                            show: false
                        }
                    }
                ]
            },

            title: {
                text: '美食地图 (2024)',
                subtext: 'Data from www.census.gov',
                left: 'right'
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2
            },
            toolbox: {
                show: true,
                //orient: 'vertical',
                left: 'left',
                top: 'top',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },

        };

        myChart.setOption(option);
        map_state = 0;
        myChart.on('click', function (params) {
            replaceProvinceMap(params.name);


        });
    });
}

function replaceProvinceMap(province_name) {

    $.get('./static/data/' + province_name + '.json', function (data) {
        current_locate.innerText = province_name;
        let element_all_map = document.getElementById('allMap');
        element_all_map.classList.add("MapShow");

        let element_province = document.getElementById('provinceMap');

        element_province.classList.remove("MapShow");
        food_list.classList.remove("MapShow");
        getProvinceFood(province_name);

        myChart = echarts.init(element_province);
        echarts.registerMap(province_name, data);

        let option = {

            geo: {
                map: province_name,

                roam: true,
                zoom: 1.2, //默认显示级别
                scaleLimit: {min: 1, max: 3}, // 缩放级别
            },
            title: {
                text: '美食地图 (2024)——' + province_name,
                subtext: 'Data from www.census.gov',
                left: 'right'
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2
            },
            toolbox: {
                show: true,
                //orient: 'vertical',
                left: 'left',
                top: 'top',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },

        };
        myChart.setOption(option);
        map_state = 1;
        myChart.on('click', function (params) {
            console.log(params.name);
            getCityFood(params.name);


        });

    });
}


replaceAllMap();


function getCityFood(city_name) {
    $.get('/getCityFood', {city_name: city_name}, function (data) {

        console.log(data);
        if (data.status === "success") {
            for (let i = 0; i < data.data.length; i++) {
                food_list.innerHTML = "";
                let food_item = data.data[i];
                let card = document.createElement("div");
                card.classList.add("card");

                if (food_item.food_img_base64) {
                    let img = document.createElement("img");
                    img.src = food_item.food_img_base64;
                    img.classList.add("card-img-top");
                    img.alt = "美食图片";
                    card.appendChild(img);
                }

                let card_body = document.createElement("div");
                card_body.classList.add("card-body");

                let h5 = document.createElement("h5");
                h5.classList.add("card-title");
                h5.innerText = food_item.name;
                let p = document.createElement("p");
                p.classList.add("card-text");
                p.innerText = "" + data.city;
                card_body.appendChild(h5);
                card_body.appendChild(p);
                card.appendChild(card_body);
                food_list.appendChild(card);

            }

        }
        else {
            alert("该城市暂时无人分享");
        }


    });

}

function getProvinceFood(province_name) {
    $.get('/getProvince', {province_name: province_name}, function (data) {
        food_list.innerHTML = "";
        if (data.status === "success") {
            for (let i = 0; i < data.data.length; i++) {
                let food_item = data.data[i];

                let card = document.createElement("div");
                card.classList.add("card");

                if (food_item.food_img_base64) {
                    let img = document.createElement("img");
                    img.src = food_item.food_img_base64;
                    img.classList.add("card-img-top");
                    img.alt = "美食图片";
                    card.appendChild(img);
                }

                let card_body = document.createElement("div");
                card_body.classList.add("card-body");

                let h5 = document.createElement("h5");
                h5.classList.add("card-title");
                h5.innerText = food_item.name;
                let p = document.createElement("p");
                p.classList.add("card-text");
                p.innerText = "" + data.city;
                card_body.appendChild(h5);
                card_body.appendChild(p);
                card.appendChild(card_body);
                food_list.appendChild(card);

            }
            console.log("append");
        }

    });
}


//监听鼠标右键 以及esc键

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();

    replaceAllMap()

});

// 监听ESC键
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {

        replaceAllMap()

    }
});



