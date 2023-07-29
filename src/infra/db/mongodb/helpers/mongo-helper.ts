import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient | null,
  uri: null as unknown as string,
  env: null as unknown as string,

  async connect (uri: string, env: string = 'prod'): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
    this.env = env
  },

  async disconnect (): Promise<void> {
    if (!this.client) return
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (this.env === 'dev') {
      if (!this.client) await this.connect(this.uri, 'dev')
      return this.client!.db('test').collection(name)
    }
    if (!this.client) await this.connect(this.uri)
    return this.client!.db('prod').collection(name)
  },

  map <T>(collection: any): T {
    const { _id, ...documentWithoutId } = collection
    return Object.assign({}, documentWithoutId, { id: _id.toString() })
  },

  mapToArray <T>(collection: any[]): T[] {
    return collection.map(c => MongoHelper.map(c))
  }
}
