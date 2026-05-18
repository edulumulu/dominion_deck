def test_list_expansions(client):
    res = client.get("/api/expansions")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 15
    names = {e["name"] for e in data}
    assert "Dominion" in names
    assert "Intrigue" in names
    assert "Dark Ages" in names


def test_expansion_fields(client):
    res = client.get("/api/expansions")
    data = res.json()
    exp = next(e for e in data if e["name"] == "Dominion")
    assert exp["name_es"] == "Dominion"
    assert exp["adds_extra_cards"] is False
    assert exp["adds_events"] is False
    assert exp["adds_landmarks"] is False
    assert exp["modifies_starting_deck"] is False
    assert "25 cartas de Reino" in exp["notes"]


def test_expansion_with_features(client):
    res = client.get("/api/expansions")
    data = res.json()
    dark_ages = next(e for e in data if e["name"] == "Dark Ages")
    assert dark_ages["adds_extra_cards"] is True
    assert dark_ages["modifies_starting_deck"] is True
    assert "Necropolis" in dark_ages["modifies_starting_description"]

    adventures = next(e for e in data if e["name"] == "Adventures")
    assert adventures["adds_events"] is True

    empires = next(e for e in data if e["name"] == "Empires")
    assert empires["adds_events"] is True
    assert empires["adds_landmarks"] is True
