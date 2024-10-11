// Java.perform(function () {
//     // 해당 클래스의 패키지와 클래스 이름
//     var ScreenCapturerClass = Java.use('com.discord.media.engine.video.screen_capture.ScreenCapturer');

//     // startCapture 메서드를 후킹
//     ScreenCapturerClass.startCapture.overload('int', 'int', 'int').implementation = function (width, height, framerate) {
//         console.log("Original startCapture called with: ");
//         console.log("Width: " + width);
//         console.log("Height: " + height);
//         console.log("Framerate: " + framerate);

//         // 원하는 값으로 수정
//         var newWidth = 1280;    // 예: 1280px로 수정
//         var newHeight = 721;    // 예: 720px로 수정
//         var newFramerate = 160;  // 예: 60fps로 수정

//         console.log("Modified startCapture called with: ");
//         console.log("New Width: " + newWidth);
//         console.log("New Height: " + newHeight);
//         console.log("New Framerate: " + newFramerate);

//         // 수정된 인자로 원래 메서드 호출
//         this.startCapture(newWidth, newHeight, newFramerate);
//     };
// });

Java.perform(function () {
    // RtpReceiver 생성자 후킹
    var RtpReceiver = Java.use("org.webrtc.RtpReceiver");
    RtpReceiver.$init.overload("long").implementation = function (nativeRtpReceiver) {
        console.log("[*] RtpReceiver 생성자 호출됨");
        console.log("[*] nativeRtpReceiver: " + nativeRtpReceiver);
        // 원래의 생성자 호출
        return this.$init(nativeRtpReceiver);
    };

    // RtpSender 생성자 후킹
    var RtpSender = Java.use("org.webrtc.RtpSender");
    RtpSender.$init.overload("long").implementation = function (nativeRtpSender) {
        console.log("[*] RtpSender 생성자 호출됨");
        console.log("[*] nativeRtpSender: " + nativeRtpSender);
        // 원래의 생성자 호출
        return this.$init(nativeRtpSender);
    };
});