import { ExTable } from './ex-table.entity';

describe('ExTable (entity)', () => {
  describe('create', () => {
    it('sets updatedBy = createdBy on creation', () => {
      const payload = ExTable.create('Order #1', 'user-1');

      expect(payload).toEqual({
        name: 'Order #1',
        createdBy: 'user-1',
        updatedBy: 'user-1',
      });
    });
  });

  describe('reconstitute', () => {
    it('rebuilds an entity from persisted data', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      const entity = ExTable.reconstitute(
        'id-1',
        'Order #1',
        now,
        'user-1',
        now,
        'user-1',
      );

      expect(entity.id).toBe('id-1');
      expect(entity.name).toBe('Order #1');
      expect(entity.createdAt).toEqual(now);
    });
  });

  describe('update', () => {
    it('returns only mutable fields with the new updatedBy', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      const entity = ExTable.reconstitute(
        'id-1',
        'Order #1',
        now,
        'user-1',
        now,
        'user-1',
      );

      const patch = entity.update('Order #1 (renamed)', 'user-2');

      expect(patch).toEqual({
        name: 'Order #1 (renamed)',
        updatedBy: 'user-2',
      });
    });
  });
});
