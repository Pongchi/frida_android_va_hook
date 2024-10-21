import frida
import sys
import subprocess
import socket
import time
import json
import os

# 후킹 대상 앱 목록
targets = [
    ['org.thoughtcrime.securesms', 'Signal'], 
    ['org.telegram.messenger', '텔레그램'], 
    ['com.kakao.talk', '카카오톡'],  
    ['com.discord', 'Discord'],  
]

# 후킹 대상 인덱스 선택
target_index = 2
app_name, process_name = targets[target_index]

def load_js_scripts(app_name):
    """후킹에 사용할 JS 스크립트 로드."""
    hook_script = ''
    base_js_path = f"./js/{app_name}"

    
    try:
        with open(f"./js/config.js", "r", encoding='utf-8') as f:
            hook_script += f.read() + '\n'
        with open(f"./js/bypass_ssl_pinning.js", "r", encoding='utf-8') as f:
            hook_script += f.read() + '\n'

        if os.path.exists(base_js_path):
            for filename in os.listdir(base_js_path):
                if filename.endswith(".js"):
                    with open(os.path.join(base_js_path, filename), "r", encoding='utf-8') as f:
                        hook_script += f.read() + '\n'
    except FileNotFoundError as e:
        print(f"[@] 파일을 찾을 수 없습니다: {e}")
    except Exception as e:
        print(f"[@] 스크립트 로드 중 오류 발생: {e}")

    return hook_script

def on_message(message, data):
    """후킹된 메시지 처리."""
    if message['type'] == 'send':
        print(f"[*] {message['payload']}")
    else:
        print(f"[!] {message}")

def run_command(command, check=False):
    """서브프로세스로 명령 실행 및 오류 처리."""
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if check and result.returncode != 0:
            print(f"[@] 명령 실패: {' '.join(command)}\n{result.stderr}")
        return result
    except Exception as e:
        print(f"[@] 명령 실행 중 오류 발생: {e}")

def start_frida_server():
    """Frida 서버 시작."""
    run_command(['adb', 'connect', 'localhost:62001'], check=True)
    time.sleep(1)
    run_command(['adb', 'shell', 'su -c "/data/local/tmp/frida-server &"'], check=True)
    print('[@] Frida 서버가 실행되었습니다.')

def get_host_ip():
    """호스트 IP 주소 가져오기."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(('8.8.8.8', 1))
            ip = s.getsockname()[0]
            return ip
    except Exception as e:
        print(f"[@] 호스트 IP를 가져오는 중 에러 발생: {e}")
        return None

def set_proxy(ip, port=8080):
    """ADB를 통해 프록시 설정."""
    try:
        run_command(['adb', 'shell', 'settings', 'put', 'global', 'http_proxy', f'{ip}:{port}'], check=True)
        print(f'[@] 프록시가 {ip}:{port}로 설정되었습니다.')

        with open('burp_project_settings.json', 'r', encoding='utf-8') as file:
            data = json.load(file)

        data['proxy']['request_listeners'][1].update({
            'listen_specific_address': ip,
            'listener_port': port
        })

        with open('burp_project_settings.json', 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4, ensure_ascii=False)

    except FileNotFoundError as e:
        print(f"[@] 설정 파일을 찾을 수 없습니다: {e}")
    except json.JSONDecodeError as e:
        print(f"[@] JSON 디코딩 오류: {e}")
    except Exception as e:
        print(f"[@] 프록시 설정 중 오류 발생: {e}")

def reconnect_adb():
    """ADB 재연결."""
    run_command(['adb', 'disconnect'], check=True)
    time.sleep(1)
    run_command(['adb', 'connect', 'localhost:62001'], check=True)
    print('[@] ADB 재연결 완료.')

def is_adb_alive():
    """ADB 연결 상태 확인."""
    result = run_command(['adb', 'get-state'])
    return result.stdout.strip() == 'device'

def attach_to_process():
    """이미 실행 중인 프로세스에 후킹."""
    try:
        device = frida.get_usb_device(timeout=5)
        pid = next((p.pid for p in device.enumerate_processes() if process_name in p.name), None)

        if pid is None:
            print(f"[@] {process_name} 프로세스를 찾을 수 없습니다.")
            return None

        print(f"[@] {process_name} 프로세스 PID: {pid}")
        session = device.attach(pid)
        script = session.create_script(load_js_scripts(app_name))
        script.on("message", on_message)
        script.load()
        return session

    except frida.ProcessNotFoundError:
        print(f"[@] 프로세스를 찾을 수 없습니다. {process_name} 앱이 실행 중인지 확인하세요.")
    except Exception as e:
        print(f"[@] 후킹 중 오류 발생: {e}")
        return None

def spawn_and_hook():
    """새 프로세스를 스폰하여 후킹."""
    try:
        device = frida.get_usb_device(timeout=5)
        pid = device.spawn([app_name])
        session = device.attach(pid)
        script = session.create_script(load_js_scripts(app_name))
        script.on("message", on_message)
        script.load()
        device.resume(pid)
        return session
    except Exception as e:
        print(f"[@] 후킹 중 오류 발생: {e}")
        return None

def health_check(session):
    """ADB 및 후킹된 세션 상태 확인."""
    while True:
        time.sleep(1)
        if not is_adb_alive():
            print("[@] ADB가 죽었습니다. 재연결 시도 중...")
            reconnect_adb()
            session = attach_to_process() or spawn_and_hook()

def main():
    """메인 함수."""
    start_frida_server()
    host_ip = get_host_ip()
    if host_ip:
        set_proxy(host_ip)
    session = spawn_and_hook()

    time.sleep(5)
    if session:
        health_check(session)

if __name__ == '__main__':
    main()
