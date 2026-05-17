const IMAGE_BASE =
  "https://raw.githubusercontent.com/connorburt/dominion-cards/master/cards";

export function getCardImageUrl(cardName: string): string {
  const filename = cardName
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${IMAGE_BASE}/${filename}.jpg`;
}
