Java.perform(() => {
    // WebSocketRequestMessage 클래스 가져오기
    const WebSocketRequestMessage = Java.use('org.whispersystems.signalservice.internal.websocket.WebSocketRequestMessage');

    // SignalWebSocket 클래스 후킹
    const SignalWebSocket = Java.use('org.whispersystems.signalservice.api.SignalWebSocket');

    // request() 메소드 후킹
    SignalWebSocket.request.overload('org.whispersystems.signalservice.internal.websocket.WebSocketRequestMessage')
        .implementation = function (requestMessage) {
            console.log('[+] Hooked request()');
            
            // requestMessage 인자의 내용을 출력
            console.log('Argument: ' + requestMessage.toString());

            // 원래 메소드를 호출하여 Single<WebSocketResponse> 반환
            return this.request(requestMessage);
        };
});


Java.perform(() => {
    // JsonUtil 클래스 가져오기
    const JsonUtil = Java.use('org.whispersystems.signalservice.internal.util.JsonUtil');

    // toJson(Object) 메소드 후킹
    JsonUtil.toJson.overload('java.lang.Object').implementation = function (object) {
        console.log('[+] Hooked toJson()');
        
        // 원래 메소드를 호출하여 결과를 캡처
        const result = this.toJson(object);

        // 인자와 결과 출력
        console.log('Input Object: ' + object.toString());
        console.log('JSON Result: ' + result);

        // 결과 반환
        return result;
    };
});

Java.perform(() => {
    // ObjectMapper 클래스 가져오기
    const ObjectMapper = Java.use('com.fasterxml.jackson.databind.ObjectMapper');

    // readValue(String, Class) 메소드 후킹
    ObjectMapper.readValue.overload('java.lang.String', 'java.lang.Class').implementation = function (jsonString, clazz) {
        console.log('[+] Hooked readValue(String, Class)');

        // 전달된 인자 출력
        console.log('JSON Input: ' + jsonString);
        console.log('Target Class: ' + clazz.getName());

        // 원래 메소드를 호출하여 결과 반환
        const result = this.readValue(jsonString, clazz);

        // 변환된 결과를 출력
        console.log('Deserialized Object: ' + result.toString());

        return result;
    };

    // readValue(String, TypeReference) 메소드 후킹
    ObjectMapper.readValue.overload('java.lang.String', 'com.fasterxml.jackson.core.type.TypeReference').implementation = function (jsonString, typeRef) {
        console.log('[+] Hooked readValue(String, TypeReference)');

        // 전달된 인자 출력
        console.log('JSON Input: ' + jsonString);
        console.log('Target TypeReference: ' + typeRef.getType().toString());

        // 원래 메소드를 호출하여 결과 반환
        const result = this.readValue(jsonString, typeRef);

        // 변환된 결과를 출력
        console.log('Deserialized Object: ' + result.toString());

        return result;
    };
});

Java.perform(() => {
    // JsonUtils 클래스 가져오기
    const JsonUtils = Java.use('org.thoughtcrime.securesms.util.JsonUtils');

    // toJson(Object) 메소드 후킹
    JsonUtils.toJson.overload('java.lang.Object').implementation = function (object) {
        console.log('[+] Hooked toJson()');

        // 인자 출력
        console.log('Input Object: ' + object.toString());

        // 원래 메소드를 호출하고 결과 캡처
        const jsonString = this.toJson(object);

        // 결과 출력
        console.log('JSON Result: ' + jsonString);

        // 결과 반환 (정상 동작 유지)
        return jsonString;
    };
});
