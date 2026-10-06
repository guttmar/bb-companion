import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  savedTeams,
  saveTeam,
  updateTeam,
  deleteTeam,
  ensureTeamShare,
  importSharedTeam,
  type SavedTeam
} from './savedTeams';
import type { SharedTeamPayload } from '$lib/tools/teamSharing';

// helpers for constructing minimal payloads
function makePayload(name?: string): Omit<SavedTeam, 'id'> {
  return {
    name,
    selectedTeamId: 'human',
    roster: { players: {}, reRolls: 0, apothecary: 0 }
  };
}

describe('savedTeams store', () => {
  beforeEach(() => {
    // clear the store; we don't touch localStorage so this only affects
    // in-memory data that persisted between tests
    savedTeams.set([]);
  });

  it('saveTeam adds a new entry and returns its id', () => {
    const id = saveTeam(makePayload('foo'));
    const list = get(savedTeams);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(id);
    expect(list[0].name).toBe('foo');
  });

  it('preserves selected star players when saving a roster', () => {
    const id = saveTeam({
      ...makePayload('stars'),
      roster: { players: {}, stars: { 'Akhorne the Squirrel': 1 }, reRolls: 0, apothecary: 0 }
    });

    expect(get(savedTeams)[0].roster.stars).toEqual({ 'Akhorne the Squirrel': 1 });
  });

  it('updateTeam modifies an existing team without adding a second item', () => {
    const id = saveTeam(makePayload('one'));
    updateTeam(id, { name: 'one-updated' });
    const list = get(savedTeams);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(id);
    expect(list[0].name).toBe('one-updated');
  });

  it('updateTeam with invalid id leaves store untouched', () => {
    const id = saveTeam(makePayload('foo'));
    const before = get(savedTeams);
    updateTeam('not-a-real-id', { name: 'bar' });
    const after = get(savedTeams);
    expect(after).toEqual(before);
  });

  it('keeps a share identity until the saved team data changes', () => {
    const id = saveTeam({ ...makePayload('shared'), ruleset: '2025', mode: '11s' });
    const firstShare = ensureTeamShare(id, '2025', '11s');
    const repeatedShare = ensureTeamShare(id, '2025', '11s');

    expect(repeatedShare?.shareId).toBe(firstShare?.shareId);
    updateTeam(id, { roster: { players: {}, stars: {}, reRolls: 0, apothecary: 0 } });
    expect(ensureTeamShare(id, '2025', '11s')?.shareId).toBe(firstShare?.shareId);
    updateTeam(id, { name: 'edited' });
    expect(ensureTeamShare(id, '2025', '11s')?.shareId).not.toBe(firstShare?.shareId);
  });

  it('imports each shared identity once, and permits it again after deletion', () => {
    const shared: SharedTeamPayload = {
      version: 1,
      shareId: 'source-share-1',
      ruleset: '2025',
      mode: '11s',
      team: {
        name: 'Imported',
        selectedTeamId: 'human',
        roster: { players: { catcher: 2 }, stars: { 'Akhorne the Squirrel': 1 }, reRolls: 1, apothecary: 0 },
        startingTreasury: 1000000
      }
    };

    expect(importSharedTeam(shared)).toBe('added');
    expect(importSharedTeam(shared)).toBe('duplicate');
    expect(get(savedTeams)).toHaveLength(1);
    expect(get(savedTeams)[0]).toMatchObject({
      shareId: 'source-share-1',
      name: 'Imported',
      ruleset: '2025',
      mode: '11s',
      roster: shared.team.roster
    });

    deleteTeam(get(savedTeams)[0].id);
    expect(importSharedTeam(shared)).toBe('added');
    expect(get(savedTeams)).toHaveLength(1);
  });
});
