def test_list_cards_count(client):
    res = client.get("/api/cards")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0


def test_list_cards_kingdom_only(client):
    res = client.get("/api/cards?kingdom_only=true")
    data = res.json()
    for card in data:
        assert card["is_kingdom_card"] is True


def test_list_cards_all_includes_non_kingdom(client):
    res_kingdom = client.get("/api/cards?kingdom_only=true")
    res_all = client.get("/api/cards?kingdom_only=false")
    assert len(res_all.json()) > len(res_kingdom.json())

    non_kingdom = [c for c in res_all.json() if not c["is_kingdom_card"]]
    assert len(non_kingdom) > 0


def test_list_cards_excludes_ruins_shelters_prizes(client):
    res = client.get("/api/cards?kingdom_only=true")
    data = res.json()
    kingdom_types = {c["type"] for c in data}
    assert not any(t.endswith("Ruins") for t in kingdom_types)
    assert not any(t.endswith("Shelter") for t in kingdom_types)
    assert not any(t.endswith("Prize") for t in kingdom_types)

    names = {c["card_name"] for c in data}
    assert "Madman" not in names
    assert "Mercenary" not in names
    assert "Spoils" not in names


def test_list_cards_by_expansion(client):
    res = client.get("/api/cards?expansion=Dominion")
    data = res.json()
    assert len(data) > 0
    for card in data:
        assert card["set_name"] == "Dominion"


def test_list_cards_by_expansion_nonexistent(client):
    res = client.get("/api/cards?expansion=NonExistent")
    assert res.status_code == 400


def test_card_fields(client):
    res = client.get("/api/cards?expansion=Dominion")
    data = res.json()
    card = data[0]
    assert "id" in card
    assert "card_name" in card
    assert "card_name_es" in card
    assert "set_name" in card
    assert "set_name_es" in card
    assert "type" in card
    assert "is_kingdom_card" in card
    assert "cost" in card
    assert "card_text" in card


def test_card_spanish_translations(client):
    res = client.get("/api/cards?expansion=Dominion")
    data = res.json()
    witch = next(c for c in data if c["card_name"] == "Witch")
    assert witch["card_name_es"] == "Bruja"
