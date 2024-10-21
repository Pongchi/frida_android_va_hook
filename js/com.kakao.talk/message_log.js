Java.perform(function () {
    try {
        var locoClient = Java.use("com.kakao.talk.loco.net.server.LocoClient");
        console.log("[+] Found LocoClient Class!");

        hookSession(locoClient);

        console.log("[+] Hooked LocoClient Class!");
    } catch (error) {
        console.log(error);
    }
});

function printPacket(packet) {
    console.log("[+] - Header:", packet._a.value);
    console.log("[+] - Method: ", packet._a.value.c.value.toString());
    console.log("[+] - Body:", packet.c.value.toString());
}

function hookSession(locoClient) {
    locoClient.o.implementation = function (locoReq) {
        console.log("[+] Request!");
        printPacket(locoReq);

        const time = Date.now();

        const locoRes = this.o(locoReq);

        console.log("[+] Response! (" + (Date.now() - time) + "ms)");
        printPacket(locoRes);

        console.log('--------------------------------------------')

        return locoRes;
    };
}

Java.perform(function () {
    try {
        var BasicBSONObject = Java.use("jf3.f");
        console.log("[+] Found BasicBSONObject Class!");

        // a 메소드 후킹
        BasicBSONObject.a.overload('java.lang.Object', 'java.lang.String').implementation = function (value, key) {
            // replacements 배열을 순회
            for (var i = 0; i < inputDataReplacements.length; i++) {
                var replacement = inputDataReplacements[i];
                var replacementKey = replacement[0];
                var originalValue = replacement[1];
                var newValue = replacement[2];

                // 키가 replacementKey와 일치하는 경우
                if (key === replacementKey) {
                    // originalValue가 "*"일 경우 무조건 newValue로 변경
                    if (originalValue === "*") {
                        console.log("[+] Original Value: '" + value + "'");
                        console.log("[+] Changing value for key '" + key + "' to '" + newValue + "'");
                        value = newValue; // 값 변경
                        break; // 반복 종료
                    }

                    // originalValue와 value가 일치할 경우 newValue로 변경
                    if (String(value) === originalValue) {
                        console.log("[+] Changing " + key + " value from '" + originalValue + "' to '" + newValue + "'");
                        value = newValue; // 값 변경
                        break; // 변경이 발생했으므로 반복 종료
                    }
                }
            }

            // 원래의 a 메소드 호출
            return this.a(value, key);
        };

        console.log("[+] Hooked a() Method!");
    } catch (error) {
        console.log("[Error] " + error);
    }
});

Java.perform(function () {
    // `com.kakao.talk.loco.protocol.d` 클래스를 가져옵니다.
    var dClass = Java.use("com.kakao.talk.loco.protocol.d");

    // d 클래스의 생성자를 후킹합니다.
    dClass.$init.overload('com.kakao.talk.loco.protocol.b', 'jf3.d').implementation = function (locoHeader, bodyMap) {
        console.log("[*] d 클래스의 생성자 호출 감지");

        // Header와 BodyMap을 출력합니다.
        console.log("[*] Header: " + locoHeader);
        console.log("[*] BodyMap: " + bodyMap);

        try {
            // bodyMap의 toMap() 메소드를 호출해 Map 객체로 변환합니다.
            var map = bodyMap.toMap();

            // Map의 모든 키를 순회하며 내용을 출력합니다.
            var keys = map.keySet();
            var iterator = keys.iterator();

            var result = [];
            while (iterator.hasNext()) {
                var key = iterator.next();
                var value = map.get(key);

                // chatLog라는 키를 처리합니다.
                if (key.toString() === "chatLog") {
                    var chatLogMap = Java.cast(value, Java.use("java.util.LinkedHashMap"));
                    var chatLogResult = [];

                    var chatLogKeys = chatLogMap.keySet();
                    var chatLogIterator = chatLogKeys.iterator();

                    while (chatLogIterator.hasNext()) {
                        var chatLogKey = chatLogIterator.next();
                        var chatLogValue = chatLogMap.get(chatLogKey);

                        // 원하는 키-값 쌍을 변경합니다.
                        for (var i = 0; i < receiveDataReplacements.length; i++) {
                            var changeKey = receiveDataReplacements[i][0];
                            var originalValue = receiveDataReplacements[i][1];
                            var changeValue = receiveDataReplacements[i][2];

                            if (chatLogKey.toString() === changeKey && chatLogValue.toString() === originalValue) {
                                chatLogValue = changeValue;  // 값 변경
                                chatLogMap.put(chatLogKey, chatLogValue);  // 변경된 값 반영
                                console.log("[*] '" + changeKey + "' 값이 '" + originalValue + "'에서 '" + changeValue + "'로 변경되었습니다.");
                            }
                        }

                        chatLogResult.push(chatLogKey + "=" + chatLogValue);
                    }

                    result.push(key + "={" + chatLogResult.join(", ") + "}");
                } else {
                    result.push(key + "=" + value);
                }
            }

            // 최종 결과를 출력합니다.
            console.log("{ " + result.join(", ") + " }");

        } catch (e) {
            console.log("[!] 오류 발생: " + e);
        }

        // 원래 생성자를 호출해 객체를 정상적으로 생성합니다.
        return this.$init(locoHeader, bodyMap);
    };
});
