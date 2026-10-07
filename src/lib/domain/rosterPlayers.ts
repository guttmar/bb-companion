export type IndividualPlayer = {
	id: string;
	name?: string;
	number: number;
	numberCustomized?: boolean;
	skills: string[];
};

export type IndividualPlayers = Record<string, IndividualPlayer[]>;

export function createIndividualPlayer(existing: IndividualPlayers): IndividualPlayer {
	const usedIds = new Set(Object.values(existing).flat().map((player) => player.id));
	const usedNumbers = new Set(Object.values(existing).flat().map((player) => player.number));
	let number = 1;
	while (usedNumbers.has(number) && number <= 99) number++;
	return {
		id: createId(usedIds),
		number: number <= 99 ? number : 0,
		skills: []
	};
}

export function syncIndividualPlayers(
	counts: Record<string, number>,
	individualPlayers: IndividualPlayers | undefined
): IndividualPlayers {
	const synced: IndividualPlayers = Object.fromEntries(
	Object.entries(counts).map(([positionId, count]) => [
		positionId,
		[...(individualPlayers?.[positionId] ?? [])].slice(0, count)
	])
	);
	for (const [positionId, count] of Object.entries(counts)) {
		const players = synced[positionId];
		while (players.length < count) players.push(createIndividualPlayer(synced));
	}
	return synced;
}

export function isCustomizedPlayer(player: IndividualPlayer): boolean {
	return Boolean(player.name?.trim() || player.numberCustomized || player.skills.length);
}

function createId(existing: Set<string>): string {
	let id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
	while (existing.has(id)) id = `${id}-x`;
	return id;
}