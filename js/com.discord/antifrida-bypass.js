/*
Some app detect root/frida/lsposed/ etc but in callback shows "something is detected" by a dialog box instead of direct crashing
In this code we try to make those dialogbox cancelable so just touch outside those dialog box to remove them
and continue usual pentesting.
But remember if app have analytics/threatwatch telemetry, they still can see on server that application 
is being running in insecure environment.
*/
Java.performNow(function() {
    try {
        let AlertDialog = Java.use("android.app.AlertDialog");
        AlertDialog.show.implementation = function() {
            console.warn("Hooked AlertDialog.show()");
            //stacktrace()
            this.show();
            this.setCancelable(true);
            this.setCanceledOnTouchOutside(true);
        }
    } catch (error) {
        console.error("Error :", error);
    }
})

function stacktrace() {
    Java.perform(function() {
        let AndroidLog = Java.use("android.util.Log");
        let ExceptionClass = Java.use("java.lang.Exception");
        console.warn(AndroidLog.getStackTraceString(ExceptionClass.$new()));
    });
}


try {
    var p_pthread_create = Module.findExportByName("libc.so", "pthread_create");
    var pthread_create = new NativeFunction(p_pthread_create, "int", ["pointer", "pointer", "pointer", "pointer"]);
    Interceptor.replace(p_pthread_create, new NativeCallback(function(ptr0, ptr1, ptr2, ptr3) {
        if (ptr1.isNull() && ptr3.isNull()) {
            console.log("Possible thread creation for checking. Disabling it");
            return -1;
        } else {
            return pthread_create(ptr0, ptr1, ptr2, ptr3);
        }
    }, "int", ["pointer", "pointer", "pointer", "pointer"]));
} catch (error) {
    console.log("Error", error)
}

Java.perform(function() {	
	var strncmpPtr = Module.findExportByName(null, "strncmp");
	// var strncmp = new NativeFunction(strncmpPtr, 'int', ['pointer', 'pointer', 'int']);
	// var newstr = Memory.allocUtf8String("Koo00")
	/* Interceptor.replace(strncmp, new NativeCallback(function(str1, str2, size) {
		// console.warn("[*] strncmp() called !")
		var target = Memory.readUtf8String(str2)
		if(target.indexOf("TracerPid") !== -1) {
			// console.warn("[!] Debug Detection Pattern Found !")
			// str2 = newstr;
			console.log('[*] str1 : ' + str1.readUtf8String());
			console.log('[*] str2 : ' + str2.readUtf8String());
			console.log('[*] size : ' + size);
			Thread.sleep(1);
			var retval = strncmp(str1, str2, size);
			console.log('[*] retval : ' + retval);
			return retval;
		}
		var retval = strncmp(str1, str2, size);
		return retval;
	}, 'int', ['pointer', 'pointer', 'int'])) */
	
	
	Interceptor.attach(Module.findExportByName(null, "strncmp"), {
		onEnter: function(args) {
			// console.warn("[*] strncmp() called !")
			var target = args[0].readUtf8String()
			
			// console.log("\t[+] strncmp : " + target.toString())
			if(target.toString().indexOf("TracerPid") !== -1) {
				// console.warn("[!] Debug Detection Pattern Found !")
				console.log("\t[+] strncmp : " + target)
				// console.log('[*] str1 : ' + args[0].readUtf8String());
				// console.log('[*] str2 : ' + args[1].readUtf8String());
				// console.log('[*] size : ' + size);
				// args[1] = Memory.allocUtf8String("Koooo")
				// console.log("\t\t[+] new strncmp : " + Memory.readUtf8String(args[1]))
			}
		},
		onLeave: function(retval) {
		}
	})
})

