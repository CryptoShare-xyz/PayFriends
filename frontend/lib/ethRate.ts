'use server'

export async function getEthRate() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', { next: { revalidate: 1 * 60 * 60 } });
    const data = await response.json();
    const rate = Number(data.ethereum.usd)
    return !Number.isNaN(rate) ? rate : 0;
}