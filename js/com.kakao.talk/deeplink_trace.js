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
        console.log('--------------------------------------------');

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