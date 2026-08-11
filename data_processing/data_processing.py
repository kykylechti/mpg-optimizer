from pathlib import Path
import unicodedata
import pandas as pd
from sklearn.preprocessing import MinMaxScaler


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
    ["prochain_opposant", "unnamed_120"],
]


def clean_column_name(col_name):
    """ """
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


def normalize_economic_columns(players: pd.DataFrame) -> None:
    """
    Normalize economic columns in the player DataFrame using Min-Max scaling.

    Args:
        players (pd.DataFrame): DataFrame containing player data.

    Returns:
        pd.DataFrame: DataFrame with normalized economic columns.
    """
    processed_players = players.copy()

    scaler = MinMaxScaler()

    processed_players[ECONOMIC_COLS] = scaler.fit_transform(processed_players[ECONOMIC_COLS])
    return processed_players


def clean_numeric_columns(df: pd.DataFrame, cols: list) -> pd.DataFrame:
    """
    Clean and convert specified economic columns to numeric float type by replacing 
    commas with dots and removing unwanted symbols like percentages.

    Args:
        df (pd.DataFrame): DataFrame containing player data.
        cols (list): List of column names to clean and convert.

    Returns:
        pd.DataFrame: DataFrame with cleaned numeric columns.
    """
    df_clean = df.copy()
    for col in cols:
        if col in df_clean.columns:
            if df_clean[col].dtype == "object":
                df_clean[col] = df_clean[col].astype(str).str.replace(",", ".")
                df_clean[col] = df_clean[col].str.replace("%", "").str.strip()
            df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce")
            
    return df_clean

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

    processed_players = pd.get_dummies(
        processed_players, columns=["poste"], prefix="poste"
    )

    processed_players = removing_useless_columns(processed_players)

    processed_players = clean_numeric_columns(processed_players, ECONOMIC_COLS)
    processed_players = normalize_economic_columns(processed_players)

    return processed_players


def load_data() -> pd.DataFrame:
    """
    Load the player data from the CSV file.

    Returns:
        pd.DataFrame: DataFrame containing player data.
    """
    return pd.read_csv("data/players.csv", sep=";", encoding="utf-8")
