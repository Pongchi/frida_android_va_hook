Java.perform(function () {
    var WebSocketModule = Java.use("com.facebook.react.modules.websocket.WebSocketModule");

    // WebSocket 연결 후킹
    WebSocketModule.connect.overload('java.lang.String', 'com.facebook.react.bridge.ReadableArray', 'com.facebook.react.bridge.ReadableMap', 'double').implementation = function (url, headers, options, id) {
        console.log("=== WebSocket Connect Hooked ===");
        console.log("[WebSocket Connect] URL: " + url);
        if (headers !== null) {
            console.log("[WebSocket Headers]: " + headers.toString());
        }
        if (options !== null) {
            console.log("[WebSocket Options]: " + options.toString());
        }
        this.connect(url, headers, options, id);
    };

    // WebSocket 메시지 송신 후킹
    WebSocketModule.send.overload('java.lang.String', 'double').implementation = function (message, id) {
        console.log("=== WebSocket Send Hooked ===");
        console.log("[WebSocket Send] Message: " + message + ", ID: " + id);
        this.send(message, id);
    };

    // WebSocket Binary 메시지 송신 후킹
    WebSocketModule.sendBinary.overload('java.lang.String', 'double').implementation = function (data, id) {
        console.log("=== WebSocket SendBinary Hooked ===");
        console.log("[WebSocket SendBinary] Data: " + data + ", ID: " + id);
        this.sendBinary(data, id);
    };

    // WebSocket Ping 후킹
    WebSocketModule.ping.overload('double').implementation = function (id) {
        console.log("=== WebSocket Ping Hooked ===");
        console.log("[WebSocket Ping] ID: " + id);
        this.ping(id);
    };
});

/*
Java.perform(function () {
    // CompressionManagerModule 클래스 로드
    var CompressionManagerModule = Java.use('com.discord.modules.compressionmanager.CompressionManagerModule$ZstdContentHandler');

    // onMessage(ByteString, WritableMap) 메서드 후킹
    CompressionManagerModule.onMessage.overload('okio.ByteString', 'com.facebook.react.bridge.WritableMap').implementation = function (byteString, params) {
        console.log("[*] onMessage(ByteString, WritableMap) called");

        // ByteString의 내용을 출력
        var byteStringData = byteString;
        console.log("[*] ByteString data: " + byteStringData);
        
        // 원래 메서드 호출
        this.onMessage(byteString, params);
    };
});
*/

Java.perform(function () {
    // CompressionManagerModule.ZstdInflater 클래스 로드
    var ZstdInflater = Java.use('com.discord.modules.compressionmanager.CompressionManagerModule$ZstdInflater');

    // decompress 메소드 후킹
    ZstdInflater.decompress.overload('okio.ByteString').implementation = function (byteString) {
        console.log("[*] decompress method called");

        // ByteString의 내용을 출력
        var byteStringData = byteString;  // ByteString을 문자열로 변환
        console.log("[*] Input ByteString data: " + byteStringData);

        // 원래 메소드 호출
        var result = this.decompress(byteString);

        // 결과 출력
        console.log("[*] Decompress result: " + result);

        // 결과 반환
        return result;
    };
});
