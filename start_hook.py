import frida, sys, subprocess, socket, time, json, os

# 앱 이름 설정
app_name = 'org.telegram.messenger'  # 패키지 이름 (앱 패키지)
process_name = '텔레그램'  # 실제 프로세스 이름

# Frida 후킹을 위한 스크립트 로드 함수
def load_js_scripts(app_name):
    hook_script = ''
    base_js_path = f"./js/{app_name}"

    with open(f"./js/config.js", "r", encoding='utf-8') as f:
        hook_script += f.read()

    with open(f"./js/bypass_ssl_pinning.js", "r", encoding='utf-8') as f:
        hook_script += f.read()

    if os.path.exists(base_js_path):
        for filename in os.listdir(base_js_path):
            if filename.endswith(".js"):
                filepath = os.path.join(base_js_path, filename)
                with open(filepath, "r", encoding='utf-8') as f:
                    hook_script += f.read()

    return hook_script

# Frida 메시지 출력 핸들러
def on_message(message, data):
    if message['type'] == 'send':
        print(f"[*] {message['payload']}")
    else:
        print(message)

######################### init Frida-server #########################

def start_frida_server():
    try:
        subprocess.run(['adb', 'connect', 'localhost:62001'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1)

        subprocess.run(['adb', 'shell', 'nohup', '/data/local/tmp/frida-server', '> /dev/null 2>&1 &'],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print('[@] Frida 서버가 실행되었습니다.')
    except Exception as e:
        print(f"[@] Frida 서버 실행 중 에러 발생: {e}")

# ADB logcat을 adb.log 파일에 기록하는 함수
def start_adb_logcat():
    try:
        log_file = open('adb.log', 'w')
        subprocess.Popen(['adb', 'logcat'], stdout=log_file, stderr=subprocess.STDOUT)
        print('[@] ADB logcat 기록이 adb.log 파일에 시작되었습니다.')
    except Exception as e:
        print(f"[@] ADB logcat 실행 중 에러 발생: {e}")

# 호스트 머신의 IP 주소를 가져오는 함수
def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        s.connect(('8.8.8.8', 1))  
        ip = s.getsockname()[0]
        return ip
    except Exception as e:
        print(f"[@] 호스트 IP를 가져오는 중 에러 발생: {e}")
        return None

# ADB를 통해 Wi-Fi 프록시 설정하기
def set_proxy(ip, port=8080):
    try:
        subprocess.run(['adb', 'shell', 'settings', 'put', 'global', 'http_proxy', f'{ip}:{port}'])
        print(f'[@] 프록시가 {ip}:{port}로 설정되었습니다.')
    except Exception as e:
        print(f"프록시 설정 중 오류 발생: {e}")

    with open('burp_project_settings.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    data['proxy']['request_listeners'][1]['listen_specific_address'] = ip
    data['proxy']['request_listeners'][1]['listener_port'] = port

    with open('burp_project_settings.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

# ADB 재연결
def reconnect_adb():
    try:
        subprocess.run(['adb', 'disconnect'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(['adb', 'connect', 'localhost:62001'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print('[@] ADB 재연결 완료.')
    except Exception as e:
        print(f"[@] ADB 재연결 중 에러 발생: {e}")

# ADB 연결 상태 확인
def is_adb_alive():
    try:
        result = subprocess.run(['adb', 'shell', 'echo', 'ping'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.returncode == 0
    except Exception as e:
        print(f"[@] ADB 상태 확인 중 오류 발생: {e}")
        return False

# 이미 실행 중인 프로세스에 attach
def attach_to_process():
    try:
        device = frida.get_usb_device()  
        pid = None

        processes = device.enumerate_processes()
        for process in processes:
            if process_name in process.name:
                pid = process.pid
                print(f"[@] {process_name} 프로세스 PID: {pid} (프로세스 이름: {process.name})")
                break

        if pid is None:
            print(f"[@] {process_name} 프로세스를 찾을 수 없습니다.")
            return None

        session = device.attach(pid)

        hook_script = load_js_scripts(app_name)
        script = session.create_script(hook_script)
        script.on("message", on_message)
        script.load()

        return session
    except frida.ProcessNotFoundError:
        print(f"프로세스를 찾을 수 없습니다. {process_name} 앱이 실행 중인지 확인하세요.")
    except Exception as e:
        print(f"후킹 Script 오류 발생: {e}")
        return None

# 앱을 spawn 하여 후킹 실행
def spawn_and_hook():
    try:
        device = frida.get_usb_device()  
        pid = device.spawn([app_name])
        session = device.attach(pid)

        hook_script = load_js_scripts(app_name)
        time.sleep(2)
        script = session.create_script(hook_script)
        script.on("message", on_message)
        script.load()

        device.resume(pid)

        return session
    except frida.ProcessNotFoundError:
        print(f"프로세스를 찾을 수 없습니다. {app_name} 앱이 실행 중인지 확인하세요.")
    except Exception as e:
        print(f"후킹 Script 오류 발생: {e}")
        return None

# 메인 함수
def main():
    start_frida_server()

    host_ip = get_host_ip()
    if host_ip:
        set_proxy(host_ip)

    # adb logcat 기록 시작
    start_adb_logcat()

    session = spawn_and_hook()
    time.sleep(3)  

    if not is_adb_alive():
        print("[@] ADB가 죽었습니다. 재연결 시도 중...")
        reconnect_adb()
        time.sleep(3)

        session = attach_to_process()

    sys.stdin.read()  

if __name__ == '__main__':
    main()
