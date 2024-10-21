/*
Debug WebViews.
*/

Java.perform(function () {
  enableWebviewDebugging();
});

function enableWebviewDebugging() {
  var Webview = Java.use("android.webkit.WebView");

  Webview.loadUrl.overload("java.lang.String").implementation = function (url) {
    console.log("\n[+] Loading URL from", url);

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
    console.log("\n[+] Loading URL from", url);
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

