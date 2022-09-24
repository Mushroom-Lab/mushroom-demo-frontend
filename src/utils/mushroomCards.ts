import { CeramicClient } from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { endpoints, Env, Endpoint } from './network';
import { DIDSession } from 'did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { DataModel } from '@glazed/datamodel'
import { DIDDataStore } from '@glazed/did-datastore'
import { postSessionToDB, postUserInfoToCeramic } from './query';
import {formatSig, formatAddress, formatDid} from "@/utils/helper"

interface Profile {
  guildId: number;
  userId: number;
  address: string;
  level: number;
  popularityLevel: number;
  updatedAt: string;
}

interface Card {
  profile: Profile;
  signature: string;
  signerAddr: string;
}

type Cards = Card[];

interface MushroomCardsStore {
  cards: Cards;
}

class MushroomCards {
  address: string = '';
  namespace: string;
  endpoint: Endpoint;
  ethProvider: any;
  ceramicClient: CeramicClient;
  authProvider: EthereumAuthProvider | undefined;
  resolverRegistry: any;
  idxInstance: IDX | undefined;
  store: DIDDataStore| undefined;

  constructor(config: {
    provider: any;
    namespace: string;
    env: keyof typeof Env;
  }) {
    const { provider, namespace, env } = config;
    this.ethProvider = provider;

    this.namespace = namespace;
    this.endpoint = endpoints[env] || endpoints.PRODUCTION;
    this.ceramicClient = new CeramicClient(this.endpoint.ceramicUrl);

    if (!this.ethProvider) return;

    this.ethProvider.provider.enable().then((addresses: string[]) => {
      if (addresses[0]) {
        this.address = addresses[0];
        this.authProvider = new EthereumAuthProvider(this.ethProvider.provider, this.address);
        console.log("constructor5", this.authProvider)
      }
    });
  }
  
  async authenticate(userId: string, guildId: string) {

    if (this.store) {
      return;
    }

    if (!this.authProvider) {
      console.error('Could not find authProvider');
      return;
    }

    console.log("authenticate_test")
    const provider = this.ethProvider.provider;
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });
    const authProvider = new EthereumAuthProvider(provider, accounts[0]);
    const account_id = await authProvider.accountId()
    console.log("account_id", account_id)
    
    console.log("authenticate_test1")

    const oneDecade = 60 * 60 * 24 * 365 * 10
    const session = await DIDSession.authorize(authProvider, { resources: [`ceramic://*`], expiresInSecs: oneDecade })

    console.log("authenticate_test2", session)
    console.log("authenticate_test2 ceramicUrl", this.endpoint.ceramicUrl)
    
    const ceramic = new CeramicClient(this.endpoint.ceramicUrl);
    ceramic.did = session.did

    const sessionString = session.serialize()
    // write to backend
    console.log(sessionString)
    console.log("authenticate_test2", ceramic.did)

    console.log("postSessionToDB", userId, guildId, session.did.parent)

    const result = await postSessionToDB(sessionString, userId, guildId, session.did.parent);
    console.log(result)
    
  }

  async getMushroomCards() {
    if (!this.store) {
      console.error('Could not find idx instance');
      return [];
    }
    
    const result = (await this.store.get('mushroomCards')) as MushroomCardsStore;

    return result?.cards || [];
  }

  async upload(cardInfo: any, userId: string, guildId: string, alias: string = 'none') {

    await this.authenticate(userId, guildId);

    console.log("postUserInfoToCeramic")
    console.log("postUserInfoToCeramic", cardInfo)
    const result = await postUserInfoToCeramic(cardInfo["userId"], cardInfo["guildId"], cardInfo["level"], cardInfo["popularityLevel"]);
    console.log(result)
    console.log("postUserInfoToCeramic end")
    const streamId = result["stream_id"] as string
    const onchainProfile = {
      "guildId": result["content"]["profile"]["guildId"] as string,
      "userId": result["content"]["profile"]["userId"] as string,
      "level": result["content"]["profile"]["level"] as string,
      "popularityLevel": result["content"]["profile"]["popularityLevel"] as string,
      "address": formatDid(result["content"]["profile"]["address"] as string),
      "updatedAt": result["content"]["profile"]["updatedAt"] as string,
      "signature": formatSig(result["content"]["signature"] as string),
      "signerAddr": formatAddress(result["content"]["signerAddr"] as string),
    }
    console.log("before return ", streamId, onchainProfile)
    return {streamId, onchainProfile}
  }
}

export default MushroomCards;
