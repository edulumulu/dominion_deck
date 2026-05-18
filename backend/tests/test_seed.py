def test_non_supply_cards_not_kingdom(client):
    res = client.get("/api/cards?kingdom_only=false")
    data = res.json()
    non_kingdom = [c for c in data if not c["is_kingdom_card"]]
    names = {c["card_name"] for c in non_kingdom}
    assert "Madman" in names
    assert "Mercenary" in names
    assert "Spoils" in names


def test_ruins_not_kingdom(client):
    res = client.get("/api/cards?kingdom_only=false")
    data = res.json()
    ruins = [c for c in data if c["type"].endswith("Ruins")]
    for card in ruins:
        assert card["is_kingdom_card"] is False


def test_shelters_not_kingdom(client):
    res = client.get("/api/cards?kingdom_only=false")
    data = res.json()
    shelters = [c for c in data if c["type"].endswith("Shelter")]
    for card in shelters:
        assert card["is_kingdom_card"] is False


def test_prizes_not_kingdom(client):
    res = client.get("/api/cards?kingdom_only=false")
    data = res.json()
    prizes = [c for c in data if c["type"].endswith("Prize")]
    for card in prizes:
        assert card["is_kingdom_card"] is False


def test_translations_applied(client):
    res = client.get("/api/cards?kingdom_only=false")
    data = res.json()
    translations = {c["card_name"]: c["card_name_es"] for c in data}
    assert translations.get("Witch") == "Bruja"
    assert translations.get("Market") == "Mercado"
    assert translations.get("Chapel") == "Capilla"
    assert translations.get("Laboratory") == "Laboratorio"


def test_expansion_translations(client):
    res = client.get("/api/cards?kingdom_only=false")
    data = res.json()
    sets = {c["set_name"]: c["set_name_es"] for c in data}
    assert sets.get("Intrigue") == "Intriga"
    assert sets.get("Seaside") == "Terramar"
    assert sets.get("Dark Ages") == "Edad Oscura"
