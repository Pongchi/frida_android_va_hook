/*
Debug WebViews.
*/

Java.perform(function () {
  enableWebviewDebugging();
});

function enableWebviewDebugging() {
  var Webview = Java.use("android.webkit.WebView");

  Webview.loadUrl.overload("java.lang.String").implementation = function (url) {
    console.log("\n[+] {case 1} Loading URL from", url);

    // WebView 설정 정보 출력
    printWebViewSettings(this);

    console.log("[+] Setting the value of setWebContentsDebuggingEnabled() to TRUE");

    if (enableStacktracePrinting) {
      printStacktrace();
    }

    this.setWebContentsDebuggingEnabled(true);
    this.loadUrl.overload("java.lang.String").call(this, url);
  };

  Webview.loadUrl.overload("java.lang.String", "java.util.Map").implementation = function (url, additionalHttpHeaders) {
    if (enableStacktracePrinting) {
      printStacktrace();
    }
    
    console.log("\n[+] {case 2} Loading URL from", url);
    console.log("[+] Additional Headers:");
    var headers = Java.cast(additionalHttpHeaders, Java.use("java.util.Map"));
    printMap(headers);

    // WebView 설정 정보 출력
    printWebViewSettings(this);

    console.log("[+] Setting the value of setWebContentsDebuggingEnabled() to TRUE");

    if (enableStacktracePrinting) {
      printStacktrace();
    }

    this.setWebContentsDebuggingEnabled(true);
    this.loadUrl.overload("java.lang.String", "java.util.Map").call(this, url, additionalHttpHeaders);
  };

  Webview.addJavascriptInterface.implementation = function (object, name) {
    console.log("[+] Javascript interface: " + object.$className + " instantiated as: " + name);
    this.addJavascriptInterface(object, name);
  };

  var WebviewClient = Java.use("android.webkit.WebViewClient");
  WebviewClient.onPageStarted.overload(
    "android.webkit.WebView",
    "java.lang.String",
    "android.graphics.Bitmap"
  ).implementation = function (view, url, favicon) {
    console.log("onPageStarted URL: " + url);
    if (enableStacktracePrinting) {
      printStacktrace();
    }
    this.onPageStarted.overload(
      "android.webkit.WebView",
      "java.lang.String",
      "android.graphics.Bitmap"
    ).call(this, view, url, favicon);
  };

  var webviewHelper = Java.use("com.kakao.talk.widget.webview.WebViewHelper");

  var downloadFile = webviewHelper.newDownloadFile.overload("java.lang.String");
  downloadFile.implementation = function (arg0) {
    console.log(arg0);
    var ret = this.newDownloadFile(arg0);
    console.log(ret);
    return ret;
  };

  var processDownload = webviewHelper.processDownload.overload(
    "android.content.Context",
    "java.lang.String",
    "java.lang.String",
    "java.lang.String"
  );
  processDownload.implementation = function (arg0, arg1, arg2, arg3) {
    console.log(arg0);
    console.log(arg1);
    console.log(arg2);
    console.log(arg3);
    var ret = this.processDownload(arg0, arg1, arg2, arg3);
    console.log(ret);
    return ret;
  };
}

// WebView의 설정을 출력하는 함수
function printWebViewSettings(webview) {
  var settings = webview.getSettings();

  console.log("[+] JavaScript enabled: " + settings.getJavaScriptEnabled());
  console.log("[+] Multiple windows support: " + settings.supportMultipleWindows());
  console.log("[+] File access: " + settings.getAllowFileAccess());
  console.log("[+] Universal access from file URLs: " + settings.getAllowUniversalAccessFromFileURLs());
  console.log("[+] Dom storage enabled: " + settings.getDomStorageEnabled());
  console.log("[+] Built-in zoom controls: " + settings.getBuiltInZoomControls());
  console.log("[+] Display zoom controls: " + settings.getDisplayZoomControls());
  console.log("[+] User agent string: " + settings.getUserAgentString());
  console.log("[+] Cache mode: " + settings.getCacheMode());
  console.log("[+] Load images automatically: " + settings.getLoadsImagesAutomatically());
  console.log("[+] Mixed content mode: " + settings.getMixedContentMode());
}

function printStacktrace() {
  var stacktrace = Java.use("android.util.Log")
    .getStackTraceString(Java.use("java.lang.Exception").$new())
    .replace("java.lang.Exception", "");
  console.log(stacktrace);
}

