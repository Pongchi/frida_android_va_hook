/*
Debug Deep Links.
*/

Java.perform(function () {
  deepLinkSniffer();
});

Java.perform(function () {
  deepLinkSniffer();
});

function deepLinkSniffer() {
  var Intent = Java.use("android.content.Intent");
  var Uri = Java.use("android.net.Uri");

  Intent.getData.implementation = function () {
    var action = this.getAction() !== null ? this.getAction().toString() : false;
    if (action) {
      console.log("[*] Intent.getData() was called");
      if (this.getComponent()) {
        console.log("[*] Activity: " + this.getComponent().getClassName());
      }
      console.log("[*] Action: " + action);
      var uri = this.getData();

      if (uri !== null) {
        console.log("\n[*] Original Data:");
        uri.getScheme() && console.log("- Scheme:\t" + uri.getScheme() + "://");
        uri.getHost() && console.log("- Host:\t\t/" + uri.getHost());
        uri.getQuery() && console.log("- Params:\t" + uri.getQuery());
        uri.getFragment() && console.log("- Fragment:\t" + uri.getFragment());

        if (true) {
          printStacktrace();
        }

        console.log('--------------------------------------------');
        /*
        // 450181815 문자열을 450182308로 변경
        var originalUriString = uri.toString();
        if (originalUriString.includes("450181815")) {
          var newUriString = originalUriString.replace("450181815", "450171815");
          var newUri = Uri.parse(newUriString);
          this.setData(newUri);  // 새로운 URI를 Intent에 설정

          console.log("[*] Modified Data:");
        } else {
          console.log("[-] 450181815 문자열을 찾지 못했습니다.");
          console.log('--------------------------------------------');
        }
          */
      } else {
        console.log("[-] No data supplied.");
        console.log('--------------------------------------------');
      }
    }
    
    return this.getData();  // 수정된 데이터 반환
  };
}


function printStacktrace() {
  var stacktrace = Java.use("android.util.Log")
    .getStackTraceString(Java.use("java.lang.Exception").$new())
    .replace("java.lang.Exception", "");
  console.log(stacktrace);
}



Java.perform(function() {
  // us1.j0 클래스 가져오기
  var j0Class = Java.use('us1.j0');

  // b 메소드 후킹
  j0Class.b.overload('android.content.Context', 'android.net.Uri', 'java.util.Map').implementation = function(context, uri, map) {
      console.log("[*] b 메소드 호출됨");

      // 인자 로깅
      console.log("Context: " + context);
      console.log("Uri: " + uri);
      console.log("Map<String, String>: " + map);

      // 원래 메소드를 호출하고 반환 값 저장
      var result = this.b(context, uri, map);

      // 반환 값 로깅
      console.log("Return Value (boolean): " + result);
      
      // 결과 반환
      return result;
  };
});

Java.perform(function() {
  // com.kakao.talk.model.kakaolink.b 클래스 가져오기
  var bClass = Java.use('com.kakao.talk.model.kakaolink.b');

  // b 메소드 후킹
  bClass.b.overload('java.lang.String').implementation = function(str) {
      console.log("[*] b 메소드 호출됨");

      // 인자 로깅
      console.log("String argument: " + str);

      // 원래 메소드를 호출하고 반환 값 저장
      var result = this.b(str);

      // 반환 값 로깅
      console.log("Return Value (KakaoLinkSpec): " + result);
      
      if (enableStacktracePrinting) {
        printStacktrace();
      }

      // 결과 반환
      return result;
  };
});

Java.perform(function() {
  // bn.a 클래스 가져오기
  var aClass = Java.use('bn.a');

  // 정확한 시그니처에 맞게 a 메소드 후킹
  aClass.a.overload('bn.a', 'android.content.Context', 'com.kakao.sdk.share.model.ValidationResult', 'java.util.Map', 'java.lang.String').implementation = function(instance, context, response, map, appKey) {
      console.log("[*] a 메소드 호출됨");

      // 인자 로깅
      console.log("Instance (bn.a): " + instance);
      console.log("Context: " + context);
      console.log("ValidationResult: " + response);
      console.log("Map: " + map);
      console.log("AppKey: " + appKey);

      // 원래 메소드를 호출하고 반환 값 저장
      var result = this.a(instance, context, response, map, appKey);

      // 반환 값 로깅
      console.log("SharingResult: " + result);
      
      // 결과 반환
      return result;
  };
});

Java.perform(function() {
  var IntentFilterActivity = Java.use('com.kakao.talk.activity.IntentFilterActivity');

  // onResume 메소드 후킹
  IntentFilterActivity.onResume.implementation = function() {
      var intent = this.getIntent();
      var data = intent.getData();

      if (data !== null && data.getScheme() === "kakaolink" && data.getHost() === "send") {
          console.log("[*] kakaolink://send 딥링크 감지");
          console.log("Data: " + data.toString());
      }

      // 원래 onResume 메소드 호출
      this.onResume();
  };
});

Java.perform(function() {
  var KakaoLinkSpecClass = Java.use('gb1.a');  // 클래스 이름을 가져옵니다.

  // a 메소드 후킹
  KakaoLinkSpecClass.a.overload('com.kakao.talk.manager.send.q', 'long').implementation = function(qVar, j14) {
      console.log("[*] a 메소드 호출됨");
      console.log("qVar: " + qVar);
      console.log("j14: " + j14);
      
      // 원래 메소드 호출 및 반환값 로깅
      var result = this.a(qVar, j14);
      console.log("Result from a: " + result);
      return result;
  };

  // b 메소드 후킹
  KakaoLinkSpecClass.b.overload('long', 'com.kakao.talk.manager.send.q', '[J').implementation = function(j14, qVar, jArr) {
      console.log("[*] b 메소드 호출됨");
      console.log("j14: " + j14);
      console.log("qVar: " + qVar);
      console.log("jArr: " + jArr);

      var result = this.b(j14, qVar, jArr);
      console.log("Result from b: " + result);
      return result;
  };

  // c 메소드 후킹
  KakaoLinkSpecClass.c.overload('long').implementation = function(j14) {
      console.log("[*] c 메소드 호출됨");
      console.log("j14: " + j14);

      var result = this.c(j14);
      console.log("Result from c: " + result);
      return result;
  };

  // d 메소드 후킹
  KakaoLinkSpecClass.d.implementation = function() {
      console.log("[*] d 메소드 호출됨");

      try {
          var result = this.d();
          console.log("Result from d: " + result);
          return result;
      } catch (e) {
          console.log("Exception in d: " + e);
          throw e;
      }
  };

  // e 메소드 후킹
  KakaoLinkSpecClass.e.implementation = function() {
      console.log("[*] e 메소드 호출됨");

      var result = this.e();
      console.log("Result from e: " + result);
      return result;
  };
});

