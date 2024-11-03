export const shortenAddress = (address) => {

    return address.length > 10 ? `${address.slice(0, 4)}...${address.slice(-4)}` : address;
}