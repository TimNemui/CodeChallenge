interface WalletBalance {
  currency: string;
  amount: number;
  
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
### using any in Typescript kinda defeat it purpose
	const getPriority = (blockchain: any): number => {
### Use record to make it constant and lookup easy, also we can put these into a Type of Blockchain instead for more ease of use   
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
  ### Missing blockchain inside WalletBalance interface, this line might create runtime issue
		  const balancePriority = getPriority(balance.blockchain);
  ### lshPriority was never declared -> throw reference error
		  if (lhsPriority > -99) {
  ### Logic seam backward will do the opposite of what it should be doing
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
  ### incomplte sort no way to handle case when priorities are the same value
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  ### Prices is not being used within useMemo, will cause unnescesarry re-compute
  }, [balances, prices]);
### `formattedBalances` is created but never used waste resource
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })
 ### rows maps over sortedBalances but types it as FormattedWalletBalance even though sortedBalances items don’t have formatted yet, will cause type error and runtime error.

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  ### This get calculate everytime even when nothing change, wasting compute power
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
  ### using index as key for a list that have content change can cause unnecessary 
  ### re-renders, wrong animations, and potential state bugs in child components. Should use some unique stable ID
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}