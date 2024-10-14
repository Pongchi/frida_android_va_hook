/*
Java.perform(function () {
    // com.discord.logging.LoggingTree 클래스를 후킹
    var LoggingTree = Java.use("com.discord.logging.LoggingTree");

    // log 메서드를 후킹
    LoggingTree.log.overload('int', 'java.lang.String', 'java.lang.String', 'java.lang.Throwable').implementation = function (priority, tag, message, t) {
        // 우선 원래 log 메서드를 호출하여 로그가 정상적으로 기록되도록 한다.
        this.log(priority, tag, message, t);
        
        // 출력할 로그 정보
        console.log("[*] LoggingTree.log 호출됨");
        console.log("[*] priority: " + priority);
        console.log("[*] tag: " + tag);
        console.log("[*] message: " + message);

        // 예외 객체가 있을 경우 예외 내용 출력
        if (t !== null) {
            console.log("[*] Throwable: " + t.toString());
        } else {
            console.log("[*] Throwable: null");
        }
    };
});
*/

Java.perform(function () {
    // org.webrtc.JNILogging 클래스를 후킹
    var JNILogging = Java.use("org.webrtc.JNILogging");

    // logToInjectable 메서드를 후킹
    JNILogging.logToInjectable.overload('java.lang.String', 'java.lang.Integer', 'java.lang.String').implementation = function (str, num, str2) {
        // 원래 logToInjectable 메서드를 호출하여 동작을 유지
        this.logToInjectable(str, num, str2);

        // 출력할 로그 정보
        console.log("[*] JNILogging.logToInjectable 호출됨");
        console.log("[*] str: " + str);
        console.log("[*] num: " + num);
        console.log("[*] str2: " + str2);
    };
});

Java.perform(function () {
    // WebRTC의 Logging 클래스를 가져옴
    var Logging = Java.use("org.webrtc.Logging");

    // d 메서드를 후킹
    Logging.d.implementation = function (tag, message) {
        // 인자로 받은 태그와 메시지를 출력
        console.log('--------------------------------------------')
        console.log("Logging.d called with tag: " + tag + ", message: " + message);

        // 원래 메서드를 호출하여 정상적인 동작 유지
        this.d(tag, message);
    };
});

// Frida 스크립트 시작
Java.perform(function() {

    // Log 클래스 가져오기
    var LogClass = Java.use("com.discord.foreground_service.utils.Log");

    // i$foreground_service_release 메서드 후킹
    LogClass.i$foreground_service_release.implementation = function(tag, message, e) {
        console.log("[*] i$foreground_service_release called");
        console.log("    tag: " + tag);
        console.log("    message: " + message);
        console.log("    exception: " + e);

        // 원래 메서드 호출 (필요할 경우)
        this.i$foreground_service_release(tag, message, e);
    };

    // w$foreground_service_release 메서드 후킹
    LogClass.w$foreground_service_release.implementation = function(tag, message, e) {
        console.log("[*] w$foreground_service_release called");
        console.log("    tag: " + tag);
        console.log("    message: " + message);
        console.log("    exception: " + e);

        // 원래 메서드 호출 (필요할 경우)
        this.w$foreground_service_release(tag, message, e);
    };

});

// Frida 스크립트 시작
Java.perform(function() {

    // Log 클래스 가져오기
    var LogClass = Java.use("com.discord.logging.Log");

    // d 메서드 후킹
    LogClass.d.overload('java.lang.String', 'java.lang.String', 'java.lang.Throwable').implementation = function(tag, message, exception) {
        console.log("[*] Log.d called");
        console.log("    tag: " + tag);
        console.log("    message: " + message);
        console.log("    exception: " + exception);
        
        // 원래 메서드 호출 (필요시 주석 해제)
        this.d(tag, message, exception);
    };

    // e 메서드 후킹
    LogClass.e.overload('java.lang.String', 'java.lang.String', 'java.lang.Throwable').implementation = function(tag, message, exception) {
        console.log("[*] Log.e called");
        console.log("    tag: " + tag);
        console.log("    message: " + message);
        console.log("    exception: " + exception);
        
        // 원래 메서드 호출 (필요시 주석 해제)
        this.e(tag, message, exception);
    };

    // i 메서드 후킹
    LogClass.i.overload('java.lang.String', 'java.lang.String', 'java.lang.Throwable').implementation = function(tag, message, exception) {
        console.log("[*] Log.i called");
        console.log("    tag: " + tag);
        console.log("    message: " + message);
        console.log("    exception: " + exception);
        
        // 원래 메서드 호출 (필요시 주석 해제)
        this.i(tag, message, exception);
    };

    // w 메서드 후킹
    LogClass.w.overload('java.lang.String', 'java.lang.String', 'java.lang.Throwable').implementation = function(tag, message, exception) {
        console.log("[*] Log.w called");
        console.log("    tag: " + tag);
        console.log("    message: " + message);
        console.log("    exception: " + exception);
        
        // 원래 메서드 호출 (필요시 주석 해제)
        this.w(tag, message, exception);
    };
});

// Frida 스크립트 시작
Java.perform(function() {

    // LoggingLineNumberTree 클래스 가져오기
    var LoggingLineNumberTreeClass = Java.use("com.discord.logging.LoggingLineNumberTree");

    // log 메서드 후킹
    LoggingLineNumberTreeClass.log.overload('int', 'java.lang.String', 'java.lang.String', 'java.lang.Throwable').implementation = function(priority, tag, message, throwable) {
        console.log("[*] LoggingLineNumberTree.log 호출됨");
        console.log("    priority: " + priority);
        console.log("    tag: " + tag);
        console.log("    message: " + message);
        if (throwable) {
            console.log("    throwable: " + throwable.toString());
        } else {
            console.log("    throwable: null");
        }

        // 원래 메서드 호출 (필요시 주석 해제)
        this.log(priority, tag, message, throwable);
    };

});
