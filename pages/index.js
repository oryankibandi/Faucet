import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from '../utils/loadContract';
import { usePromiseTracker, trackPromise } from 'react-promise-tracker';

var web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

export default function Home() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('10');
  const [faucetContract, setFaucetContract] = useState(null);
  const { promiseInProgress } = usePromiseTracker();
  const [shouldReload, reload] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    checkProvider();
    const getContract = async () => {
      await loadContract('Faucet', window.ethereum)
        .then(async (response) => {
          console.log('response', response);
          setFaucetContract(response);
          trackPromise(loadBalance(response));
        })
        .catch((err) => console.error('something went wrong=> ', err));
    };

    getContract();
  }, [shouldReload]);

  const loadBalance = async (loadedContract) => {
    //const { contract, web3 } = web3;
    console.log('in loadBalance()');
    console.log('FaucetContract => ', loadedContract);
    if (loadedContract) {
      console.log('getting balance');
      const balance = await web3.eth.getBalance(loadedContract.address);
      const ethBalance = web3.utils.fromWei(balance, 'ether');
      console.log('Balance: ', ethBalance);
      setBalance(ethBalance);
    }
  };
  const checkProvider = async () => {
    const provider = await detectEthereumProvider();

    if (!provider) {
      alert('Please install Metamask');
    } else {
      setProvider(provider);
      getAccounts();
      setAccountListener(provider);
    }
  };

  const setAccountListener = (provider) => {
    provider.on('accountsChanged', (updatedAccounts) => {
      setAccount(updatedAccounts[0]);
      console.log('Account updated');
    });
    provider.on('chainChanged', (_chainId) => {
      alert(`chain changed to ${_chainId}`);
      window.location.reload();
    });
  };

  const enablMetaMask = async () => {
    try {
      const acc = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('RPC methpd: ', acc);
      setAccount(acc[0]);
    } catch (error) {
      console.log('Sth went wrong: ', error);
    }
  };

  const getAccounts = async () => {
    //enablMetaMask();
    const accounts = await web3.eth.getAccounts();
    if (accounts != null && accounts.length > 0) {
      setAccount(accounts[0]);
      console.log('Accounts: ', accounts);
    } else {
      enablMetaMask();
    }
  };

  const sendCrypto = (recipientAddress) => {
    web3.eth.sendTransaction(
      {
        from: account,
        to: recipientAddress,
        value: '1000000000000000000',
      },
      [
        (error, result) => {
          console.log('Result: ', result);
        },
      ]
    );
  };

  const addFunds = async () => {
    if (faucetContract) {
      var getAmount = prompt('Enter amount to donate in ether');
      await faucetContract.addFunds({
        from: account,
        value: web3.utils.toWei(getAmount, 'ether'),
      });
      reloadEffect();
    }
  };

  const reloadEffect = () => {
    reload(!shouldReload);
  };

  const withdrawFunds = async () => {
    if (faucetContract) {
      var withdawalAmount = prompt(
        'Enter amount to withdraw in Ether. Amount must be not more than 0.1 ether'
      );
      await faucetContract
        .withdraw(web3.utils.toWei(withdawalAmount, 'ether'), {
          from: account,
        })
        .then(() => {
          alert('Withdrawal successful');
        })
        .catch((err) => {
          console.log('problem at withdrawal => ', err.message);
        });
      reloadEffect();
    }
  };
  return (
    <div className='{{styles.container}} bg-gradient-to-br from-[#ee0979] to-[#ff6a00]'>
      <Head>
        <title>Faucet</title>
        <meta
          name='description'
          content='Ian Kibandi is a Kenyan serial technopreneur and CEO of Kibandi group. He is known for revolutionalizing the tech industry and empowering Entrepreneurs in Africa through his foundation. He has been part of the movement against European cnotrol over African countries and has helped African countries benefit from their natural resources.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {account == null ? (
        provider ? (
          <div className='flex absolute top-4 right-2'>
            <button
              disabled={!account}
              className='px-4 py-2 text-white font-mono rounded-md button hover:text-black'
              onClick={() => getAccounts()}
            >
              Connect
            </button>
          </div>
        ) : (
          <div>
            <h2>
              Wallet not detected! Please install{' '}
              <a
                href='https://docs.metamask.io'
                className='text-blue-500 cursor-pointer'
              >
                Metamask
              </a>
            </h2>
          </div>
        )
      ) : (
        <div className='flex absolute top-4 right-2 w-[25%] h-[10%] items-center bg-slate-300 px-2 py-1 rounded-3xl justify-between'>
          <div className='flex items-center w-full space-x-1'>
            <Image
              src='https://blockbuild.africa/wp-content/uploads/2021/11/MetaMask.jpg'
              alt=''
              height={100}
              width={100}
              className='rounded-full'
            />

            <p className='text-ellipsis overflow-hidden whitespace-nowrap text-gray-500'>
              {account}
            </p>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <div>
          <h1 className='text-white font-mono text-xl'>
            Current Balance:{' '}
            <strong className='text-2xl bg-neutral-900 p-2 rounded-lg'>
              {promiseInProgress ? '...' : balance} Eth
            </strong>
          </h1>
          <div className='flex justify-evenly mt-10'>
            <button
              disabled={!account}
              className='px-4 py-2 text-white b font-mono rounded-md button  hover:bg-blue-600'
              onClick={() => addFunds()}
            >
              Donate
            </button>
            <button
              disabled={!account}
              className='px-4 py-2 text-white font-mono rounded-md button hover:bg-green-600'
              onClick={() => withdrawFunds()}
            >
              Withdraw
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
