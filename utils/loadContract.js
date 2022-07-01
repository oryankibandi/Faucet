import contract from '@truffle/contract';

export const loadContract = async (name, provider) => {
  const res = await fetch(`abis/contracts/${name}.json`);
  const Artifact = await res.json();

  const _contract = contract(Artifact);

  _contract.setProvider(provider);
  let depoyedContract;

  try {
    depoyedContract = _contract.deployed();
  } catch (error) {
    console.error('Not connected to the network');
  }

  return depoyedContract;
};
