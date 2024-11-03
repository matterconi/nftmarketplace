export const getCreators = (nfts) => {
    if(!Array.isArray(nfts)) return [];
    const creatorTotals = nfts.reduce((acc, nft) => {
      const { seller, price } = nft;
      acc[seller] = (acc[seller] || 0) + Number(price);
      return acc;
    }, {});
  
    // Use Object.entries to map creator and value directly
    const result = Object.entries(creatorTotals).map(([creator, value]) => ({
      creator,
      value
    }));
  
    // Sort by value in descending order
    result.sort((a, b) => b.value - a.value);
  
    return result.slice(0, 10); // Limit to top 10 creators
  };
  