function printMap(map) {
  var mapIter = map.entrySet().iterator();
  while (mapIter.hasNext()) {
    console.log(mapIter.next());
  }
}

Java.perform(function () {
  // 클래스 및 메소드 후킹
  var URIControllerClass = Java.use("u81.l");

  // a 메소드의 원본 구현을 변수에 저장
  var originalAMethod = URIControllerClass.a;

  // a 메소드를 후킹하여 인자와 리턴 값 출력
  URIControllerClass.a.implementation = function (context, sourceUri, map) {
      console.log("[*] a() 메소드 호출됨");

      // 인자 값 출력
      console.log("    - context: " + context);
      console.log("    - sourceUri: " + sourceUri.toString());
      console.log("    - map: " + JSON.stringify(map));

      // 원본 메소드 호출 및 리턴 값 저장
      var result = originalAMethod.call(this, context, sourceUri, map);

      // 리턴 값 출력
      if (result !== null) {
          console.log("    - 리턴 값: " + result.toString());
      } else {
          console.log("    - 리턴 값: null");
      }

      if (enableStacktracePrinting) {
        printStacktrace();
      }

      return result;  // 원본 리턴 값 반환
  };
});

/*
Java.perform(function () {
  // RPC 메서드 정의
  rpc.exports = {
      runprintpatterns: function () {
          try {
              var oClass = Java.use("com.kakao.talk.util.o");

              var fields = oClass.class.getDeclaredFields();
              var patterns = fields.map(function (field) {
                  return field.getName(); // 필드 이름만 가져오기
              });

              console.log("[+] 모든 패턴 출력:");
              patterns.forEach(function (pattern) {
                  try {
                      var patternInstance = oClass[pattern].value;
                      console.log("    - " + pattern + ": " + patternInstance.pattern());
                  } catch (e) {
                      console.log("    - " + pattern + ": 접근 불가 또는 없음");
                  }
              });
          } catch (e) {
              console.error("[-] 오류 발생: " + e);
          }
      }
  };
});

*/
/*
Java.perform(function () {
  try {
      // u50.c 클래스 참조
      var targetClass = Java.use('u50.c');

      console.log("[*] Fields in u50.c:");

      // 모든 필드 가져오기
      var fields = targetClass.class.getDeclaredFields();

      fields.forEach(function (field) {
          try {
              field.setAccessible(true); // private 필드 접근 허용
              
              var fieldName = field.getName();
              
              // 필드가 정적(static)인지 확인하고 접근 방식 결정
              var value;
              if (field.getModifiers() & Java.use('java.lang.reflect.Modifier').STATIC) {
                  value = field.get(null);  // 정적 필드 접근
              } else {
                  value = field.get(targetClass.$new());  // 인스턴스 필드 접근
              }

              console.log(fieldName + ": " + value);
          } catch (e) {
              console.log("Error accessing field: " + e.message);
          }
      });
  } catch (e) {
      console.log("Error: " + e.message);
  }
});

Java.perform(function () {
  // 후킹할 클래스 참조
  var AClass = Java.use('c50.a');

  console.log("[*] Hooked c50.a class fields:");

  // 클래스의 모든 필드 가져오기
  var fields = AClass.class.getDeclaredFields();

  fields.forEach(function (field) {
      try {
          field.setAccessible(true); // private 필드 접근 허용
          
          var fieldName = field.getName();
          var fieldValue;

          // 정적(static) 필드인지 확인 후 접근 방식 결정
          if (field.getModifiers() & Java.use('java.lang.reflect.Modifier').STATIC) {
              fieldValue = field.get(null);  // 정적 필드는 null로 접근
          } else {
              fieldValue = field.get(AClass.$new());  // 인스턴스 필드는 객체 생성 후 접근
          }

          console.log(fieldName + ": " + fieldValue);
      } catch (e) {
          console.log("Error accessing field " + field.getName() + ": " + e.message);
      }
  });
});

*/

