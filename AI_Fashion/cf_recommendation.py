import io
import json
import pandas as pd


class cf:
    def __init__(self, raw_data):
        data_set = io.StringIO(raw_data)
        self.prepare_dataset(data_set)

    def prepare_dataset(self, data_set):
        # convert data set to data frame
        df_reviews = pd.read_json(data_set)
        print("data:")
        print(df_reviews.head())
        # create users-items matrix
        df_users_items = df_reviews.pivot_table(
            index=["userId"], columns="productId", values="rating"
        )
        print("user-item matrix:")
        print(df_users_items)
        # u-i matrix normalization
        self.df_ui_norm = df_users_items.subtract(
            df_users_items.mean(axis=1), axis="rows"
        )
        print("user-item matrix normalization:")
        print(self.df_ui_norm)
        # similarity matrix using pearson correlation
        self.sim_user_matrix = self.df_ui_norm.T.corr(method="pearson")
        print("sim_user matrix")
        print(self.sim_user_matrix)

    def recommend(self,user_id, threshold, n):
        sim_user_rs = self.sim_user_matrix[self.sim_user_matrix[user_id] >= threshold][
            user_id
        ].sort_values(
            ascending=False
        )  # [:n]
        print(sim_user_rs)
        # delete buyed item
        picked_userid_watched = self.df_ui_norm[
            self.df_ui_norm.index == user_id
        ].dropna(axis=1, how="all")
        print(picked_userid_watched)
        similar_user_items = self.df_ui_norm[
            self.df_ui_norm.index.isin(sim_user_rs.index)
        ].dropna(axis=1, how="all")
        similar_user_items.drop(
            picked_userid_watched.columns, axis=1, inplace=True, errors="ignore"
        )
        rs = list(similar_user_items.columns)
        print("result: ",rs)
        return rs
