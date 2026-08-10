from pathlib import Path
import unicodedata
import pandas as pd


ECONOMIC_COLS = [
    "cote",
    "var_cote",
    "cote_pr_dite",
    "ench_re_moy",
    "achat",
    "achat_tour_1",
    "q2_toutes_tailles",
    "q3_toutes_tailles",
    "q2_6_joueurs",
    "q3_6_joueurs",
    "q2_8_joueurs",
    "q3_8_joueurs",
    "q2_10_joueurs",
    "q3_10_joueurs",
]


def clean_column_name(col_name):
    nfkd_form = unicodedata.normalize("NFKD", col_name)
    ascii_name = "".join([c for c in nfkd_form if not unicodedata.combining(c)])

    clean_name = ascii_name.lower()

    clean_name = "".join(c if c.isalnum() else "_" for c in clean_name)

    clean_name = "_".join([part for part in clean_name.split("_") if part])

    return clean_name


def process_data(players: pd.DataFrame) -> pd.DataFrame:
    """
    Process the player data.

    Args:
        player (pd.DataFrame): DataFrame containing player data.

    Returns:
        pd.DataFrame: Processed DataFrame.
    """
    processed_players = players.copy()

    # Cleaning column names
    processed_players.columns = [
        clean_column_name(col) for col in processed_players.columns
    ]

    # Filling missing values for economic columns with the most frequent value
    for col in ECONOMIC_COLS:
        valeur_frequente = processed_players[col].mode()
        processed_players.fillna({col: valeur_frequente}, inplace=True)

    return processed_players


def load_data() -> pd.DataFrame:
    """
    Load the player data from the CSV file.

    Returns:
        pd.DataFrame: DataFrame containing player data.
    """
    return pd.read_csv("data/players.csv", sep=";", encoding="utf-8")
