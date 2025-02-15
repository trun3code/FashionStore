import io
import json
import pandas as pd
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer


class cb:
    def __init__(self, raw_data):
        data_set = io.StringIO(raw_data)
        self.prepare_dataset(data_set)
        self.products_index = {}
        self.products_id = {}
        for i, p in enumerate(json.loads(raw_data)):
            self.products_index[p["id"]] = i
            self.products_id[i] = p["id"]

    def prepare_dataset(self, data_set):
        # convert data set to data frame
        df_products = pd.read_json(data_set)
        print("data:")
        print(df_products.head())
        # data contains 2 col: name + category
        sim_data = df_products["productName"] + " " + df_products["category"]
        tfidf = TfidfVectorizer()
        tfidf_matrix = tfidf.fit_transform(sim_data)
        self.cosine_sim = linear_kernel(tfidf_matrix)
        print("cosine sim:")
        print(self.cosine_sim)

    def recommend(self, product_id, threshold, n) -> list:
        rs = []
        if n <= 0 or not self.products_index.__contains__(product_id):
            return rs
        sim_score = self.cosine_sim[self.products_index[product_id]].tolist()
        sim_score_index = []
        for i, s in enumerate(sim_score):
            sim_score_index.append((self.products_id[i], s))
        sim_score_index.pop(self.products_index[product_id])
        rs_score = sorted(sim_score_index, reverse=True, key=lambda tup: tup[1])[:n]
        print("score:")
        print(rs_score)
        for s in rs_score:
            if s[1] > threshold:
                rs.append(s[0])
        print("result: ",rs)
        return rs