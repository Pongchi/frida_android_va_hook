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
    printStacktrace()
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
  // 클래스 참조
  var IntentUtils = Java.use('com.kakao.talk.util.IntentUtils');

  // H 메서드 오버라이드 (Uri 인자를 받음)
  IntentUtils.H.overload('android.net.Uri').implementation = function (uri) {
      console.log("[*] Hooked IntentUtils.H() method!");

      // 인자 출력
      console.log("Input Uri: " + uri.toString());

      // 원래 메서드 호출 및 결과 저장
      var result = this.H(uri);

      // 리턴 값 출력
      console.log("Return Intent: " + result.toString());

      // 결과 반환
      return result;
  };
});
