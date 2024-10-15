Java.perform(function () {

    var FileLog = Java.use("org.telegram.messenger.FileLog");

    // d() 메서드를 후킹
    // FileLog.d.overload('java.lang.String').implementation = function (message) {
    //     // 로그를 캡처하고 출력
    //     console.log("[Frida Hook] Log.d message: " + message);

    //     // 원래 메서드 호출
    //     this.d(message);
    // };

    // e() 메서드를 후킹 (오류 로그)
    FileLog.e.overload('java.lang.String', 'java.lang.Throwable').implementation = function (message, exception) {
        console.log("[Frida Hook] Log.e message: " + message + ", exception: " + exception);

        // 원래 메서드 호출
        this.e(message, exception);
    };
});