import uvicorn
import json
import requests
from cb_recommendation import cb
from cf_recommendation import cf
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI()
cb_data = None
cf_data = None


def init():
    print("-----init-----")
    # init cb
    print("\n.....cb.....")
    global cb_data
    cb_response = requests.get("http://localhost:8080/api/v1/product/simple")
    cb_raw_data = cb_response.content.decode("utf-8")
    cb_data = cb(cb_raw_data)
    # init cf
    print("\n.....cf.....")
    global cf_data
    cf_response = requests.get("http://localhost:8080/api/v1/product/review/simple")
    cf_raw_data = cf_response.content.decode("utf-8")
    cf_data = cf(cf_raw_data)
    print("\n-----done-----\n")


@app.get("/api/v1/recommend", response_class=PlainTextResponse)
async def recommend(product_id: int, user_id: int = -1):
    print("product id: ", product_id, "user id:", user_id)
    n = 4
    rs = []
    if user_id != -1:
        print("cf:")
        rs += cf_data.recommend(user_id, 0, n)
    print("cb:")
    rs += cb_data.recommend(product_id, 0, n)
    rs = dict.fromkeys(rs)
    if rs.__contains__(product_id):
        rs.pop(product_id)
    rs = list(rs)[:n]
    print("recommend product: ", rs)
    print("-----------------")
    return json.dumps(rs)


@app.get("/api/v1/cb-recommend", response_class=PlainTextResponse)
async def cb_recommend(product_id: int):
    n = 4
    return json.dumps(cb_data.recommend(product_id, 0, n))


@app.get("/api/v1/update-data")
async def updateData():
    init()


if __name__ == "__main__":
    init()
    uvicorn.run(app, host="0.0.0.0", port=8000)
