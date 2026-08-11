from pathlib import Path
import unicodedata
import pandas as pd


ECONOMIC_COLS = [
    "cote",
    "var_cote",
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

COLS_TO_DROP = [
    ["cleansheet", "corner_gagn"],
    ["ballons", "balle_non_rattrap_e"],
    ["cote_pr_dite", "cote_pr_dite"],
    ["but", "titu_s_rie"],
    ["note", "note_s_rie"],
    ["note_m11", "nb_match_s_rie"],
    ["temps", "temps_s_rie"],
    ["tps_moy", "tps_moy_s_rie"],
    ["min_but", "min_but"],
    ["prix_but", "prix_but"],
    ["prochain_opposant", "unnamed_120"]
]


def clean_column_name(col_name):
    """
    """
    nfkd_form = unicodedata.normalize("NFKD", col_name)
    ascii_name = "".join([c for c in nfkd_form if not unicodedata.combining(c)])

    clean_name = ascii_name.lower()

    clean_name = "".join(c if c.isalnum() else "_" for c in clean_name)

    clean_name = "_".join([part for part in clean_name.split("_") if part])

    return clean_name

def removing_useless_columns(players: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and normalize a column name by removing accents, converting to lowercase, 
    and replacing special characters with underscores.

    Args:
        col_name (str): Original column name.

    Returns:
        str: Cleaned and normalized column name in snake_case.
    """
    clean_players = players.copy()

    for start_col, end_col in COLS_TO_DROP:
        if start_col in clean_players.columns and end_col in clean_players.columns:
            start_idx = clean_players.columns.get_loc(start_col)
            end_idx = clean_players.columns.get_loc(end_col)

            cols_to_drop = clean_players.columns[start_idx : end_idx + 1]

            clean_players = clean_players.drop(columns=cols_to_drop)

    return clean_players


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

    # Filling missing values for economic columns with the most frequent value at the same position
    for col in ECONOMIC_COLS:
        if col in processed_players.columns:
            mode_par_poste = processed_players.groupby("poste")[col].transform(
                lambda x: x.mode()[0] if not x.mode().empty else None
            )

            processed_players[col] = processed_players[col].fillna(mode_par_poste)

    processed_players = pd.get_dummies(processed_players, columns=["poste"], prefix="poste")

    processed_players = removing_useless_columns(processed_players)

    return processed_players


def load_data() -> pd.DataFrame:
    """
    Load the player data from the CSV file.

    Returns:
        pd.DataFrame: DataFrame containing player data.
    """
    return pd.read_csv("data/players.csv", sep=";", encoding="utf-8")
