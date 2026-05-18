def test_random_cards_count(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion", "count": 10})
    assert res.status_code == 200
    data = res.json()
    assert len(data["cards"]) == 10


def test_random_cards_no_duplicates(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion,Intrigue,Seaside", "count": 10})
    data = res.json()
    ids = [c["id"] for c in data["cards"]]
    assert len(ids) == len(set(ids))


def test_random_cards_kingdom_only(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion,Dark Ages", "count": 10})
    data = res.json()
    for card in data["cards"]:
        assert card["is_kingdom_card"] is True


def test_random_cards_from_selected_expansions(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion,Intrigue", "count": 5})
    data = res.json()
    for card in data["cards"]:
        assert card["set_name"] in ("Dominion", "Intrigue")


def test_random_cards_active_expansions(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion,Alchemy", "count": 5})
    data = res.json()
    assert data["active_expansions"] == ["Dominion", "Alchemy"]


def test_random_cards_special_rules(client):
    res = client.get("/api/cards/random", params={"expansions": "Dark Ages", "count": 10})
    data = res.json()
    assert len(data["special_rules"]) > 0
    rules = " ".join(data["special_rules"])
    assert "Dark Ages" in rules


def test_random_cards_witch_rule(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion", "count": 10})
    data = res.json()
    witch_in_result = any(c["card_name"] == "Witch" for c in data["cards"])
    if witch_in_result:
        assert any("Witch" in r for r in data["special_rules"])


def test_random_cards_tournament_rule(client):
    res = client.get("/api/cards/random", params={"expansions": "Cornucopia", "count": 10})
    data = res.json()
    tournament_in_result = any(c["card_name"] == "Tournament" for c in data["cards"])
    if tournament_in_result:
        assert any("Tournament" in r for r in data["special_rules"])


def test_random_cards_response_shape(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion", "count": 10})
    data = res.json()
    assert "cards" in data
    assert "active_expansions" in data
    assert "special_rules" in data
    assert isinstance(data["cards"], list)
    assert isinstance(data["active_expansions"], list)
    assert isinstance(data["special_rules"], list)


def test_random_cards_too_many(client):
    res = client.get("/api/cards/random", params={"expansions": "Promo", "count": 10})
    assert res.status_code == 400
    detail = res.json()["detail"]
    assert "Only" in detail
    assert "available" in detail


def test_random_cards_count_too_low(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion", "count": 0})
    assert res.status_code == 422


def test_random_cards_count_too_high(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion", "count": 21})
    assert res.status_code == 422


def test_random_cards_multiple_expansions_sufficient(client):
    res = client.get("/api/cards/random", params={
        "expansions": "Dominion,Intrigue,Seaside,Alchemy,Prosperity,Cornucopia",
        "count": 20,
    })
    assert res.status_code == 200
    data = res.json()
    assert len(data["cards"]) == 20


def test_random_cards_expansion_notes_in_rules(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion", "count": 10})
    data = res.json()
    rules = " ".join(data["special_rules"])
    assert "25 cartas de Reino" in rules


def test_random_cards_events_rule(client):
    res = client.get("/api/cards/random", params={"expansions": "Adventures", "count": 10})
    data = res.json()
    rules = " ".join(data["special_rules"])
    assert "Events" in rules


def test_random_cards_landmarks_rule(client):
    res = client.get("/api/cards/random", params={"expansions": "Empires", "count": 10})
    data = res.json()
    rules = " ".join(data["special_rules"])
    assert "Landmarks" in rules


def test_random_extra_piles_prosperity(client):
    res = client.get("/api/cards/random", params={"expansions": "Prosperity", "count": 10})
    data = res.json()
    assert len(data["extra_piles"]) > 0
    labels = [p["pile_label"] for p in data["extra_piles"]]
    assert "Colony & Platinum" in labels
    colony_plat = next(p for p in data["extra_piles"] if p["pile_label"] == "Colony & Platinum")
    card_names = {c["card_name"] for c in colony_plat["cards"]}
    assert "Colony" in card_names
    assert "Platinum" in card_names


def test_random_extra_piles_alchemy(client):
    res = client.get("/api/cards/random", params={"expansions": "Alchemy", "count": 10})
    data = res.json()
    assert len(data["extra_piles"]) > 0
    labels = [p["pile_label"] for p in data["extra_piles"]]
    assert "Potion" in labels


def test_random_extra_piles_no_extra_when_not_needed(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion", "count": 10})
    data = res.json()
    assert data["extra_piles"] == []
