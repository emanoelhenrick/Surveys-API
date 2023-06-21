export interface UpdateAccessTokenRepository {
  updateAccessToken (id: string, token: string): Promise<string>
}
