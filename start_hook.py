import frida
import sys
import subprocess
import socket
import time
import json
import os

# 후킹 대상 앱 목록
targets = [
    ['org.thoughtcrime.securesms', 'Signal'],  # 0
    ['org.telegram.messenger', '텔레그램'],    # 1
    ['com.kakao.talk', '카카오톡'],            # 2
    ['com.discord', 'Discord'],               # 3
]

target_index = 2  # 카카오톡 후킹
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
        with open(f"./js/antidebug.js", "r", encoding='utf-8') as f:
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
        result = subprocess.run(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
            text=True, encoding='utf-8'
        )
        if check and result.returncode != 0:
            print(f"[@] 명령 실패: {' '.join(command)}\n{result.stderr}")
        return result
    except Exception as e:
        print(f"[@] 명령 실행 중 오류 발생: {e}")

def launch_nox():
    """Nox 에뮬레이터 실행."""
    try:
        print("[@] Nox 에뮬레이터를 실행합니다.")
        nox_path = r"C:\Program Files (x86)\Nox\bin\Nox.exe"
        os.startfile(nox_path)
    except Exception as e:
        print(f"[!] Nox 실행 중 오류 발생: {e}")

def is_nox_ready():
    """Nox가 완전히 로드되었는지 확인."""
    while True:
        try:
            result = subprocess.run(['adb', 'devices'], stdout=subprocess.PIPE, text=True)
            if 'emulator' in result.stdout or '127.0.0.1' in result.stdout:
                print("[@] Nox 에뮬레이터가 준비되었습니다.")
                return True
            else:
                time.sleep(5)
        except subprocess.CalledProcessError as e:
            print(f"[!] ADB 명령어 오류 발생: {e}")
            time.sleep(5)

def reset_adb():
    """ADB 설정 초기화."""
    print("[@] ADB 설정 초기화 중...")
    run_command(['adb', 'shell', 'settings', 'delete', 'global', 'http_proxy'])
    run_command(['adb', 'shell', 'settings', 'delete', 'global', 'https_proxy'])
    run_command(['adb', 'kill-server'])
    run_command(['adb', 'start-server'])
    print("[@] ADB 설정 초기화 완료.")

def start_frida_server():
    """Frida 서버 시작."""
    run_command(['adb', 'connect', 'localhost:5037'], check=True)
    time.sleep(1)
    run_command(['adb', 'shell', 'nohup /data/local/tmp/frida-server > /dev/null 2>&1 &'], check=True)
    print('[@] Frida 서버가 실행되었습니다.')

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
            time.sleep(1)
            session = attach_to_process() or spawn_and_hook()

def is_adb_alive():
    """ADB 연결 상태 확인."""
    result = run_command(['adb', 'get-state'])
    return result.stdout.strip() == 'device'

def attach_to_process():
    """이미 실행 중인 프로세스에 후킹."""
    try:
        device = frida.get_usb_device(timeout=5)
        processes = device.enumerate_processes()
        pid = next((p.pid for p in processes if process_name.lower() in p.name.lower()), None)

        if pid is None:
            print(f"[@] {process_name} 프로세스를 찾을 수 없습니다.")
            return None

        session = device.attach(pid)
        print(f"[@] {process_name}에 성공적으로 attach됨 (PID: {pid}).")

        hook_script = load_js_scripts(app_name)
        if hook_script:
            script = session.create_script(hook_script)
            script.on("message", on_message)
            script.load()
            return session
        else:
            print("[!] 후킹할 스크립트가 없습니다.")
            return None

    except Exception as e:
        print(f"[@] 후킹 중 오류 발생: {e}")
        return None

def reconnect_adb():
    """ADB 재연결."""
    run_command(['adb', 'disconnect'], check=True)
    time.sleep(1)
    run_command(['adb', 'connect', 'localhost:5037'], check=True)
    print('[@] ADB 재연결 완료.')

def main():
    """메인 함수."""
    launch_nox()

    if not is_nox_ready():
        print("[!] Nox가 준비되지 않았습니다. 종료합니다.")
        return

    reset_adb()
    start_frida_server()

    session = spawn_and_hook()
    if session:
        print("[@] 후킹이 성공적으로 시작되었습니다.")
        health_check(session)
    else:
        print("[!] 후킹 세션을 시작할 수 없습니다.")

if __name__ == '__main__':
    main()
