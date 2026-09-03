import pandas as pd

from data_processing.data_processing import (
    clean_column_name,
    clean_numeric_columns,
    normalize_economic_columns,
    removing_useless_columns,
)


def test_clean_column_name_removes_accents_and_special_chars():
    assert clean_column_name("Coté Prédite") == "cote_predite"
    assert clean_column_name("Note (série)") == "note_serie"


def test_clean_numeric_columns_handles_commas_and_percent():
    df = pd.DataFrame({"cote": ["1,5", "20%", "3.2"]})

    result = clean_numeric_columns(df, ["cote"])

    assert result["cote"].tolist() == [1.5, 20.0, 3.2]
    assert result["cote"].dtype.kind == "f"

def test_normalize_economic_columns_except_price():
    df = pd.DataFrame({
        "cote": [1.0, 2.0, 3.0],
        "note": [10.0, 20.0, 30.0],
        "buts": [5.0, 10.0, 15.0]
    })

    result = normalize_economic_columns(df)

    assert result["note"].min() == 0.0
    assert result["note"].max() == 1.0
    assert result["buts"].min() == 0.0
    assert result["buts"].max() == 1.0

    assert result["cote"].equals(df["cote"])
