let weatherAPIKey='122661402e76392a41839548b714299c';
let endKeyPoint="https://api.openweathermap.org/data/2.5/weather?appid="+weatherAPIKey +"&units=imperial";
let forecastEndKeyPoint="https://api.openweathermap.org/data/2.5/forecast?appid="+weatherAPIKey+"&units=imperial";

let getForecastByCityName=async(data) => {
    let nameForecastApi=forecastEndKeyPoint+"&q="+data;
    let response=await fetch(nameForecastApi);
    let forecast=await response.json();
    let forecastList=forecast.list;
    let daily=[];
    forecastList.forEach(day => {
        let date=new Date(day.dt_txt.replace(' ','T'));
        let hours=date.getHours();
        if(hours === 12){
            daily.push(day);
        }
    });
    return daily;
}

let getWeatherByCityName=async(cityName) => {
    let nameAPI = endKeyPoint+"&q="+cityName;
    let response=await fetch(nameAPI);
    let weather=await response.json();
    return weather;
}

//updating current weather
let searchInp=document.querySelector(".weather-search");
let city=document.querySelector(".weather-city");
let day=document.querySelector(".weather-day");
let wind=document.querySelector(".weather-indicator--wind>.value");
let humidity=document.querySelector(".weather-indicator--humidity>.value");
let pressure=document.querySelector(".weather-indicator--pressure>.value");
let temperature=document.querySelector(".weather-temp");

let getDayName= (dt=new Date().getTime()) =>{
    return new Date(dt).toLocaleString("en-EN",{"weekday":"long"});
}

let updateCurrentWeatherCondition= (data)=>{
    console.log(data);
    city.innerHTML=`<span>${data.name},${data.sys.country}<span>`;
    day.innerHTML=`<span>${getDayName()}</span>`;
    humidity.innerHTML=`<span>${data.main.humidity}</span>`;
    pressure.innerHTML=`<span>${data.main.pressure}</span>`;
    let windDirection;
    let degree=data.wind.deg;
    if(degree>45 && degree<=135){
        windDirection='East';
    }
    else if(degree>135 && degree<=225){
        windDirection='South';
    }
    else if(degree>225 && degree<=315){
        windDirection='West';
    }
    else{
        windDirection='North';
    }
    wind.innerHTML=`<span>${windDirection}, ${data.wind.speed}</span>`;
    temperature.textContent=data.main.temp>0? '+' +data.main.temp :data.main.temp;
}

//Updating forecast situation
let weatherFuture=document.querySelector(".weather-info-future");

let updateForecastInfo = (data)=>{
    console.log(data);
    weatherFuture.innerHTML=" ";
    data.forEach(data=>{
        let iconKey=data.weather[0].icon;
        let imgIconURL="https://openweathermap.org/img/wn/"+iconKey+"@2x.png";
        let dayName=getDayName(data.dt * 1000);
        let futureTemperature=data.main.temp>0? '+' +data.main.temp :data.main.temp;
        let futureForecastItem=`
                <div class="day-after">
                    <div class="day-image">
                        <img src=${imgIconURL} alt= ${data.weather[0].description}/>
                    </div>
                    <div class="day-name">
                        <h3>${dayName}</h3>
                    </div>
                    <div class="day-temp">
                        <h4><span class="value">${futureTemperature}</span>&deg;C</h4>
                    </div>
                </div>
        `;
        weatherFuture.insertAdjacentHTML("beforeend",futureForecastItem);
    });
}

searchInp.addEventListener("keydown",async(e)=>{
    if(e.keyCode === 13){
        let weather=await getWeatherByCityName(searchInp.value);
        updateCurrentWeatherCondition(weather);
        let forecast=await getForecastByCityName(searchInp.value);
        updateForecastInfo(forecast);
    }
})





