/*
// 1초마다 후킹이 정상적으로 작동하는지 확인하는 함수
function checkHooking() {
    Java.perform(function() {
        // MainActivity 클래스를 가져옴
        var MainActivity = Java.use("com.discord.main.MainActivity");

        // MainActivity의 onResume 메소드를 후킹
        MainActivity.onResume.implementation = function() {
            console.log("[*] MainActivity의 onResume 호출됨");
            // 원래 onResume 메소드를 호출
            this.onResume();
        };
    });

    console.log("[*] 후킹 체크 완료");
}

// 1초마다 후킹 체크를 실행하는 코드
function intervalHookCheck() {
    setInterval(function() {
        checkHooking();  // 1초마다 후킹 확인
    }, 100);  // 1000ms = 1초
}

// JavaScript 실행이 시작될 때
Java.perform(function() {
    console.log("[*] Discord 후킹 시작");
    intervalHookCheck();  // 주기적으로 후킹 체크
});
*/