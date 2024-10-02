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
        var BasicBSONObject = Java.use("kc3.f");
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
    // `com.kakao.talk.loco.protocol.d` 클래스를 찾습니다.
    var dClass = Java.use("com.kakao.talk.loco.protocol.d");

    // d 클래스의 생성자를 후킹합니다.
    dClass.$init.overload('com.kakao.talk.loco.protocol.b', 'kc3.d').implementation = function (bVar2, a14) {
        console.log("[*] Server 에서 수신된 데이터");

        // bVar2 출력
        console.log("[*] Header : " + bVar2);
        // a14 출력
        console.log("[*] Body");

        try {
            // a14 객체의 toMap()을 호출하여 Map 객체를 가져옵니다.
            var map = a14.toMap();

            // Map의 키를 가져옵니다.
            var keys = map.keySet();  // Java의 Set 객체 반환
            var keysArray = Java.cast(keys, Java.use("java.util.Set"));  // 명시적 변환

            var result = [];
            var iterator = keysArray.iterator();
            while (iterator.hasNext()) {
                var key = iterator.next();
                var value = map.get(key);  // 각 키에 대응하는 값을 가져옴

                // chatLog라는 키가 있다면 그 안의 값도 처리합니다.
                if (key.toString() === "chatLog") {

                    // `kc3.f` 클래스는 `LinkedHashMap`이므로 바로 Map처럼 처리 가능
                    var chatLogMap = Java.cast(value, Java.use("java.util.LinkedHashMap")); // LinkedHashMap으로 캐스팅
                    var chatLogResult = [];

                    // chatLog 안의 key=value 형태로 문자열로 결합
                    var chatLogKeys = chatLogMap.keySet();
                    var chatLogKeysArray = Java.cast(chatLogKeys, Java.use("java.util.Set"));
                    var chatLogIterator = chatLogKeysArray.iterator();

                    while (chatLogIterator.hasNext()) {
                        var chatLogKey = chatLogIterator.next();
                        var chatLogValue = chatLogMap.get(chatLogKey);

                        // 배열을 순회하며 key와 originalValue가 일치하면 changeValue로 변경
                        for (var i = 0; i < receiveDataReplacements.length; i++) {
                            var changeKey = receiveDataReplacements[i][0];
                            var originalValue = receiveDataReplacements[i][1];
                            var changeValue = receiveDataReplacements[i][2];
                            if (chatLogKey.toString() === changeKey && chatLogValue.toString() === originalValue) {
                                chatLogValue = changeValue; // 값을 변경
                                chatLogMap.put(chatLogKey, chatLogValue); // 변경된 값을 다시 Map에 넣기
                                console.log("[*] '" + changeKey + "' 값이 '" + originalValue + "'에서 '" + changeValue + "'로 변경됨");
                            }
                        }

                        chatLogResult.push(chatLogKey + "=" + chatLogValue);
                    }

                    // chatLog 전체를 문자열로 결합하여 저장
                    result.push(key + "={" + chatLogResult.join(", ") + "}");
                } else {
                    // 다른 key=value 형식으로 결합
                    result.push(key + "=" + value);
                }
            }

            // 최종 결과 출력
            console.log("{ " + result.join(", ") + " }");
            
        } catch (e) {
            console.log("에러 발생: " + e);
        }

        // 원래 생성자를 호출하여 객체가 정상적으로 생성되도록 합니다.
        return this.$init(bVar2, a14);
    };
});
