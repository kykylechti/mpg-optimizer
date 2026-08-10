from pathlib import Path
import pandas as pd


def process_data(player: pd.DataFrame) -> pd.DataFrame:
    """
    Process the player data.

    Args:
        player (pd.DataFrame): DataFrame containing player data.

    Returns:
        pd.DataFrame: Processed DataFrame.
    """
    ...

def load_data() -> pd.DataFrame:
    """
    Load the player data from the CSV file.

    Returns:
        pd.DataFrame: DataFrame containing player data.
    """
    current_file = Path(__file__)
    file_path = current_file.parent.parent / "data" / "players.csv"

    return pd.read_csv(file_path, sep=";", encoding="latin1")