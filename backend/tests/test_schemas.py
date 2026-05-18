def test_list_expansions_response_model(client):
    res = client.get("/api/expansions")
    data = res.json()
    exp = data[0]
    assert isinstance(exp["id"], int)
    assert isinstance(exp["name"], str)
    assert isinstance(exp["name_es"], str)
    assert isinstance(exp["adds_extra_cards"], bool)
    assert isinstance(exp["extra_cards_description"], str)
    assert isinstance(exp["adds_events"], bool)
    assert isinstance(exp["adds_landmarks"], bool)
    assert isinstance(exp["modifies_starting_deck"], bool)
    assert isinstance(exp["modifies_starting_description"], str)
    assert isinstance(exp["notes"], str)


def test_list_cards_response_model(client):
    res = client.get("/api/cards?expansion=Dominion")
    data = res.json()
    card = data[0]
    assert isinstance(card["id"], int)
    assert isinstance(card["card_name"], str)
    assert isinstance(card["card_name_es"], str)
    assert isinstance(card["set_name"], str)
    assert isinstance(card["set_name_es"], str)
    assert isinstance(card["type"], str)
    assert isinstance(card["is_kingdom_card"], bool)
    assert isinstance(card["cost"], str)
    assert isinstance(card["card_text"], str)


def test_random_response_model(client):
    res = client.get("/api/cards/random", params={"expansions": "Dominion,Prosperity", "count": 10})
    data = res.json()
    assert isinstance(data["cards"], list)
    assert isinstance(data["active_expansions"], list)
    assert isinstance(data["special_rules"], list)
    assert isinstance(data["extra_piles"], list)
    for item in data["active_expansions"]:
        assert isinstance(item, str)
    for item in data["special_rules"]:
        assert isinstance(item, str)
