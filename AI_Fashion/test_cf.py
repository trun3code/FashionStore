import pandas as pd

# test: product count, current user id, threshold
num = 3
user_id = 1
threshold = 0.1
# dataframe
df_reviews = pd.read_csv("./dataset/reviews.csv")
# matrix
df_users_items = df_reviews.pivot_table(index=["id"], columns="product id", values="rating")
print(df_users_items)
# matrix normalization
df_ui_norm = df_users_items.subtract(df_users_items.mean(axis=1), axis="rows")
print(df_ui_norm)
# similarity matrix using pearson correlation
sim_user_matrix = df_ui_norm.T.corr(method="pearson")
print(sim_user_matrix)


# delete current user id in matrix
sim_user_matrix.drop(index=user_id, inplace=True)
# get similar user
sim_user_rs = sim_user_matrix[sim_user_matrix[user_id] >= threshold][user_id].sort_values(ascending=False)[:num]
print(sim_user_rs)
# delete buyed item
picked_userid_watched = df_ui_norm[df_ui_norm.index == user_id].dropna(axis=1, how="all")
print(picked_userid_watched)
similar_user_items = df_ui_norm[df_ui_norm.index.isin(sim_user_rs.index)].dropna(axis=1, how="all")
similar_user_items.drop(picked_userid_watched.columns, axis=1, inplace=True, errors="ignore")
print("\n",list(similar_user_items.columns))
