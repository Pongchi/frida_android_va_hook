import frida, sys, subprocess, socket, time, json, os

# 앱 이름 설정
app_name = 'com.kakao.talk'

# Frida 후킹을 위한 스크립트 로드 함수
def load_js_scripts(app_name):
    hook_script = ''

    # JavaScript 후킹 스크립트를 외부 파일로 분리하여 로드
    base_js_path = f"./js/{app_name}"

    # 기본 config.js와 bypass_ssl_pinning.js 로드
    with open(f"./js/config.js", "r", encoding='utf-8') as f:
        hook_script += f.read()

    with open(f"./js/bypass_ssl_pinning.js", "r", encoding='utf-8') as f:
        hook_script += f.read()

    # app_name 폴더에서 모든 js 파일을 읽어서 후킹 스크립트에 추가
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
        # Nox에 연결
        subprocess.run(['adb', 'connect', 'localhost:62001'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1)

        # Frida 서버 실행
        subprocess.run(['adb', 'shell', 'nohup', '/data/local/tmp/frida-server', '> /dev/null 2>&1 &'],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print('[@] Frida 서버가 실행되었습니다.')
    except Exception as e:
        print(f"[@] Frida 서버 실행 중 에러 발생: {e}")

# 호스트 머신의 IP 주소를 가져오는 함수
def get_host_ip():
    try:
        # socket 라이브러리로 호스트 IP 주소를 가져옴
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        s.connect(('8.8.8.8', 1))  # 구글 DNS 서버에 연결하여 IP 추출
        ip = s.getsockname()[0]
        return ip
    except Exception as e:
        print(f"[@] 호스트 IP를 가져오는 중 에러 발생: {e}")
        return None

# ADB를 통해 Wi-Fi 프록시 설정하기
def set_proxy(ip, port=8080):
    try:
        # Wi-Fi 프록시 설정 명령어 실행
        subprocess.run(['adb', 'shell', 'settings', 'put', 'global', 'http_proxy', f'{ip}:{port}'])
        print(f'[@] 프록시가 {ip}:{port}로 설정되었습니다.')
    except Exception as e:
        print(f"프록시 설정 중 오류 발생: {e}")

    ## Burp Suite Init
    with open('burp_project_settings.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    data['proxy']['request_listeners'][1]['listen_specific_address'] = ip
    data['proxy']['request_listeners'][1]['listener_port'] = port

    with open('burp_project_settings.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

# Frida 후킹 실행
def main():
    try:
        device = frida.get_usb_device()  # USB로 연결된 장치에 연결
        pid = device.spawn([app_name])  # 앱 패키지명
        session = device.attach(pid)  # 프로세스에 연결
        
        # 앱 이름을 기반으로 후킹 스크립트 로드
        hook_script = load_js_scripts(app_name)
        script = session.create_script(hook_script)  # 후킹 스크립트 생성
        script.on("message", on_message)  # 메시지 처리 핸들러 설정
        script.load()  # 스크립트 로드
        
        device.resume(pid)  # 앱 실행 재개
        sys.stdin.read()  # 스크립트 유지
    except frida.ProcessNotFoundError:
        print(f"프로세스를 찾을 수 없습니다. {app_name} 앱이 실행 중인지 확인하세요.")
    except Exception as e:
        print(f"후킹 Script 오류 발생: {e}")

if __name__ == '__main__':
    start_frida_server()
    
    host_ip = get_host_ip()
    if host_ip:
        set_proxy(host_ip)

    main()
