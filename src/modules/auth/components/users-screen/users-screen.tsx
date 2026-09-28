import { getUsers } from '../../data/get-users'
import { requireUser } from '../../services/current-user'
import { CreateUserForm } from '../create-user-form/create-user-form'
import { UsersTable } from '../users-table/users-table'

export async function UsersScreen() {
  const [currentUser, users] = await Promise.all([requireUser(), getUsers()])

  return (
    <>
      <CreateUserForm />
      <UsersTable users={users} currentUserId={currentUser.id} />
    </>
  )
}
