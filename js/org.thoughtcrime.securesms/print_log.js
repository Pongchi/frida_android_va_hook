Java.perform(function () {

    var LogClass = Java.use('org.signal.libsignal.protocol.logging.Log');

    // Log.v (Verbose)
    LogClass.v.overload('java.lang.String', 'java.lang.String').implementation = function (tag, message) {
        var returnValue = this.v(tag, message);
        send("Log.v 호출됨: [" + tag + "] " + message);
        return returnValue;
    };

    // Log.d (Debug)
    LogClass.d.overload('java.lang.String', 'java.lang.String').implementation = function (tag, message) {
        var returnValue = this.d(tag, message);
        send("Log.d 호출됨: [" + tag + "] " + message);
        return returnValue;
    };

    // Log.i (Info)
    LogClass.i.overload('java.lang.String', 'java.lang.String').implementation = function (tag, message) {
        var returnValue = this.i(tag, message);
        send("Log.i 호출됨: [" + tag + "] " + message);
        return returnValue;
    };

    // Log.w (Warn) - 첫 번째 오버로드
    LogClass.w.overload('java.lang.String', 'java.lang.String').implementation = function (tag, message) {
        var returnValue = this.w(tag, message);
        send("Log.w 호출됨: [" + tag + "] " + message);
        return returnValue;
    };

    // Log.w (Warn) - 두 번째 오버로드 (Throwable 포함)
    LogClass.w.overload('java.lang.String', 'java.lang.Throwable').implementation = function (tag, throwable) {
        var returnValue = this.w(tag, throwable);
        send("Log.w 호출됨: [" + tag + "] " + throwable.toString());
        return returnValue;
    };

    // Log.e (Error)
    LogClass.e.overload('java.lang.String', 'java.lang.String').implementation = function (tag, message) {
        var returnValue = this.e(tag, message);
        send("Log.e 호출됨: [" + tag + "] " + message);
        return returnValue;
    };
});