// types.ts
export interface NetworkAddresses {
  USDT: string;
  USDC: string;
  MATIC?: string;
  BNB?: string;
  FTM?: string;
  SOL?: string;
  BUSD?: string;
  WAVES?: string;
}

export type Currency = 'USDT' | 'USDC' | 'MATIC' | 'BNB' | 'FTM' | 'SOL' | 'BUSD' | 'WAVES';
export type Network = 1 | 137 | 56 | 250;

// constants.ts
const USDT_ADDRESS_POLYGON = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
const USDC_ADDRESS_POLYGON = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const USDT_ADDRESS_ETH = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDC_ADDRESS_ETH = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const MATIC_ADDRESS_ETH = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
const BNB_ADDRESS_ETH = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';
const FTM_ADDRESS_ETH = '0x4E15361FD6b4BB609Fa63C81A2be19d873717870';
const SOL_ADDRESS_ETH = '0x1F54638b7737193FFd86c19Ec51907A7c41755D8';
const BUSD_ADDRESS_ETH = '0x4Fabb145d64652a948d72533023f6E7A623C7C53';
const WAVES_ADDRESS_ETH = '0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a';

const USDT_ADDRESS_BNB = '0x55d398326f99059fF775485246999027B3197955';
const USDC_ADDRESS_BNB = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';

const USDT_ADDRESS_FAN = '0x049d68029688eAbF473097a2fC38ef61633A3C7A';
const USDC_ADDRESS_FAN = '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75';

const POLYGON_ADDRESSES: NetworkAddresses = {
  USDT: USDT_ADDRESS_POLYGON,
  USDC: USDC_ADDRESS_POLYGON
};

const ETH_ADDRESSES: NetworkAddresses = {
  USDT: USDT_ADDRESS_ETH,
  USDC: USDC_ADDRESS_ETH,
  MATIC: MATIC_ADDRESS_ETH,
  BNB: BNB_ADDRESS_ETH,
  FTM: FTM_ADDRESS_ETH,
  SOL: SOL_ADDRESS_ETH,
  BUSD: BUSD_ADDRESS_ETH,
  WAVES: WAVES_ADDRESS_ETH
};

const BNB_ADDRESSES: NetworkAddresses = {
  USDT: USDT_ADDRESS_BNB,
  USDC: USDC_ADDRESS_BNB
};

const FANTOM_ADDRESSES: NetworkAddresses = {
  USDT: USDT_ADDRESS_FAN,
  USDC: USDC_ADDRESS_FAN
};

const addressByNetwork = (network: Network): NetworkAddresses => {
  switch (network) {
    case 1:
      return ETH_ADDRESSES;
    case 137:
      return POLYGON_ADDRESSES;
    case 56:
      return BNB_ADDRESSES;
    case 250:
      return FANTOM_ADDRESSES;
    default:
      return ETH_ADDRESSES;
  }
};

const availableCurrencies: Currency[] = ['USDT', 'USDC', 'WAVES', 'BUSD', 'SOL', 'BNB'];

// main.ts
import ERC20ABI from '~/assets/abis.json';

type HostLocation =
  | 'localhost'
  | 'defibank.online'
  | 'app.defibank.online'
  | 'berg.finance'
  | 'sumerus.com'
  | 'app.honeystonecap.com'
  | 'app.liquidnow.me';

interface Web3Contract {
  eth: {
    net: {
      getId(): Promise<Network>;
    };
    Contract: {
      new(abi: any, address: string): any;
    };
  };
}

class ContractService {
  constructor() {
  }
  readonly HOST_TITLES: Record<HostLocation, string> = {
    'localhost': 'Liquid Now',
    'defibank.online': 'Defibank Online',
    'app.defibank.online': 'Defibank Online',
    'berg.finance': 'Berg Finance',
    'sumerus.com': 'Sumerus',
    'app.honeystonecap.com': 'HoneyStone Capital',
    'app.liquidnow.me': 'Liquid Now'
  };

  public hostToTitle(location: string): string {
    return this.HOST_TITLES[location as HostLocation] || 'Liquid Now';
  }

  public replaceHostToTitle(location: string, str: string): string {
    const title = this.hostToTitle(location);
    return str.replace(/[c|C]apella[\.|\s][f|F]inance/gm, title);
  }

  static contactAddress(currency: Currency, network: Network): string {
    const addresses = addressByNetwork(network);
    const address = addresses[currency];

    if (!address) {
      throw new Error(`Currency ${currency} not supported on network ${network}`);
    }

    return address;
  }

  static get availableCurrencies(): Currency[] {
    return availableCurrencies;
  }

  static async contractFactory(currency: Currency, web3: Web3Contract): Promise<any> {
    const network: Network = await web3.eth.net.getId();
    return new web3.eth.Contract(
      ERC20ABI,
      this.contactAddress(currency, network)
    );
  }
}

export default ContractService;
