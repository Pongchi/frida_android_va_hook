Java.perform(function () {
    console.log("[*] Frida 스크립트 시작됨.");

    // 1. Debug.isDebuggerConnected()와 Debug.waitingForDebugger() 무력화
    var Debug = Java.use("android.os.Debug");
    Debug.isDebuggerConnected.implementation = function () {
        console.log("[*] Debugger 감지 우회");
        return false;  // 항상 디버거가 연결되지 않은 것으로 반환
    };
    Debug.waitingForDebugger.implementation = function () {
        console.log("[*] Debugger 대기 상태 감지 우회");
        return false;  // 디버거 대기 상태 무력화
    };
});

Java.perform(function () {
    console.log("[*] Frida 스크립트 시작됨: CommonUtils 후킹 중...");

    try {
        // CommonUtils 클래스 찾기
        var CommonUtils = Java.use("com.google.firebase.crashlytics.internal.common.CommonUtils");

        // 1. isRooted() 메서드 후킹
        CommonUtils.isRooted.implementation = function () {
            console.log("[*] isRooted() 메서드 후킹 - 루팅 감지 우회");
            return false;  // 항상 루팅되지 않은 것으로 반환
        };

        // 2. isDebuggerAttached() 메서드 후킹
        CommonUtils.isDebuggerAttached.implementation = function () {
            console.log("[*] isDebuggerAttached() 메서드 후킹 - 디버거 감지 우회");
            return false;  // 항상 디버거가 연결되지 않은 것으로 반환
        };

        // 3. isEmulator() 메서드 후킹
        CommonUtils.isEmulator.implementation = function () {
            console.log("[*] isEmulator() 메서드 후킹 - 에뮬레이터 감지 우회");
            return false;  // 항상 에뮬레이터가 아닌 것으로 반환
        };

        // 4. isAppDebuggable() 메서드 후킹
        CommonUtils.isAppDebuggable.implementation = function (context) {
            console.log("[*] isAppDebuggable() 메서드 후킹 - 디버그 모드 감지 우회");
            return false;  // 항상 디버그 모드가 아닌 것으로 반환
        };

        console.log("[*] CommonUtils 클래스 후킹 완료.");
    } catch (err) {
        console.log("[!] CommonUtils 클래스 후킹 실패: " + err);
    }
});


var libc = Module.findExportByName(null, "ptrace");
Interceptor.replace(libc, new NativeCallback(function () {
    console.log("[*] ptrace 호출 우회");
    return 0;
}, 'int', ['int', 'int', 'pointer', 'pointer']));
