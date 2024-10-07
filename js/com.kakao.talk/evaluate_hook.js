Java.perform(function () {
    // android.webkit.WebView 클래스 가져오기
    var WebView = Java.use('android.webkit.WebView');

    // WebView.evaluateJavascript(String, ValueCallback) 메서드 후킹
    WebView.evaluateJavascript.overload('java.lang.String', 'android.webkit.ValueCallback').implementation = function (script, callback) {
        // 전달된 JavaScript 코드 출력
        console.log("[*] evaluateJavascript called with script:");
        console.log(script);
        console.log('--------------------------------------------')

        // callback이 있을 경우, 출력
        if (callback != null) {
            console.log("[*] Callback is provided.");
        }

        // 원래의 메서드 호출
        return this.evaluateJavascript(script, callback);
    };
});
