import requests


STATS_URL = "https://backend.mpgstats.fr/players/stats/1.json"
TRENDS_URL = "https://backend.mpgstats.fr/players/trends/1.json"
HISTORY_URL = "https://backend.mpgstats.fr/league/history/1.json"


def get_stats():
    try:
        response = requests.get(STATS_URL)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Erros during request : {e}")
        return None


def get_trends():
    try:
        response = requests.get(TRENDS_URL)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Erros during request : {e}")
        return None


def get_history():
    try:
        response = requests.get(HISTORY_URL)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Erros during request : {e}")
        return None


if __name__ == "__main__":
    stats = get_stats()
    trends = get_trends()
    history = get_history()

    print("Stats:", stats)
    print("Trends:", trends)
    print("History:", history)
