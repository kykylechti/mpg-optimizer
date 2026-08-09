import pandas as pd


df_players = pd.read_csv("data/players.csv", sep=";", encoding="latin1")

print(df_players)
