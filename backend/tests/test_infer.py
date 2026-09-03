import pytest
import pandas as pd
from compute.infer import (
    infer_data,
    constraint_optimization_inference,
)  # Adapte l'import


@pytest.fixture
def dummy_players():
    """
    Generates a dummy dataset of 15 players for testing the algorithm.
    It contains 2 Goalkeepers, 5 Defenders, 5 Midfielders and 3 Strikers.
    """
    data = {
        "joueur": [f"Player_{i}" for i in range(15)],
        "note": [
            5.0,
            6.0,
            4.0,
            5.5,
            6.5,
            7.0,
            5.0,
            4.5,
            6.0,
            5.0,
            8.0,
            7.0,
            5.5,
            6.0,
            9.0,
        ],
        "cote": [10, 15, 20, 25, 30, 35, 40, 15, 20, 25, 30, 45, 50, 55, 60],
        "poste_G": [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "poste_D": [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        "poste_M": [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        "poste_A": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    }
    return pd.DataFrame(data)


def test_infer_data_returns_correct_size(dummy_players):
    """
    Checks the number of players returned.
    """
    team_size = 11
    result = infer_data(dummy_players, team_size=team_size)

    assert len(result) == team_size
    assert isinstance(result, pd.DataFrame)


def test_constraint_optimization_respects_budget_and_tactics(dummy_players):
    """
    Checks that the mathematical optimizer respects ALL MPG constraints.
    """
    budget = 400
    result = constraint_optimization_inference(dummy_players, budget=budget)

    assert len(result) == 11

    assert result["cote"].sum() <= budget

    assert result["poste_G"].sum() == 1
    assert 3 <= result["poste_D"].sum() <= 5
    assert 3 <= result["poste_M"].sum() <= 5
    assert 1 <= result["poste_A"].sum() <= 3


def test_constraint_optimization_impossible_budget(dummy_players):
    """
    Optional : Checks the behavior if the budget is too low to buy 11 players.
    """
    result = constraint_optimization_inference(dummy_players, budget=10)

    assert len(result) == 0
