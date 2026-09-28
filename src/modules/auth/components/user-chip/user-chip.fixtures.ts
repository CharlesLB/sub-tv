import type { AppUser } from '../../services/user-service'
import { currentUserRowFixture } from '../users-table/users-table.fixtures'

export const signedInUserFixture: AppUser = { id: currentUserRowFixture.id, username: currentUserRowFixture.username }