Java.perform(function() {
    var androidSettings = ['adb_enabled'];
    var sdkVersion = Java.use('android.os.Build$VERSION');
    console.log("SDK Version : " + sdkVersion.SDK_INT.value);

    if (sdkVersion.SDK_INT.value <= 16) {
        var settingSecure = Java.use('android.provider.Settings$Secure');
        
        settingSecure.getInt.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                console.log('[+]Secure.getInt(cr, name) Bypassed');
                return 0;
            }
            var ret = this.getInt(cr, name);
            return ret;
        }

        settingSecure.getInt.overload('android.content.ContentResolver', 'java.lang.String', 'int').implementation = function(cr, name, def) {
            if (name == (androidSettings[0])) {
                console.log('[+]Secure.getInt(cr, name, def) Bypassed');
                return 0;
            }
            var ret = this.getInt(cr, name, def);
            return ret;
        }

        settingSecure.getFloat.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                console.log('[+]Secure.getFloat(cr, name) Bypassed');
                return 0;
            }
            var ret = this.getFloat(cr, name)
            return ret;
        }

        settingSecure.getFloat.overload('android.content.ContentResolver', 'java.lang.String', 'float').implementation = function(cr, name, def) {
            if (name == androidSettings[0]) {
                console.log('[+]Secure.getFloat(cr, name, def) Bypassed');
                return 0;
            }
            var ret = this.getFloat(cr, name, def);
            return ret;
        }

        settingSecure.getLong.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                console.log('[+]Secure.getLong(cr, name) Bypassed');
                return 0;
            }
            var ret = this.getLong(cr, name)
            return ret;
        }

        settingSecure.getLong.overload('android.content.ContentResolver', 'java.lang.String', 'long').implementation = function(cr, name, def) {
            if (name == androidSettings[0]) {
                console.log('[+]Secure.getLong(cr, name, def) Bypassed');
                return 0;
            }
            var ret = this.getLong(cr, name, def);
            return ret;
        }

        settingSecure.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                var stringClass = Java.use("java.lang.String");
                var stringInstance = stringClass.$new("0");

                console.log('[+]Secure.getString(cr, name) Bypassed');
                return stringInstance;
            }
            var ret = this.getString(cr, name);
            return ret;
        }
    }

    /* API17이상 Settings.Global Hook */
    if (sdkVersion.SDK_INT.value >= 17) {
        var settingGlobal = Java.use('android.provider.Settings$Global');

        settingGlobal.getInt.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                console.log('[+]Global.getInt(cr, name) Bypassed');
                return 0;
            }
            var ret = this.getInt(cr, name);
            return ret;
        }

        settingGlobal.getInt.overload('android.content.ContentResolver', 'java.lang.String', 'int').implementation = function(cr, name, def) {
            if (name == (androidSettings[0])) {
                console.log('[+]Global.getInt(cr, name, def) Bypassed');
                return 0;
            }
            var ret = this.getInt(cr, name, def);
            return ret;
        }

        settingGlobal.getFloat.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                console.log('[+]Global.getFloat(cr, name) Bypassed');
                return 0;
            }
            var ret = this.getFloat(cr, name);
            return ret;
        }

        settingGlobal.getFloat.overload('android.content.ContentResolver', 'java.lang.String', 'float').implementation = function(cr, name, def) {
            if (name == androidSettings[0]) {
                console.log('[+]Global.getFloat(cr, name, def) Bypassed');
                return 0;
            }
            var ret = this.getFloat(cr, name, def);
            return ret;
        }

        settingGlobal.getLong.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                console.log('[+]Global.getLong(cr, name) Bypassed');
                return 0;
            }
            var ret = this.getLong(cr, name)
            return ret;
        }

        settingGlobal.getLong.overload('android.content.ContentResolver', 'java.lang.String', 'long').implementation = function(cr, name, def) {
            if (name == androidSettings[0]) {
                console.log('[+]Global.getLong(cr, name, def) Bypassed');
                return 0;
            }
            var ret = this.getLong(cr, name, def);
            return ret;
        }
        
        settingGlobal.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(cr, name) {
            if (name == androidSettings[0]) {
                var stringClass = Java.use("java.lang.String");
                var stringInstance = stringClass.$new("0");

                console.log('[+]Global.getString(cr, name) Bypassed');
                return stringInstance;
            }
            var ret = this.getString(cr, name);
            return ret;
        }
    }
});