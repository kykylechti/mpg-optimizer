from data_processing.data_processing import load_data, process_data


df_players = load_data()
processed_df_players = process_data(df_players)

print(processed_df_players)
