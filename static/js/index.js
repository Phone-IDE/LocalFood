const survey = new Survey.Model(survey_data);
survey.applyTheme(SurveyTheme.SharpLight);
const storageItemKey = "my-survey";
function saveSurveyData (survey) {
  const data = survey.data;
  data.pageNo = survey.currentPageNo;
  window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}
survey.onValueChanged.add(saveSurveyData);
survey.onCurrentPageChanged.add(saveSurveyData)

//创建一个函数，将json传递给后端
function validateUserName(_, { data, errors, complete }) {
  const countryName = data["username"];
  if (!countryName) {
        complete();
  }
  fetch("./checkUsername?username=" + countryName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
         const status = data.status;
         if (status === "error") {

             errors["username"] = "用户名已存在";
         }
         complete();

    });
}

function sendDataToServer(survey) {
    // 定义你要发送数据到的服务器端点URL
    const url = './submit';

    // 使用fetch API发送一个POST请求
    fetch(url, {
        method: 'POST', // 或者 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body:survey, // 将JavaScript对象转换为JSON字符串
    })
    .then(response => {
        if (!response.ok) {
            // 如果服务器响应不是2xx, 抛出错误
            throw new Error('Network response was not ok');
        }
        return response.json(); // 解析JSON响应
    })
    .then(data => {
        console.log('Success:', data); // 处理成功响应的数据
    })
    .catch((error) => {
        console.error('Error:', error); // 捕获并处理请求中的错误
    });
}
survey.onServerValidateQuestions.add(validateUserName);

survey.onComplete.add((sender, options) => {
    //console.log(JSON.stringify(sender.data, null, 3));
    window.localStorage.setItem(storageItemKey, "");
    sendDataToServer(JSON.stringify(sender.data, null, 3));


});

const prevData = window.localStorage.getItem(storageItemKey) || null;
if (prevData) {
  const data = JSON.parse(prevData);
  survey.data = data;
  if (data.pageNo) {
    survey.currentPageNo = data.pageNo;
  }
}



$("#surveyElement").Survey({ model: survey });