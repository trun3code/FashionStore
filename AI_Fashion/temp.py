import pandas as pd
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer

# df : data frame
df_products = pd.read_csv("./dataset/fashion_products.csv")
tfidf = TfidfVectorizer(stop_words="english")
sim_data = (
    df_products["Product Name"]
    + " "
    + df_products["Brand"]
    + " "
    + df_products["Category"]
)
tfidf_matrix = tfidf.fit_transform(sim_data)
cosine_sim = linear_kernel(tfidf_matrix)
#
print(sim_data[0])
sim_scores = cosine_sim[0]
cnt = 0
for index, score in enumerate(sim_scores):
    if score >= 0.9:
        cnt += 1
        print(df_products.loc[[index]],score)
print(cnt)
