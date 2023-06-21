import { type AccountModel } from '../../../usecases/add-account/db-add-account-procotols'

export interface LoadAccountByEmailRepository {
  loadByEmail (email: string): Promise<AccountModel | null>
}
