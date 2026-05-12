# import sys
# import traceback
# sys.path.append('D:\\FYP_Backend')
# try:
#     from Routes import app
#     with app.test_client() as client:
#         response = client.get('/getProvinces')
#         print("Status:", response.status_code)
#         print("Data:", response.data.decode('utf-8'))
# except Exception as e:
#     traceback.print_exc()
