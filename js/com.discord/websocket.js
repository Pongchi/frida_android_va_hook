Java.perform(function() {
    // NetworkingModule 클래스 로드
    var NetworkingModule = Java.use('com.facebook.react.modules.network.NetworkingModule');

    // RequestBody 클래스 로드
    var Request = Java.use('okhttp3.Request');
    var Response = Java.use('okhttp3.Response');

    // sendRequestInternal 메서드를 후킹하여 요청과 응답을 가로챕니다.
    NetworkingModule.sendRequestInternal.implementation = function(str, url, requestId, readableArray, readableMap, responseType, useIncrementalUpdates, timeout, withCredentials) {
        // URL 및 요청 정보를 출력합니다.
        console.log("=== NetworkingModule sendRequestInternal Hooked ===");
        console.log("URL: " + url);
        console.log("Request ID: " + requestId);
        console.log("Response Type: " + responseType);
        console.log("Use Incremental Updates: " + useIncrementalUpdates);

        // 원래 메서드를 호출하여 요청을 처리합니다.
        this.sendRequestInternal(str, url, requestId, readableArray, readableMap, responseType, useIncrementalUpdates, timeout, withCredentials);
    };
});
