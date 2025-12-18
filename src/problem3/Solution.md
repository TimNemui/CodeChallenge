
type Blockchain = 'Ethereum'| 'Neo' |'Osmosis'| 'Arbitrum' | 'Zilliqa';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

// Blockchain priority for sorting (higher = shown first)
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

export const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedFilteredBalances = useMemo<FormattedWalletBalance[]>(() => {
    if (!balances.length) return [];

    return balances
      .filter((balance): boolean => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(4), // More reasonable precision than toFixed() with no args
        usdValue: (prices?.[balance.currency] ?? 0) * balance.amount,
      }));
  }, [balances, prices]);

  const rows = useMemo(() => {
    return sortedFilteredBalances.map((balance) => (
      <WalletRow
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}`} 
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    ));
  }, [sortedFilteredBalances]);

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};