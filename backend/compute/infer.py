import pandas as pd
import numpy as np

MONEY_AMOUNT = 500


def infer_data(players: pd.DataFrame, team_size=11):
    """
    Infer randomly a list of players

    Returns:
        pd.DataFrame: DataFrame containing random players.
    """

    return players.sample(n=team_size)
