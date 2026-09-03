from data_processing.data_processing import load_data, process_data
from compute.infer import constraint_optimization_inference


players = load_data()
players = process_data(players)
print(constraint_optimization_inference(players))
