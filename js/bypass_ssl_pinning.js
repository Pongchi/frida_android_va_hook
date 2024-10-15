Java.perform(function() {
    console.log("[*] SSL Pinning Bypass 시작");

    var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
    var FileInputStream = Java.use("java.io.FileInputStream");
    var BufferedInputStream = Java.use("java.io.BufferedInputStream");
    var X509Certificate = Java.use("java.security.cert.X509Certificate");
    var KeyStore = Java.use("java.security.KeyStore");
    var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
    var SSLContext = Java.use("javax.net.ssl.SSLContext");
    var KeyManagerFactory = Java.use("javax.net.ssl.KeyManagerFactory");

    // Load CAs from an InputStream
    var cf = CertificateFactory.getInstance("X.509");

    try {
        var fileInputStream = FileInputStream.$new("/data/local/tmp/cert-der.crt");
    } catch (err) {}

    var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
    var ca = cf.generateCertificate(bufferedInputStream);
    bufferedInputStream.close();

    var certInfo = Java.cast(ca, X509Certificate);

    // Create a KeyStore containing our trusted CAs
    var keyStoreType = KeyStore.getDefaultType();
    var keyStore = KeyStore.getInstance(keyStoreType);
    keyStore.load(null, null);
    keyStore.setCertificateEntry("ca", ca);

    // Create a TrustManager that trusts the CAs in our KeyStore
    var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
    var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
    tmf.init(keyStore);

    // Create a KeyManagerFactory and KeyManager array
    var kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
    kmf.init(null, null);

    SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function(keyManagers, trustManagers, secureRandom) {
        if (keyManagers == null) {
            keyManagers = kmf.getKeyManagers();
        }
        if (trustManagers == null) {
            trustManagers = tmf.getTrustManagers();
        }
        SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, keyManagers, trustManagers, secureRandom);
    };

    var HttpsURLConnection = Java.use('javax.net.ssl.HttpsURLConnection');
    HttpsURLConnection.setSSLSocketFactory.implementation = function(factory) {
        this.setSSLSocketFactory(factory);
    };

    try {
        var OkHttp_CertificatePinner = Java.use('okhttp3.CertificatePinner');
        OkHttp_CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function(a, b) {
            return;
        };
    } catch (err) {}

    try {
        var array_list = Java.use("java.util.ArrayList");
        var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
        TrustManagerImpl.checkTrustedRecursive.implementation = function(a1, a2, a3, a4, a5, a6) {
            return array_list.$new();
        };
        TrustManagerImpl.verifyChain.implementation = function(untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
            return untrustedChain;
        };
    } catch (err) {}

    try {
        var WebViewClient = Java.use("android.webkit.WebViewClient");
        WebViewClient.onReceivedSslError.implementation = function(view, handler, error) {
            handler.proceed();
        };
    } catch (err) {}
});