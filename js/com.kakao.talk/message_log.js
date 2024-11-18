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
    console.log("[+] - Header:", packet.b.value);
    console.log("[+] - Body:", packet.d.value.toString());
}

function hookSession(locoClient) {
    locoClient.h.implementation = function (locoReq) {
        console.log("[+] Request!");
        printPacket(locoReq);

        const time = Date.now();

        const locoRes = this.h(locoReq);

        console.log("[+] Response! (" + (Date.now() - time) + "ms)");
        printPacket(locoRes);

        console.log('--------------------------------------------')

        return locoRes;
    };
}

Java.perform(function () {
    try {
        var BasicBSONObject = Java.use("Mh0.g");
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