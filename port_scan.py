import requests

def check_port():
    url = "http://2130706433"  # 해당 IP 주소를 사용한 URL
    endpoint = "/talk/decoration/link_preview"  # API 경로
    full_url = f"{url}{endpoint}"
    
    headers = {
        "Authorization": "4b830ba203dc4bee94f51d2be08cdb5b00000017300818181620011pEhN_ogz6E-2ef93c760ab457b73b88ca4d45771806cadc6844b65bff1165063e4813ed1c94",
        "Talk-Agent": "android/11.1.2",
        "Talk-Language": "ko",
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "okhttp/4.12.0",
        "Accept-Encoding": "gzip, deflate, br",
    }

    data = {
        "url": url
    }

    try:
        response = requests.post(full_url, headers=headers, json=data)
        if response.status_code == 200:
            print("Port is open and accessible.")
        else:
            print(f"Received status code: {response.status_code}. Port might be blocked or closed.")
    except requests.exceptions.RequestException as e:
        print(f"Error occurred: {e}. The port might be closed or the server unreachable.")

if __name__ == "__main__":
    check_port()