Java.perform(function () {
  var h0Class = Java.use("gx1.h0$a"); // 후킹할 클래스 정의

  h0Class.invoke.implementation = function(iVar) {
      console.log("[*] gx1.h0$a invoke 호출됨");

      if (enableStacktracePrinting) {
        printStacktrace();
      }

      // iVar 객체의 모든 필드 출력
      var iVarClass = iVar.getClass(); // iVar 클래스 가져오기
      console.log("== gx1.h0$a iVar 클래스 필드 출력 ==");
      while (iVarClass != null) { // 상위 클래스까지 순회
          var fields = iVarClass.getDeclaredFields();
          fields.forEach(function (field) {
              field.setAccessible(true); // 비공개 필드 접근 허용
              var fieldValue = field.get(iVar);
              console.log("gx1.h0$a - " + field.getName() + ": " + fieldValue);
          });
          iVarClass = iVarClass.getSuperclass(); // 상위 클래스
      }

      // iVar 객체의 모든 메서드 출력
      iVarClass = iVar.getClass(); // 초기화
      console.log("== iVar 클래스 메서드 출력 ==");
      while (iVarClass != null) { // 상위 클래스까지 순회
          var methods = iVarClass.getDeclaredMethods();
          methods.forEach(function (method) {
              method.setAccessible(true);
              console.log("gx1.h0$a - 메서드 이름: " + method.getName());
          });
          iVarClass = iVarClass.getSuperclass(); // 상위 클래스
      }

      // 원래 invoke 메서드 호출
      var result = this.invoke(iVar);
      
      // 확인을 위해 설정된 f62631a 값 출력
      console.log("f62631a 값 설정됨: ", iVar.a);

      return result;
  };
});

Java.perform(function () {
  // EasyWebActivity.d 클래스 가져오기
  var EasyWebActivity_d = Java.use("com.kakao.talk.web.EasyWebActivity$d");

  // invoke 메서드 후킹
  EasyWebActivity_d.invoke.implementation = function () {
      console.log("[*] EasyWebActivity$d invoke 메서드 호출됨");

      // 원래 메서드 실행하여 결과 받기
      var result = this.invoke();

      // EasyWebConfiguration 객체 출력
      if (result !== null) {
          console.log("[*] 반환된 EasyWebConfiguration 객체:");
          
          // 객체의 필드들을 출력
          var fields = result.getClass().getDeclaredFields();
          fields.forEach(function(field) {
              field.setAccessible(true);
              var fieldValue = field.get(result);
              console.log("EasyWebActivity$d - " + field.getName() + ": " + fieldValue);
          });
      } else {
          console.log(" - 반환된 값이 null입니다.");
      }

      return result; // 원래의 결과 반환
  };
});

Java.perform(function () {
  // WebViewModuleFacade 인터페이스를 구현한 kx1.b 클래스 가져오기
  var WebViewModuleFacadeImpl = Java.use("kx1.b");

  // getKakaoStyleIntent 메서드 후킹
  WebViewModuleFacadeImpl.getKakaoStyleIntent.implementation = function (context, str, str2) {
      console.log("[*] getKakaoStyleIntent 메서드 호출됨");

      // 전달된 인자 출력
      console.log(" - context 인자:", context);
      console.log(" - str 인자:", str);
      console.log(" - str2 인자:", str2);

      // 원래 메서드 호출하여 결과 받기
      var result = this.getKakaoStyleIntent(context, str, str2);

      // 결과 Intent 객체의 정보를 출력
      if (result !== null) {
          console.log("[*] 반환된 getKakaoStyleIntent Intent 객체:");
          console.log(" - getKakaoStyleIntent Action:", result.getAction());
          console.log(" - getKakaoStyleIntent Data:", result.getDataString());
          console.log(" - getKakaoStyleIntent Extras:");
          var extras = result.getExtras();
          if (extras !== null) {
              var iter = extras.keySet().iterator();
              while (iter.hasNext()) {
                  var key = iter.next();
                  console.log("   - getKakaoStyleIntent : " + key + ":", extras.get(key));
              }
          } else {
              console.log("   - getKakaoStyleIntent : extras가 없습니다.");
          }
      } else {
          console.log(" - 반환된 값이 null입니다.");
      }

      return result; // 원래 결과 반환
  };
});

