import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  savedTeams,
  saveTeam,
  updateTeam,
  deleteTeam,
  getSavedTeam,
  type SavedTeam
} from './savedTeams';

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
});
