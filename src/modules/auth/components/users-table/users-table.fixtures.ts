import type { UserRowVM } from '../../data/get-users'

export const currentUserRowFixture: UserRowVM = {
  id: '3b1f6a2e-5c4d-4e8f-9a1b-2c3d4e5f6a70',
  username: 'Marina Couto',
  isActive: true,
  lastSignInAt: '2026-09-20T13:05:00.000Z',
}

export const activeUserRowFixture: UserRowVM = {
  id: '7c2e9b41-8d3a-4f6b-a5c1-0e9d8c7b6a51',
  username: 'Otávio Prado',
  isActive: true,
  lastSignInAt: null,
}

export const inactiveUserRowFixture: UserRowVM = {
  id: 'a9d8c7b6-5e4f-4a3b-8c2d-1e0f9a8b7c62',
  username: 'Renata Faria',
  isActive: false,
  lastSignInAt: '2026-08-02T22:40:00.000Z',
}

export const userRowsFixture: UserRowVM[] = [currentUserRowFixture, activeUserRowFixture, inactiveUserRowFixture]
