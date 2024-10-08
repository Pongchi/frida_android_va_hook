Java.perform(function () {
    var NetworkingModule = Java.use('com.facebook.react.modules.network.NetworkingModule');

    NetworkingModule.sendRequestInternal.implementation = function (str, str2, i10, readableArray, readableMap, str3, z10, i11, z11) {
        console.log("=== sendRequestInternal Hooked ===");

        // Request 정보 출력
        console.log("Method: " + str);
        console.log("URL: " + str2);

        // ReadableArray 출력 (헤더)
        // if (readableArray !== null && readableArray.size() > 0) {
        //     var headers = "";
        //     for (var i = 0; i < readableArray.size(); i++) {
        //         var header = readableArray.getArray(i);
        //         if (header !== null) {
        //             headers += header.getString(0) + "=" + header.getString(1) + "\n";
        //         }
        //     }
        //     console.log("Request Headers:\n" + headers.trim());
        // } else {
        //     console.log("Request Headers: None");
        // }

        var result = this.sendRequestInternal(str, str2, i10, readableArray, readableMap, str3, z10, i11, z11);

        return result;
    };
});
