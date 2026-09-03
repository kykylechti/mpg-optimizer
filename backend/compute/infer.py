import pandas as pd
import pulp

MONEY_AMOUNT = 500


def infer_data(players: pd.DataFrame, team_size=11):
    """
    Infer randomly a list of players

    Returns:
        pd.DataFrame: DataFrame containing random players.
    """

    return players.sample(n=team_size)


def constraint_optimization_inference(players: pd.DataFrame, budget: int = 500):
    """
    Modelling the inference as a constraint optimization problem using ROI

    Returns:
        pd.DataFrame: DataFrame containing selected players.
    """

    prob = pulp.LpProblem("MPG_Dream_Team", pulp.LpMaximize)

    player_vars = {
        i: pulp.LpVariable(f"player_{i}", cat="Binary") for i in players.index
    }

    prob += pulp.lpSum([players.loc[i, "note"] * player_vars[i] for i in players.index])

    prob += (
        pulp.lpSum([players.loc[i, "cote"] * player_vars[i] for i in players.index])
        <= budget
    )

    prob += pulp.lpSum([player_vars[i] for i in players.index]) == 11

    if "poste_G" in players.columns:
        prob += (
            pulp.lpSum(
                [players.loc[i, "poste_G"] * player_vars[i] for i in players.index]
            )
            == 1
        )

        prob += (
            pulp.lpSum(
                [players.loc[i, "poste_D"] * player_vars[i] for i in players.index]
            )
            >= 3
        )
        prob += (
            pulp.lpSum(
                [players.loc[i, "poste_D"] * player_vars[i] for i in players.index]
            )
            <= 5
        )

        prob += (
            pulp.lpSum(
                [players.loc[i, "poste_M"] * player_vars[i] for i in players.index]
            )
            >= 3
        )
        prob += (
            pulp.lpSum(
                [players.loc[i, "poste_M"] * player_vars[i] for i in players.index]
            )
            <= 5
        )

        prob += (
            pulp.lpSum(
                [players.loc[i, "poste_A"] * player_vars[i] for i in players.index]
            )
            >= 1
        )
        prob += (
            pulp.lpSum(
                [players.loc[i, "poste_A"] * player_vars[i] for i in players.index]
            )
            <= 3
        )

    status = prob.solve(pulp.PULP_CBC_CMD(msg=False))

    if pulp.LpStatus[status] != "Optimal":
        return pd.DataFrame(columns=players.columns)

    selected_indices = [i for i in players.index if player_vars[i].varValue == 1.0]

    return players.loc[selected_indices]