Java.perform(function () {
  // EasyWebActivity 클래스 자체를 가져옴
  var EasyWebActivity = Java.use("com.kakao.talk.web.EasyWebActivity$a");

  // Companion 객체에 접근하지 않고 직접 클래스 메서드 호출
  EasyWebActivity.a.overload('android.content.Context', 'java.lang.Class', 'r93.l').implementation = function (context, cls, block) {
      console.log("[*] EasyWebActivity.a 메서드 호출됨");

      // 전달된 인자 출력
      console.log(" - context 인자:", context.toString());
      console.log(" - Class 인자:", cls.toString());
      console.log(" - block 인자:", block.toString());

      // 원래 메서드 호출하여 결과 받기
      var result = this.a(context, cls, block);

      // 결과 Intent 객체의 정보 출력
      if (result !== null) {
          console.log("[*] EasyWebActivity.a 반환된 Intent 객체:");
          console.log(" - EasyWebActivity.a Action:", result.getAction());
          console.log(" - EasyWebActivity.a Data:", result.getDataString());
          console.log(" - EasyWebActivity.a Extras:");
          var extras = result.getExtras();
          if (extras !== null) {
              var iter = extras.keySet().iterator();
              while (iter.hasNext()) {
                  var key = iter.next();
                  console.log("   - EasyWebActivity.a : " + key + ":", extras.get(key));
              }
          } else {
              console.log("   - EasyWebActivity.a : extras가 없습니다.");
          }
      } else {
          console.log(" - 반환된 값이 null입니다.");
      }

      return result; // 원래 결과 반환
  };
});

Java.perform(function () {
  const TargetClass = Java.use('com.kakao.talk.webview.activity.t');

  // 생성자 후킹
  TargetClass.$init.overload('java.lang.String', 'java.lang.String').implementation = function (arg1, arg2) {
      console.log('[*] Constructor called with arguments:');
      console.log('    - arg1 (f62912g): ' + arg1);
      console.log('    - arg2 (f62913h): ' + arg2);

      // 원래 생성자 호출
      return this.$init(arg1, arg2);
  };
});


Java.perform(function () {
  const TargetClass = Java.use('com.kakao.talk.webview.activity.t');

  // invoke 메서드 후킹
  TargetClass.invoke.overload('java.lang.Object').implementation = function (arg) {
      console.log('[*] invoke method called with argument:');
      console.log('    - arg (java.lang.Object): ' + arg);

      // 원래 메서드 호출 및 결과 캡처
      const result = this.invoke(arg);

      console.log('[*] invoke method returned: ' + result);
      return result;
  };
});

// EasyWebConfiguration 클래스의 생성자 후킹 코드
Java.perform(function () {
  const EasyWebConfiguration = Java.use("com.kakao.talk.web.EasyWebConfiguration");

  // EasyWebConfiguration의 생성자 후킹
  EasyWebConfiguration.$init.overload('java.lang.String', 'java.util.Map', 'java.lang.String', 'com.kakao.talk.web.EasyWebFeatures', 'com.kakao.talk.web.EasyWebLayoutScaffold', 'com.kakao.talk.web.EasyWebUrlData').implementation = function (url, header, referer, features, layoutScaffold, urlData) {
      // 각 인자값 출력
      console.log("[+] EasyWebConfiguration Constructor called");
      console.log(" - url:", url);
      console.log(" - header:", header);
      console.log(" - referer:", referer);
      console.log(" - features:", features);
      console.log(" - layoutScaffold:", layoutScaffold);
      console.log(" - urlData:", urlData);

      // 원래 생성자 호출
      return this.$init(url, header, referer, features, layoutScaffold, urlData);
  };
});

Java.perform(function () {
  // gx1.h0 클래스 가져오기
  const h0Class = Java.use("gx1.h0");

  // a 메소드의 모든 오버로드 출력
  console.log("[*] gx1.h0 클래스의 a 메소드 오버로드 목록:");
  h0Class.a.overloads.forEach(function (overload, index) {
      console.log(" - 오버로드 " + index + ": " + overload);
  });

  // r93.l 타입을 받는 a 메소드 후킹 (실제 인자 타입 확인)
  h0Class.a.overload('r93.l').implementation = function (builder) {
      console.log("[+] a() 메소드 호출됨");
      
      // builder 인자의 클래스 정보 출력
      console.log(builder.toString())

      // 원래 a 메소드 호출 및 결과 저장
      const result = this.a(builder);

      // 결과 출력
      console.log(" - 결과 (EasyWebConfiguration):", result);

      return result;  // 원래 결과 반환
  };
});


