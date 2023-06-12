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

  map: <T>(collection: any): T => {
    const { _id, ...documentWithoutId } = collection
    return Object.assign({}, documentWithoutId, { id: _id.toString() })
  }
}
