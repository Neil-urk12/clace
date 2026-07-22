import { describe, test, expect } from 'bun:test';
import { InMemoryUserStore } from '../inMemoryUserStore';
import { NotFoundError, ConflictError } from '../../lib/errors';

describe('InMemoryUserStore', () => {
  test('create and find user', async () => {
    const store = new InMemoryUserStore();
    const created = await store.create({
      email: 'bob@example.com',
      fullName: 'Bob Smith',
      passwordPlain: 'password123',
    });
    expect(created.email).toBe('bob@example.com');
    expect(created.fullName).toBe('Bob Smith');
    expect(created.role).toBe('Student');

    const found = await store.findByEmail('bob@example.com');
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  test('findById success and throws NotFoundError when missing', async () => {
    const store = new InMemoryUserStore();
    const created = await store.create({
      email: 'alice@example.com',
      fullName: 'Alice Smith',
      passwordPlain: 'password123',
    });

    const found = await store.findById(created.id);
    expect(found.id).toBe(created.id);
    expect(found.email).toBe('alice@example.com');

    expect(store.findById('non-existent-id')).rejects.toThrow(NotFoundError);
    expect(store.findById('non-existent-id')).rejects.toThrow('User not found');
  });

  test('create throws ConflictError when email already exists', async () => {
    const store = new InMemoryUserStore();
    await store.create({
      email: 'existing@example.com',
      fullName: 'User One',
      passwordPlain: 'password123',
    });

    expect(
      store.create({
        email: 'existing@example.com',
        fullName: 'User Two',
        passwordPlain: 'password456',
      })
    ).rejects.toThrow(ConflictError);
  });

  test('update name and email, plus throwing ConflictError when updating to existing email', async () => {
    const store = new InMemoryUserStore();
    const user1 = await store.create({
      email: 'user1@example.com',
      fullName: 'User One',
      passwordPlain: 'password123',
    });
    const user2 = await store.create({
      email: 'user2@example.com',
      fullName: 'User Two',
      passwordPlain: 'password123',
    });

    const updated = await store.update(user1.id, {
      fullName: 'User One Updated',
      email: 'user1updated@example.com',
    });
    expect(updated.fullName).toBe('User One Updated');
    expect(updated.email).toBe('user1updated@example.com');

    expect(
      store.update(user1.id, {
        email: 'user2@example.com',
      })
    ).rejects.toThrow(ConflictError);

    expect(
      store.update('non-existent-id', {
        fullName: 'Ghost',
      })
    ).rejects.toThrow(NotFoundError);
  });

  test('verify credentials and updatePassword validation', async () => {
    const store = new InMemoryUserStore();
    const created = await store.create({
      email: 'bob@example.com',
      fullName: 'Bob Smith',
      passwordPlain: 'password123',
    });

    const valid = await store.verifyCredential(created.id, 'password123');
    expect(valid).toBe(true);
    const invalid = await store.verifyCredential(created.id, 'wrong');
    expect(invalid).toBe(false);

    const nonExistent = await store.verifyCredential('non-existent-id', 'password123');
    expect(nonExistent).toBe(false);

    await store.updatePassword(created.id, 'newpassword456');
    const oldValid = await store.verifyCredential(created.id, 'password123');
    expect(oldValid).toBe(false);
    const newValid = await store.verifyCredential(created.id, 'newpassword456');
    expect(newValid).toBe(true);

    expect(store.updatePassword('non-existent-id', 'newpassword')).rejects.toThrow(NotFoundError);
  });
});
