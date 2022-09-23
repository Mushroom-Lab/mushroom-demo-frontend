export enum Env {
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export interface Endpoint {
  ceramicUrl: string;
  mushroomCardsSchema: string;
  modelAliases: object;
}

export const endpoints: { [key in Env]: Endpoint } = {
  STAGING: {
    ceramicUrl: 'https://ceramic.staging.dpopp.gitcoin.co/',
    mushroomCardsSchema: 'kjzl6cwe1jw149cvdnq7mtw5c1s9wgx7vbcbljs03jl2lk5ez52h33mszf3ghes',
    modelAliases: {
      "definitions": {
        "mushroomCards": "kjzl6cwe1jw149cvdnq7mtw5c1s9wgx7vbcbljs03jl2lk5ez52h33mszf3ghes"
      },
      "schemas": {
        "MushroomCards": "ceramic://k3y52l7qbv1frxidaabkxjban6ky9qs2a9j51lu3ix4fjej6mhacqrlk43h9svfnk"},
      "tiles":{}
    }
  },
  PRODUCTION: {
    ceramicUrl: 'https://ceramic.passport-iam.gitcoin.co/',
    mushroomCardsSchema: 'kjzl6cwe1jw14blec8i5u4ezyortrbs7dep87ax0x4ih3gf11db7sm5839lda8w',
    modelAliases: {
      "definitions": {
        "mushroomCards": "kjzl6cwe1jw149cvdnq7mtw5c1s9wgx7vbcbljs03jl2lk5ez52h33mszf3ghes"
      },
      "schemas": {
        "MushroomCards": "ceramic://k3y52l7qbv1frxidaabkxjban6ky9qs2a9j51lu3ix4fjej6mhacqrlk43h9svfnk"},
      "tiles":{}
    }
  },
};
