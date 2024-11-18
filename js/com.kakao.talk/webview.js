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
  var URIControllerClass = Java.use("SD.k");

  // a 메소드의 원본 구현을 변수에 저장
  var originalAMethod = URIControllerClass.a;

  // a 메소드를 후킹하여 인자와 리턴 값 출력
  URIControllerClass.a.implementation = function (context, sourceUri, map) {
      console.log("[*] a() 메소드 호출됨");

      // 인자 값 출력
      console.log("    - context: " + context);
      console.log("    - sourceUri: " + sourceUri.toString());

      // map 내용 출력
      if (map) {
          console.log("    - map:");
          var keySet = map.keySet();
          var iterator = keySet.iterator();
          while (iterator.hasNext()) {
              var key = iterator.next();
              var value = map.get(key);
              console.log("      * " + key + ": " + value);
          }
      } else {
          console.log("    - map: null");
      }

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

Java.perform(function () {
  const EasyWebConfiguration = Java.use("com.kakao.talk.web.EasyWebConfiguration");

  // EasyWebConfiguration의 생성자 후킹
  EasyWebConfiguration.$init.overload('java.lang.String', 'java.util.Map', 'java.lang.String', 'com.kakao.talk.web.EasyWebFeatures', 'com.kakao.talk.web.EasyWebLayoutScaffold', 'com.kakao.talk.web.EasyWebUrlData').implementation = function (url, header, referer, features, layoutScaffold, urlData) {
      console.log("[+] EasyWebConfiguration Constructor called");

      console.log(" - url:", url);
      console.log(" - referer:", referer);
      console.log(" - features:", features);
      console.log(" - layoutScaffold:", layoutScaffold);
      console.log(" - urlData:", urlData);

      // 헤더 출력
      if (header) {
          console.log(" - header:");
          const keySet = header.keySet();
          const iterator = keySet.iterator();

          while (iterator.hasNext()) {
              const key = iterator.next();
              const value = header.get(key);
              console.log(`   - ${key}: ${value}`);

              // 문자열 비교를 .equals()로 변경
              if (key.equals("Authorization")) {
                  console.log(`[*] Original Authorization: ${value}`);
                  const newValue = "new_authorization_token_value"; // 새 Authorization 값
                  header.put(key, newValue); // Authorization 값을 변경
                  console.log(`[*] Modified Authorization: ${header.get(key)}`);
              }
          }
      }

      // 원래 생성자 호출
      return this.$init(url, header, referer, features, layoutScaffold, urlData);
  };
});