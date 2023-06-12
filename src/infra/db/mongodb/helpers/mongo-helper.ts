import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  env: null as unknown as string,

  async connect (uri: string, env: string = 'prod'): Promise<void> {
    this.client = await MongoClient.connect(uri)
    this.env = env
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    const isDev = this.env === 'dev'
    if (isDev) return this.client.db('test').collection(name)
    return this.client.db('prod').collection(name)
  },

  async dropCollection (name: string): Promise<boolean> {
    const isDev = this.env === 'dev'
    if (isDev) return await this.client.db('test').collection(name).drop()
    return await this.client.db('prod').collection(name).drop()
  }
}
