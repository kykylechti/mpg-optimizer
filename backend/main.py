from data_processing.data_processing import process_data, load_data
from compute.infer import infer_data


players = load_data()
print(infer_data(players))
