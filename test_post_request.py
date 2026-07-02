import requests

url = "http://127.0.0.1:5000/api/v1/scan-thorax"
image_path = "src/assets/hero.png"

try:
    with open(image_path, 'rb') as img:
        files = {'image': img}
        data = {'id_pasien': 'TEST_123'}
        response = requests.post(url, files=files, data=data)
        
    print("Status code:", response.status_code)
    print("Response JSON:")
    print(response.json())
except Exception as e:
    print("Error during request:", e)
