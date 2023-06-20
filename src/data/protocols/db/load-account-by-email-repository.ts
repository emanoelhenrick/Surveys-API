import { type AccountModel } from '../../usecases/add-account/db-add-account-procotols'

export interface LoadAccountByEmailRepository {
  load (email: string): Promise<AccountModel>
}
