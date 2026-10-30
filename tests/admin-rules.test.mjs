import test from 'node:test'
import assert from 'node:assert/strict'
import { validCommitteeTerm, normalizeMemberEmail } from '../lib/admin-rules.ts'

test('committee terms accept a valid interval and reject impossible or reversed dates', () => {
  assert.equal(validCommitteeTerm('2026-01-01', '2026-12-31'), true)
  assert.equal(validCommitteeTerm(null, null), true)
  assert.equal(validCommitteeTerm('2026-02-30', '2026-12-31'), false)
  assert.equal(validCommitteeTerm('2027-01-01', '2026-12-31'), false)
})

test('member email normalization rejects invalid records and matches case-insensitive duplicates', () => {
  assert.equal(normalizeMemberEmail(' Person@Example.com '), 'person@example.com')
  assert.equal(normalizeMemberEmail('person@example.com'), 'person@example.com')
  assert.equal(normalizeMemberEmail('person @example.com'), null)
  assert.equal(normalizeMemberEmail(''), null)
})
