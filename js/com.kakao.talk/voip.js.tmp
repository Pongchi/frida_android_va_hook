// Java.perform(function () {
//     // 해당 클래스가 로드되면 후킹 진행
//     var Logger = Java.use('com.kakao.vox.utils.Logger');

//     // d 메소드 후킹
//     Logger.d.overload('java.lang.String').implementation = function (str) {
//         // 전달된 str 값을 출력
//         console.log('VOX Log : ' + str);

//         // 원래 메소드를 호출 (필요한 경우)
//         var result = this.d(str);
//         return result;
//     };
// });

Java.perform(function () {
    // VoxCall30Source 클래스를 로드
    var VoxCall30Source = Java.use('com.kakao.vox.call.VoxCall30Source');

    // sendVideoACCInfo 메소드를 후킹
    VoxCall30Source.sendVideoACCInfo.overload('int', 'java.lang.String', 'java.lang.String').implementation = function (i14, str, str2) {
        // 전달된 인자값을 출력
        // console.log("sendVideoACCInfo called with arguments: ");
        // console.log("i14 (int): " + i14);
        // console.log("str (String): " + str);
        // console.log("str2 (String): " + str2);

        str = "4415522.emot_001.webp"

        // 원래의 메소드를 호출하여 기능 유지
        var result = this.sendVideoACCInfo(i14, str, str2);

        // 반환값 출력 (필요한 경우)
        console.log("sendVideoACCInfo returned: " + result);

        return result;
    };
});


// Java.perform(function () {
//     // CallCdr 클래스를 로드
//     var CallCdr = Java.use('com.kakao.vox.cdr.CallCdr');

//     // makeEvent 메소드를 후킹
//     CallCdr.makeEvent.overload('java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.String').implementation = function (str, str2, str3, str4) {
//         // 전달된 인자값을 출력
//         console.log("makeEvent called with arguments: ");
//         console.log("str: " + str);
//         console.log("str2: " + str2);
//         console.log("str3: " + str3);
//         console.log("str4: " + str4);

//         // 원래의 메소드를 호출
//         this.makeEvent(str, str2, str3, str4);
//     };
// });
